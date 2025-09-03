import SwiftUI
import AVFoundation

struct ContentView: View {
    @StateObject private var audioReceiver = AudioReceiver()
    @State private var showManualEntry = false
    @State private var showQRScanner = false
    @State private var manualIP = ""
    @State private var manualPort = "3001"
    
    var body: some View {
        VStack(spacing: 30) {
            Text("Audio Receiver")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            VStack(spacing: 20) {
                Button(action: {
                    if audioReceiver.isReceiving {
                        audioReceiver.stopReceiving()
                    } else {
                        audioReceiver.startReceiving()
                    }
                }) {
                    Text(audioReceiver.isReceiving ? "Stop Receiving" : "Start Receiving")
                        .font(.title2)
                        .foregroundColor(.white)
                        .padding()
                        .background(audioReceiver.isReceiving ? Color.red : Color.blue)
                        .cornerRadius(10)
                }
                
                Button(action: {
                    showQRScanner = true
                }) {
                    Text("Scan QR Code")
                        .font(.title2)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.purple)
                        .cornerRadius(10)
                }
                
                Button(action: {
                    showManualEntry = true
                }) {
                    Text("Enter Mac IP Address")
                        .font(.title2)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(10)
                }
            }
            
            Text(audioReceiver.status)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding()
        }
        .padding()
        .sheet(isPresented: $showQRScanner) {
            QRScannerView { qrCode in
                showQRScanner = false
                parseQRCode(qrCode)
            }
        }
        .alert("Enter Mac Connection Info", isPresented: $showManualEntry) {
            TextField("IP Address", text: $manualIP)
            TextField("Port", text: $manualPort)
            Button("Connect") {
                if let port = UInt16(manualPort) {
                    audioReceiver.connectToServer(ip: manualIP, port: port)
                }
            }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("Enter your Mac's IP address and port (default: 3001)")
        }
    }
    
    private func parseQRCode(_ qrCode: String) {
        // Parse QR code format: "audio://192.168.1.100:3001"
        if qrCode.hasPrefix("audio://") {
            let connectionString = String(qrCode.dropFirst(8)) // Remove "audio://"
            let components = connectionString.components(separatedBy: ":")
            if components.count == 2,
               let port = UInt16(components[1]) {
                audioReceiver.connectToServer(ip: components[0], port: port)
            }
        } else {
            // Try to parse as IP:PORT format
            let components = qrCode.components(separatedBy: ":")
            if components.count == 2,
               let port = UInt16(components[1]) {
                audioReceiver.connectToServer(ip: components[0], port: port)
            }
        }
    }
}

#Preview {
    ContentView()
}
