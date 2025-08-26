const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`📱 Request received: ${req.method} ${req.url}`);
  
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  
  const html = `
    <html>
      <head>
        <title>Working Test Server</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
          h1 { color: #4CAF50; }
          .status { background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎉 Working Test Server!</h1>
          <div class="status">
            <p><strong>Status:</strong> Server is running and responding!</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Request:</strong> ${req.url}</p>
            <p><strong>Method:</strong> ${req.method}</p>
          </div>
          <p>If you can see this page, the server is working correctly!</p>
          <p>Now try accessing it from your iPhone using the IP address shown in the terminal.</p>
        </div>
      </body>
    </html>
  `;
  
  res.end(html);
});

const PORT = 7777;

server.listen(PORT, '0.0.0.0', () => {
  console.log('🎉 Working test server started successfully!');
  console.log(`📱 Try from iPhone: http://192.168.0.101:${PORT}`);
  console.log(`💻 Local test: http://localhost:${PORT}`);
  console.log(`🌐 Network test: http://192.168.0.101:${PORT}`);
  console.log('\n✅ Server is running and waiting for connections...');
});

// Handle errors gracefully
server.on('error', (err) => {
  console.log('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('💡 Port is already in use. Trying a different port...');
    server.listen(PORT + 1, '0.0.0.0');
  }
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
