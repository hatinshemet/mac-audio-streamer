import Foundation
import AVFoundation
import Network
import UIKit

class AudioReceiver: ObservableObject {
    @Published var isReceiving = false
    @Published var status = "Ready"
    
    private var audioEngine: AVAudioEngine?
    private var playerNode: AVAudioPlayerNode?
    private var udpConnection: NWConnection?
    private let port: UInt16 = 3001
    private var backgroundTaskID: UIBackgroundTaskIdentifier = .invalid
    
    deinit {
        NotificationCenter.default.removeObserver(self)
        endBackgroundTask()
    }
    
    func startReceiving() {
        status = "Starting..."
        setupBackgroundTask()
        setupAudioSession()
        setupAudioEngine()
        configureAudioRoute()
        isReceiving = true
    }
    
    func stopReceiving() {
        status = "Stopping..."
        audioEngine?.stop()
        udpConnection?.cancel()
        endBackgroundTask()
        isReceiving = false
        audioBufferCount = 0
        status = "Ready"
    }
    
    func connectToServer(ip: String, port: UInt16) {
        status = "Connecting to \(ip):\(port)..."
        
        let host = NWEndpoint.Host(ip)
        let port = NWEndpoint.Port(integerLiteral: port)
        let endpoint = NWEndpoint.hostPort(host: host, port: port)
        
        let connection = NWConnection(to: endpoint, using: .udp)
        self.udpConnection = connection
        
        connection.stateUpdateHandler = { [weak self] state in
            DispatchQueue.main.async {
                switch state {
                case .ready:
                    self?.status = "Connected to Mac server"
                    self?.sendHelloMessage()
                    self?.receiveAudioData()
                case .failed(let error):
                    self?.status = "Connection failed: \(error.localizedDescription)"
                case .cancelled:
                    self?.status = "Connection cancelled"
                default:
                    self?.status = "Connection state: \(state)"
                }
            }
        }
        
        connection.start(queue: .global())
    }
    
    private func setupAudioSession() {
        do {
            let audioSession = AVAudioSession.sharedInstance()
            
            // Configure for background audio playback with hearing aid support
            try audioSession.setCategory(
                .playback, 
                mode: .default, 
                options: [
                    .defaultToSpeaker, 
                    .allowBluetooth, 
                    .allowBluetoothA2DP,
                    .mixWithOthers  // Allow mixing with other audio (like Zoom)
                ]
            )
            
            // Enable background audio with proper options
            try audioSession.setActive(true, options: [.notifyOthersOnDeactivation])
            
            // Check current audio route
            let currentRoute = audioSession.currentRoute
            let outputDescription = currentRoute.outputs.map { $0.portName }.joined(separator: ", ")
            status = "Audio configured for background - Output: \(outputDescription)"
            
            print("🎵 Background audio enabled - Route: \(outputDescription)")
            print("🎵 Available outputs: \(audioSession.availableInputs?.map { $0.portName } ?? [])")
            
            // Set up audio session interruption handling
            setupAudioSessionNotifications()
            
        } catch {
            status = "Audio session error: \(error.localizedDescription)"
            print("❌ Audio session setup failed: \(error)")
        }
    }
    
    private func configureAudioRoute() {
        do {
            let audioSession = AVAudioSession.sharedInstance()
            
            // Force audio to speaker for better compatibility
            try audioSession.overrideOutputAudioPort(.speaker)
            
            // Check the route again
            let currentRoute = audioSession.currentRoute
            let outputDescription = currentRoute.outputs.map { $0.portName }.joined(separator: ", ")
            status = "Audio route set to: \(outputDescription)"
            
            print("🔊 Audio route override: \(outputDescription)")
        } catch {
            print("⚠️ Could not override audio route: \(error.localizedDescription)")
            // This is not critical, continue anyway
        }
    }
    
    private func setupAudioEngine() {
        audioEngine = AVAudioEngine()
        playerNode = AVAudioPlayerNode()
        
        guard let audioEngine = audioEngine, let playerNode = playerNode else {
            status = "Failed to create audio engine"
            return
        }
        
        // Create a specific audio format for better consistency
        let audioFormat = AVAudioFormat(standardFormatWithSampleRate: 44100, channels: 2)!
        
        audioEngine.attach(playerNode)
        audioEngine.connect(playerNode, to: audioEngine.mainMixerNode, format: audioFormat)
        
        // Set up audio engine to handle interruptions
        audioEngine.prepare()
        
        do {
            try audioEngine.start()
            playerNode.play()
            status = "Audio engine started for background playback"
            print("🎵 Audio engine started and ready for background")
        } catch {
            status = "Audio engine error: \(error.localizedDescription)"
            print("❌ Audio engine failed to start: \(error)")
        }
    }
    
    private func sendHelloMessage() {
        let helloMessage = "Hello from iPhone"
        let data = helloMessage.data(using: .utf8)!
        
        udpConnection?.send(content: data, completion: .contentProcessed { [weak self] error in
            if let error = error {
                DispatchQueue.main.async {
                    self?.status = "Send error: \(error.localizedDescription)"
                }
            } else {
                DispatchQueue.main.async {
                    self?.status = "Sent hello message to Mac"
                }
            }
        })
    }
    
    private func receiveAudioData() {
        udpConnection?.receiveMessage { [weak self] content, context, isComplete, error in
            if let data = content {
                self?.processAudioData(data)
            }
            if error == nil {
                self?.receiveAudioData() // Continue receiving
            }
        }
    }
    
    private var lastStatusUpdate = Date()
    private var audioBufferCount = 0
    
    private func processAudioData(_ data: Data) {
        // Only update status every 0.5 seconds to avoid rapid switching
        let now = Date()
        if now.timeIntervalSince(lastStatusUpdate) > 0.5 {
            DispatchQueue.main.async {
                self.status = "Receiving audio: \(data.count) bytes"
            }
            lastStatusUpdate = now
        }
        
        // Convert raw PCM data to AVAudioPCMBuffer and play it
        guard let playerNode = playerNode else { 
            print("No player node available")
            return 
        }
        
        // Create audio format for 16-bit PCM, 44.1kHz, stereo
        guard let audioFormat = AVAudioFormat(standardFormatWithSampleRate: 44100, channels: 2) else {
            print("Failed to create audio format")
            return
        }
        
        // Calculate number of samples (16-bit = 2 bytes per sample, stereo = 2 channels)
        let bytesPerSample = 2
        let channels = 2
        let frameCount = UInt32(data.count / (bytesPerSample * channels))
        
        guard frameCount > 0 else { 
            print("Invalid frame count: \(data.count) bytes")
            return 
        }
        
        // Create audio buffer
        guard let audioBuffer = AVAudioPCMBuffer(pcmFormat: audioFormat, frameCapacity: frameCount) else { 
            print("Failed to create audio buffer")
            return 
        }
        audioBuffer.frameLength = frameCount
        
        // Copy raw PCM data to audio buffer
        data.withUnsafeBytes { rawBytes in
            let int16Pointer = rawBytes.bindMemory(to: Int16.self)
            
            // Use floatChannelData instead of int16ChannelData for better compatibility
            guard let channelData = audioBuffer.floatChannelData else {
                print("Failed to get float channel data")
                return
            }
            
            for frame in 0..<Int(frameCount) {
                for channel in 0..<channels {
                    let sampleIndex = frame * channels + channel
                    if sampleIndex < int16Pointer.count {
                        // Convert Int16 to Float for AVAudioPCMBuffer (-1.0 to 1.0 range)
                        channelData[channel][frame] = Float(int16Pointer[sampleIndex]) / 32768.0
                    }
                }
            }
        }
        
        // Schedule the buffer for playback
        playerNode.scheduleBuffer(audioBuffer, at: nil, options: [], completionHandler: { [weak self] in
            self?.audioBufferCount += 1
            // Only update status occasionally
            if self?.audioBufferCount ?? 0 % 10 == 0 {
                DispatchQueue.main.async {
                    self?.status = "Playing audio (buffers: \(self?.audioBufferCount ?? 0))"
                }
            }
        })
        
        print("🎵 Scheduled audio buffer \(audioBufferCount) with \(frameCount) frames")
        print("🎵 Player node isPlaying: \(playerNode.isPlaying)")
        print("🎵 Audio engine isRunning: \(audioEngine?.isRunning ?? false)")
    }
    
    // MARK: - Background Task Management
    
    private func setupBackgroundTask() {
        backgroundTaskID = UIApplication.shared.beginBackgroundTask(withName: "AudioStreaming") { [weak self] in
            // Background task is about to expire
            print("⚠️ Background task expiring, ending task")
            self?.endBackgroundTask()
        }
        
        if backgroundTaskID != .invalid {
            print("✅ Background task started: \(backgroundTaskID.rawValue)")
        } else {
            print("❌ Failed to start background task")
        }
    }
    
    private func endBackgroundTask() {
        if backgroundTaskID != .invalid {
            print("🛑 Ending background task: \(backgroundTaskID.rawValue)")
            UIApplication.shared.endBackgroundTask(backgroundTaskID)
            backgroundTaskID = .invalid
        }
    }
    
    // MARK: - Audio Session Notifications
    
    private func setupAudioSessionNotifications() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAudioSessionInterruption),
            name: AVAudioSession.interruptionNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAudioSessionRouteChange),
            name: AVAudioSession.routeChangeNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAppDidEnterBackground),
            name: UIApplication.didEnterBackgroundNotification,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAppWillEnterForeground),
            name: UIApplication.willEnterForegroundNotification,
            object: nil
        )
    }
    
    @objc private func handleAudioSessionInterruption(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
            return
        }
        
        switch type {
        case .began:
            print("🔇 Audio session interrupted")
            DispatchQueue.main.async {
                self.status = "Audio interrupted"
            }
        case .ended:
            print("🔊 Audio session interruption ended")
            // Reactivate audio session
            do {
                try AVAudioSession.sharedInstance().setActive(true)
                DispatchQueue.main.async {
                    self.status = "Audio resumed"
                }
            } catch {
                print("❌ Failed to reactivate audio session: \(error)")
            }
        @unknown default:
            break
        }
    }
    
    @objc private func handleAudioSessionRouteChange(notification: Notification) {
        guard let userInfo = notification.userInfo,
              let reasonValue = userInfo[AVAudioSessionRouteChangeReasonKey] as? UInt,
              let reason = AVAudioSession.RouteChangeReason(rawValue: reasonValue) else {
            return
        }
        
        switch reason {
        case .oldDeviceUnavailable:
            print("🔌 Audio device disconnected")
        case .newDeviceAvailable:
            print("🔌 New audio device connected")
        default:
            break
        }
        
        // Update status with current route
        let currentRoute = AVAudioSession.sharedInstance().currentRoute
        let outputDescription = currentRoute.outputs.map { $0.portName }.joined(separator: ", ")
        DispatchQueue.main.async {
            self.status = "Audio route: \(outputDescription)"
        }
    }
    
    @objc private func handleAppDidEnterBackground() {
        print("📱 App entered background - maintaining audio session")
        // Keep the audio session active
        do {
            try AVAudioSession.sharedInstance().setActive(true)
            print("✅ Audio session kept active in background")
        } catch {
            print("❌ Failed to keep audio session active: \(error)")
        }
    }
    
    @objc private func handleAppWillEnterForeground() {
        print("📱 App entering foreground")
        DispatchQueue.main.async {
            self.status = "App in foreground - audio active"
        }
    }
}