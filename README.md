# Mac Audio Streamer 🎵

Stream audio from your Mac to your iPhone (or any other device) over your local WiFi network!

## Features

- 🎧 **Real-time audio streaming** from Mac to iPhone
- 📱 **Mobile-friendly web interface** that works on any device
- 🔊 **Volume control** and playback controls
- 🌐 **Cross-platform** - works on any device with a web browser
- 🔒 **Local network only** - secure and private

## Prerequisites

Before you start, make sure you have:

1. **Node.js** installed on your Mac (version 14 or higher)
2. **FFmpeg** installed on your Mac
3. Both your Mac and iPhone on the **same WiFi network**

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

1. **Clone or download** this project to your Mac
2. **Open Terminal** and navigate to the project folder
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the server**:
   ```bash
   npm start
   ```
5. **Note the IP address** shown in the terminal output
6. **On your iPhone**, open Safari and go to `http://[YOUR_MAC_IP]:3000`

## Usage

### Starting the Stream

1. Run the server on your Mac
2. Open the web interface on your iPhone
3. Click the **Play** button to start streaming
4. Adjust volume using the slider
5. Use **Pause** or **Stop** to control playback

### Troubleshooting

#### "FFmpeg not found" error
- Make sure FFmpeg is installed: `brew install ffmpeg`
- Verify with: `ffmpeg -version`

#### Can't connect from iPhone
- Ensure both devices are on the same WiFi network
- Check your Mac's firewall settings
- Try using the IP address shown in the terminal instead of localhost

#### Audio not playing
- Check that your Mac has audio playing
- Verify microphone permissions in System Preferences
- Try refreshing the page on your iPhone

#### Poor audio quality
- The default settings use CD-quality audio (44.1kHz, 16-bit)
- You can modify the FFmpeg parameters in `server.js` for different quality settings

## How It Works

1. **Audio Capture**: FFmpeg captures system audio from your Mac using the `avfoundation` input format
2. **Streaming**: The audio is converted to WAV format and streamed over HTTP
3. **Web Interface**: A responsive web app provides controls and displays the audio stream
4. **Real-time**: WebSocket connections provide real-time status updates

## Customization

### Change Audio Quality
Edit the FFmpeg parameters in `server.js`:

```javascript
const ffmpeg = spawn('ffmpeg', [
  '-f', 'avfoundation',
  '-i', ':0',
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

### Change Audio Input
If `:0` doesn't work, list available audio devices:
```bash
ffmpeg -f avfoundation -list_devices true -i ""
```

Then update the `-i` parameter in `server.js` with the correct device index.

## Security Notes

- This application only works on your local network
- No audio data is stored or transmitted outside your network
- The web interface is accessible to anyone on your WiFi network

## Advanced Features

### Multiple Audio Sources
You can modify the server to capture from different audio sources:
- System audio (default)
- Microphone input
- Specific applications
- Audio files

### Quality Settings
Adjust for different network conditions:
- **Low latency**: Lower sample rates, mono audio
- **High quality**: Higher sample rates, stereo audio
- **Bandwidth optimization**: Compressed formats like MP3 or AAC

## Support

If you encounter issues:

1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure both devices are on the same network
4. Check your Mac's audio output settings

## License

MIT License - feel free to modify and distribute!

---

**Enjoy streaming your Mac's audio to your iPhone! 🎵📱**
