const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>Specific IP Test</title></head>
      <body>
        <h1>🎉 Specific IP Binding Test!</h1>
        <p>If you can see this from your iPhone, the specific IP binding works!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p>Request: ${req.url}</p>
        <p>Server IP: 192.168.0.101</p>
      </body>
    </html>
  `);
});

const PORT = 9999;
const IP = '192.168.0.101';

server.listen(PORT, IP, () => {
  console.log(`🧪 Specific IP test server running on ${IP}:${PORT}`);
  console.log(`📱 Try from iPhone: http://${IP}:${PORT}`);
  console.log(`💻 Local test: http://localhost:${PORT}`);
  console.log(`🌐 Network test: http://${IP}:${PORT}`);
});

// Test if we can bind to the specific IP
server.on('error', (err) => {
  if (err.code === 'EADDRNOTAVAIL') {
    console.log('❌ Cannot bind to specific IP - trying 0.0.0.0 instead');
    server.listen(PORT, '0.0.0.0');
  } else {
    console.log('❌ Server error:', err.message);
  }
});
