# Mac Audio Streamer 🎵

Stream audio from your Mac to your iPhone (or any other device) over your local WiFi network!

## Features

- 🎧 **Real-time audio streaming** from Mac to iPhone
- 📱 **Mobile-friendly web interface** that works on any device
- 🔊 **Volume control** and playback controls
- 🌐 **Cross-platform** - works on any device with a web browser
- 🔒 **Local network only** - secure and private
- 🚀 **Native iOS app coming soon** - for even better performance!

## Prerequisites

Before you start, make sure you have:

1. **Node.js** installed on your Mac (version 14 or higher)
2. **FFmpeg** installed on your Mac
3. **BlackHole 2ch** virtual audio driver (for system audio capture)
4. Both your Mac and iPhone on the **same WiFi network**

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

#### Install BlackHole (Required for Mac M1)
```bash
# Using Homebrew
brew install blackhole-2ch

# Or download from https://existential.audio/blackhole/
```

## Quick Start

1. **Clone or download** this project to your Mac
2. **Open Terminal** and navigate to the project folder
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set BlackHole as audio output**:
   - Go to System Preferences > Sound > Output
   - Select "BlackHole 2ch" as your output device
5. **Start the server**:
   ```bash
   npm start
   ```
6. **Note the IP address** shown in the terminal output
7. **On your iPhone**, open Safari and go to `http://[YOUR_MAC_IP]:3000`

## Usage

### Starting the Stream

1. Run the server on your Mac
2. Open the web interface on your iPhone
3. Click the **Play** button to start streaming
4. Adjust volume using the slider
5. Use **Pause** or **Stop** to control playback

### Important Notes

- **Your Mac speakers will be silent** when BlackHole is selected as output
- **Audio goes to BlackHole** → **FFmpeg captures it** → **iPhone receives it**
- **Perfect for hearing aids** - stream Zoom calls, music, etc. to your iPhone

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

## Coming Soon: Native iOS App 🚀

We're currently developing a native iOS app that will:
- **Eliminate browser limitations** for better performance
- **Provide lower latency** audio streaming
- **Include MFI hearing aid support** for accessibility
- **Offer a simple, clean interface** (play/pause + connection status)
- **Integrate seamlessly** with your existing Mac setup

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
