# AudioReceiver iOS App

An iOS app that receives audio streams from a Mac and plays them through the iPhone's speakers or connected MFi hearing aids with minimal latency.

## Features

- **QR Code Connection**: Easy setup by scanning a QR code from the Mac server
- **Low Latency Audio**: Optimized for real-time audio streaming with minimal delay
- **MFi Hearing Aid Support**: Compatible with Made for iPhone hearing aids
- **Multiple Output Options**: Plays through iPhone speakers or Bluetooth devices
- **Real-time Status**: Shows connection status and audio buffer information

## Requirements

- iOS 14.0 or later
- Xcode 12.0 or later
- iPhone with camera (for QR code scanning)
- Mac running the audio streaming server

## Setup Instructions

### 1. Install Dependencies

The app uses standard iOS frameworks:
- `AVFoundation` - Audio processing and playback
- `Network` - UDP network communication
- `SwiftUI` - User interface

### 2. Build and Run

1. Open `AudioReceiver.xcodeproj` in Xcode
2. Select your iPhone as the target device
3. Build and run the project (⌘+R)

### 3. Permissions

The app requires camera permission for QR code scanning. This is automatically requested when you first tap "Scan QR Code".

## Usage

1. **Start the Mac Server**: Run the Node.js audio streaming server on your Mac
2. **Scan QR Code**: Tap "Scan QR Code" in the app and point your camera at the QR code displayed on your Mac
3. **Start Receiving**: Tap "Start Receiving" to begin audio streaming
4. **Enjoy**: Audio from your Mac will now play through your iPhone and connected hearing aids

## Technical Details

### Audio Processing
- Uses `AVAudioEngine` for real-time audio processing
- Converts raw PCM audio data to `AVAudioPCMBuffer`
- Supports 44.1kHz stereo audio format
- Optimized buffer management for minimal latency

### Network Communication
- UDP-based audio streaming for low latency
- Automatic connection management
- Handles network interruptions gracefully

### Audio Session Configuration
- Category: `.playback` with speaker and Bluetooth support
- Optimized for hearing aid compatibility
- Automatic audio route management

## File Structure

```
AudioReceiver/
├── AudioReceiverApp.swift      # Main app entry point
├── ContentView.swift           # Main UI with connection controls
├── AudioReceiver.swift         # Core audio streaming logic
├── QRScannerView.swift         # QR code scanning functionality
├── Info.plist                  # App configuration and permissions
└── Assets.xcassets/           # App icons and assets
```

## Troubleshooting

### No Audio Output
- Check that "Start Receiving" is tapped
- Verify the Mac server is running
- Ensure your iPhone volume is up
- Check Bluetooth connection if using hearing aids

### QR Code Not Scanning
- Ensure camera permission is granted
- Make sure the QR code is clearly visible
- Check that the Mac server is running and displaying the QR code

### Connection Issues
- Verify both devices are on the same Wi-Fi network
- Check that the Mac's IP address hasn't changed
- Restart both the Mac server and the iOS app

## Development

### Building for Distribution
To distribute the app without developer mode:

1. **App Store Distribution**:
   - Archive the app in Xcode
   - Upload to App Store Connect
   - Submit for review

2. **TestFlight Beta**:
   - Upload to TestFlight for beta testing
   - Invite testers via email

3. **Enterprise Distribution** (requires enterprise account):
   - Build with enterprise certificate
   - Distribute internally

### Code Structure
- `AudioReceiver.swift`: Core audio streaming and network logic
- `ContentView.swift`: Main user interface
- `QRScannerView.swift`: Camera-based QR code scanning
- `AudioReceiverApp.swift`: App lifecycle management

## License

This project is part of a personal audio streaming solution for MFi hearing aid compatibility.
