# Mac Audio Streamer 🎵

Stream audio from your Mac to your iPhone with minimal latency, optimized for MFi hearing aid compatibility!

## Features

- 🎧 **Real-time audio streaming** from Mac to iPhone with sub-100ms latency
- 📱 **Native iOS app** with QR code connection for easy setup
- 🔊 **MFi hearing aid support** - stream directly to your hearing aids
- 🎯 **QR code scanning** - no manual IP entry required
- 🌐 **UDP streaming** - optimized for low latency audio
- 🔒 **Local network only** - secure and private
- 🚀 **Perfect for video calls** - audio syncs with video content

## Project Structure

This repository contains both parts of the audio streaming solution:

1. **Mac Server** (root directory) - Node.js servers for audio capture and QR code generation
2. **iOS App** (`/ios-app/`) - Native iOS app for receiving and playing audio

## Prerequisites

### Mac Requirements
1. **Node.js** installed on your Mac (version 14 or higher)
2. **FFmpeg** installed on your Mac
3. Both your Mac and iPhone on the **same WiFi network**

### iOS Requirements
1. **Xcode** (for building the app)
2. **iOS 14.0+** device
3. **Developer mode** enabled (for testing) or App Store distribution

### Installing Prerequisites

#### Install Node.js
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

#### Install FFmpeg
```bash
# Using Homebrew (recommended)
brew install ffmpeg

# Verify installation
ffmpeg -version
```

## Quick Start

### 1. Setup Mac Server
1. **Clone or download** this project to your Mac
2. **Open Terminal** and navigate to the project folder
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the servers**:
   ```bash
   node udp-server.js
   node qr-server.js
   ```
5. **Note the IP address** shown in the terminal output

### 2. Setup iOS App
1. **Open** `ios-app/AudioReceiver.xcodeproj` in Xcode
2. **Build and run** the app on your iPhone
3. **Scan the QR code** displayed on your Mac
4. **Tap "Start Receiving"** to begin audio streaming

## Usage

### Starting the Stream

1. **Start both servers** on your Mac (`udp-server.js` and `qr-server.js`)
2. **Open the iOS app** on your iPhone
3. **Scan the QR code** displayed on your Mac
4. **Tap "Start Receiving"** to begin audio streaming
5. **Audio will play** through your iPhone speakers and connected MFi hearing aids

### Important Notes

- **System audio is captured** directly from your Mac using FFmpeg
- **UDP streaming** provides minimal latency for real-time audio
- **Perfect for hearing aids** - stream Zoom calls, music, videos to your iPhone
- **No manual IP entry** - QR code scanning handles connection automatically

## Troubleshooting

#### "FFmpeg not found" error
- Make sure FFmpeg is installed: `brew install ffmpeg`
- Verify with: `ffmpeg -version`

#### Can't connect from iPhone
- Ensure both devices are on the same WiFi network
- Check your Mac's firewall settings
- Try using the IP address shown in the terminal instead of localhost

#### Audio not playing
- Check that BlackHole 2ch is selected as your Mac's audio output
- Verify that audio is actually playing on your Mac
- Try refreshing the page on your iPhone

#### Poor audio quality
- The default settings use CD-quality audio (44.1kHz, 16-bit)
- You can modify the FFmpeg parameters in `server.js` for different quality settings

## How It Works

1. **Audio Output**: Mac audio goes to BlackHole 2ch virtual device
2. **Audio Capture**: FFmpeg captures from BlackHole using `avfoundation` input
3. **Streaming**: Audio is converted to WAV format and streamed over HTTP
4. **Web Interface**: A responsive web app provides controls and displays the audio stream
5. **Real-time**: WebSocket connections provide real-time status updates

## Customization

### Change Audio Quality
Edit the FFmpeg parameters in `server.js`:

```javascript
const ffmpeg = spawn('ffmpeg', [
  '-f', 'avfoundation',
  '-i', ':0',              // BlackHole device index 0
  '-acodec', 'pcm_s16le',  // Change codec
  '-ar', '44100',           // Change sample rate
  '-ac', '2',               // Change channels (1 for mono, 2 for stereo)
  '-f', 'wav',
  'pipe:1'
]);
```

### Change Port
Set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

## Security Notes

- This application only works on your local network
- No audio data is stored or transmitted outside your network
- The web interface is accessible to anyone on your WiFi network

## iOS App Features 🚀

The native iOS app provides:
- **QR code scanning** for easy connection setup
- **Real-time audio processing** with AVAudioEngine
- **MFi hearing aid compatibility** for accessibility
- **Minimal latency** UDP audio streaming
- **Clean, simple interface** with connection status
- **Automatic audio route management** for speakers and Bluetooth

## Support

If you encounter issues:

1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure both devices are on the same network
4. Check that BlackHole 2ch is selected as your Mac's audio output

## License

MIT License - feel free to modify and distribute!

---

**Enjoy streaming your Mac's audio to your iPhone! 🎵📱**

*Perfect for hearing aid users who want to hear Mac audio through their iPhone!*
