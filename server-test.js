const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Test audio endpoint (returns a simple test tone)
app.get('/audio', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'audio/wav',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Send a simple test message since we don't have FFmpeg
  res.write('Test audio endpoint - FFmpeg not available');
  res.end();
});

// WebSocket connection for real-time audio
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎵 Audio streaming server running on port ${PORT}`);
  console.log(`📱 Access from your iPhone at: http://[YOUR_MAC_IP]:${PORT}`);
  console.log(`💻 Local access: http://localhost:${PORT}`);
  console.log(`⚠️  Note: This is a test server - FFmpeg not available for audio capture`);
});

// Get local IP address
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
const results = {};

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      results[name].push(net.address);
    }
  }
}

console.log('\n🌐 Available network interfaces:');
Object.keys(results).forEach(name => {
  results[name].forEach(ip => {
    console.log(`   ${name}: http://${ip}:${PORT}`);
  });
});
console.log('\n📱 Make sure your iPhone is on the same WiFi network!');
console.log('\n🔧 To enable real audio streaming, install FFmpeg:');
console.log('   Option 1: Install Homebrew first: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"');
console.log('   Option 2: Then install FFmpeg: brew install ffmpeg');
console.log('   Option 3: Or download FFmpeg directly from https://ffmpeg.org/download.html');
