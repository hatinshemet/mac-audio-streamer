const dgram = require('dgram');
const { spawn } = require('child_process');
const mdns = require('mdns');

const server = dgram.createSocket('udp4');
const PORT = 3001;

// Simple UDP server without Bonjour for now
console.log('🎵 UDP audio streaming server starting on port', PORT);
console.log('📱 iPhone will connect directly via IP address');

server.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);
    // Store the client info for sending audio back
    global.lastClient = rinfo;
    console.log(`Stored client: ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
    console.log('🎵 Ready to receive connections from iPhone');
    startAudioStream();
});

function startAudioStream() {
    console.log('Starting audio stream...');
    console.log('📱 iPhone will automatically discover this Mac');
    
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
        // Broadcast audio data to all connected clients
        // For now, we'll store the last client that connected
        if (global.lastClient) {
            server.send(data, global.lastClient.port, global.lastClient.address, (err) => {
                if (err) console.log('UDP send error:', err);
            });
        }
    });

    ffmpeg.stderr.on('data', (data) => {
        console.log('FFmpeg:', data.toString());
    });
}

server.bind(PORT, () => {
    console.log(`🎵 UDP audio streaming server starting on port ${PORT}`);
    console.log(`📱 iPhone will automatically discover this Mac via Bonjour`);
});