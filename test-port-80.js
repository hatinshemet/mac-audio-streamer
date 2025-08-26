const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Port 80 Test</title></head>
      <body>
        <h1>🎉 Port 80 Test!</h1>
        <p>If you can see this from your iPhone, port 80 works!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>Request: ${req.url}</p>
      </body>
    </html>
  `);
});

const PORT = 80;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🧪 Port 80 test server running`);
  console.log(`📱 Try from iPhone: http://192.168.0.101`);
  console.log(`💻 Local test: http://localhost`);
});

// Get local IP
const { networkInterfaces } = require('os');
const nets = networkInterfaces();
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`🌐 Network interface ${name}: http://${net.address}`);
    }
  }
}
