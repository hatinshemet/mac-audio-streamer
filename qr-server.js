const express = require('express');
const qrcode = require('qrcode');
const { spawn } = require('child_process');
const dgram = require('dgram');

const app = express();
const PORT = 3001;
const WEB_PORT = 3000;

// Get Mac's IP address
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let macIP = '127.0.0.1';

for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            macIP = iface.address;
            break;
        }
    }
    if (macIP !== '127.0.0.1') break;
}

// Create UDP server for audio streaming
const udpServer = dgram.createSocket('udp4');

// Store connected clients
let connectedClients = new Set();

udpServer.on('message', (msg, rinfo) => {
    console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);
    // Store client info
    connectedClients.add(`${rinfo.address}:${rinfo.port}`);
    console.log(`Connected clients: ${connectedClients.size}`);
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
    startAudioStream();
});

function startAudioStream() {
    console.log('Starting audio stream...');
    
    // Use ffmpeg to capture audio and send via UDP
    const ffmpeg = spawn('ffmpeg', [
        '-f', 'avfoundation',
        '-i', ':0', // Capture system audio
        '-acodec', 'pcm_s16le',
        '-ar', '44100',
        '-ac', '2',
        '-f', 's16le',
        'pipe:1'
    ]);

    ffmpeg.stdout.on('data', (data) => {
        // Send audio data to all connected clients
        connectedClients.forEach(client => {
            const [ip, port] = client.split(':');
            udpServer.send(data, parseInt(port), ip, (err) => {
                if (err) console.log('UDP send error:', err);
            });
        });
    });

    ffmpeg.stderr.on('data', (data) => {
        console.log('FFmpeg:', data.toString());
    });
}

// Web server to display QR code
app.get('/', async (req, res) => {
    const connectionInfo = `${macIP}:${PORT}`;
    const qrCodeDataURL = await qrcode.toDataURL(connectionInfo);
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Audio Streamer QR Code</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 20px;
                    background: #f0f0f0;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    max-width: 500px;
                    margin: 0 auto;
                }
                h1 { color: #333; }
                .qr-code { margin: 20px 0; }
                .info { 
                    background: #e8f4f8; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin: 20px 0;
                }
                .status { 
                    color: #666; 
                    font-size: 14px; 
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎵 Audio Streamer</h1>
                <p>Scan this QR code with your iPhone app to connect:</p>
                <div class="qr-code">
                    <img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 300px;">
                </div>
                <div class="info">
                    <strong>Connection Info:</strong><br>
                    IP: ${macIP}<br>
                    Port: ${PORT}
                </div>
                <div class="status">
                    Connected clients: ${connectedClients.size}
                </div>
            </div>
        </body>
        </html>
    `);
});

// Start servers
udpServer.bind(PORT, () => {
    console.log(`🎵 UDP audio streaming server starting on port ${PORT}`);
    console.log(`📱 iPhone will connect via QR code`);
});

app.listen(WEB_PORT, () => {
    console.log(`🌐 QR code server running at http://${macIP}:${WEB_PORT}`);
    console.log(`📱 Open this URL in your browser to see the QR code`);
});
