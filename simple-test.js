const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Simple Test</title></head>
      <body>
        <h1>🎉 It Works!</h1>
        <p>If you can see this from your iPhone, the connection is working!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>Request: ${req.url}</p>
      </body>
    </html>
  `);
});

const PORT = 9090;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🧪 Simple test server running on port ${PORT}`);
  console.log(`📱 Try from iPhone: http://192.168.0.101:${PORT}`);
  console.log(`💻 Local test: http://localhost:${PORT}`);
});

// Get local IP
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`🌐 Network interface ${name}: http://${net.address}:${PORT}`);
    }
  }
}
