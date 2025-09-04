# 🎵 Mac Audio Streamer for MFi Hearing Aids

**Stream Mac audio to MFi hearing aids via iPhone with minimal latency**

Since M1 Macs don't support direct MFi hearing aid connections, this project bridges the gap by streaming Mac system audio to an iPhone app, which then routes it to MFi hearing aids.

## ✨ Features

- **Real-time audio streaming** with sub-100ms latency
- **QR code connection** - no manual IP entry needed
- **Background audio support** - continues playing when app is backgrounded
- **Screen dimming prevention** - maintains audio quality during streaming
- **Beautiful iOS app** with custom logo
- **Works on local WiFi** networks
- **Easy setup** with automated configuration
- **Perfect for video calls** and media consumption

## 🚀 Quick Start

> **💡 No Localhost Conflicts**: This setup avoids using port 3000 (localhost) so you can use it for other projects. We use GitHub Pages for QR codes instead.

### 1. Clone the Repository
```bash
git clone https://github.com/hatinshemet/mac-audio-streamer.git
cd mac-audio-streamer
```

### 2. Run Setup Script
```bash
./setup.sh
```

The setup script will:
- ✅ Check for Node.js and FFmpeg
- ✅ Install dependencies
- ✅ Detect your local IP address
- ✅ Update QR code with your IP
- ✅ Create start script and instructions

### 3. Start Audio Streaming (No Localhost Conflicts)
```bash
./start-audio-only.sh
```

### 4. Get Connection Info
```bash
./show-ip.sh
```

### 5. Connect Your iPhone
- Open the AudioReceiver app
- Tap "Scan QR Code"
- Point camera at the QR code
- Tap "Start Receiving"

## 📱 iOS App Setup

### Requirements
- iPhone with iOS 14+
- Xcode 12+
- MFi hearing aids

### Building the App
1. Open `ios-app/AudioReceiver.xcodeproj` in Xcode
2. Connect your iPhone
3. Select your device in Xcode
4. Build and run the app

### App Features
- QR code scanning for easy connection
- Real-time audio streaming
- Background audio support - continues when app is backgrounded
- Screen dimming prevention for consistent audio quality
- Custom app logo
- Connection status display

## 🛠️ Technical Details

### Architecture
- **Mac Server**: Node.js + FFmpeg captures system audio
- **UDP Streaming**: Low-latency audio transmission
- **iOS App**: SwiftUI + AVFoundation receives and plays audio
- **QR Code**: Easy connection discovery

### Network Requirements
- Both devices on same WiFi network
- Port 3001 (UDP) for audio streaming
- Port 3000 (HTTP) for QR code display

### Audio Format
- **Format**: PCM 16-bit
- **Sample Rate**: 44.1kHz
- **Channels**: Stereo
- **Latency**: <100ms
- **Buffer Duration**: 23ms (optimized for quality)
- **Background Audio**: Supported with UIBackgroundModes

## 📋 Manual Setup (Alternative)

If the setup script doesn't work:

### 1. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install FFmpeg (macOS)
brew install ffmpeg
```

### 2. Find Your IP
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 3. Update QR Code
Edit `index.html` and replace `192.168.0.101` with your IP:
```html
<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YOUR_IP:3001&v=2">
```

### 4. Start Servers
```bash
# Terminal 1: Start UDP server
node udp-server.js

# Terminal 2: Start QR server
node qr-server.js
```

## 🔧 Troubleshooting

### Connection Issues
- **Check WiFi**: Both devices must be on same network
- **Firewall**: Ensure port 3001 is not blocked
- **IP Address**: Verify IP address is correct in QR code

### Audio Issues
- **FFmpeg**: Make sure FFmpeg is installed and accessible
- **Permissions**: Grant microphone permissions to the app
- **Audio Session**: Check iOS audio session configuration

### QR Code Issues
- **Browser Cache**: Clear browser cache or use incognito mode
- **Network**: Ensure QR server is running on port 3000

## 📁 Project Structure

```
mac-audio-streamer/
├── setup.sh                 # Automated setup script
├── start-server.sh          # Server start script (generated)
├── udp-server.js           # Main UDP audio server
├── qr-server.js            # QR code web server
├── index.html              # QR code webpage
├── ios-app/                # iOS application
│   ├── AudioReceiver/      # Swift source files
│   └── AudioReceiver.xcodeproj
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source. Feel free to use, modify, and distribute.

## 🙏 Acknowledgments

- Built for the MFi hearing aid community
- Inspired by the need for Mac audio accessibility
- Thanks to all contributors and testers

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review the setup instructions
3. Open an issue on GitHub

---

**Happy streaming! 🎵📱**