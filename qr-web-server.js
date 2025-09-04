const express = require('express');
const qrcode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Get Mac's IP address (this will be your home IP)
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let macIP = '87.70.229.34';

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

// UDP port for audio streaming
const UDP_PORT = 3001;

// Web server to display QR code
app.get('/', async (req, res) => {
    const connectionInfo = `${macIP}:${UDP_PORT}`;
    const qrCodeDataURL = await qrcode.toDataURL(connectionInfo);
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Audio Streamer QR Code</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center; 
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    margin: 0;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    max-width: 500px;
                    margin: 50px auto;
                }
                h1 { 
                    color: #333; 
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    margin-bottom: 30px;
                }
                .qr-code { 
                    margin: 20px 0; 
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .info { 
                    background: #e8f4f8; 
                    padding: 20px; 
                    border-radius: 10px; 
                    margin: 20px 0;
                    border-left: 4px solid #007bff;
                }
                .status { 
                    color: #666; 
                    font-size: 14px; 
                    margin-top: 20px;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
                .instructions {
                    text-align: left;
                    background: #fff3cd;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    border-left: 4px solid #ffc107;
                }
                .instructions h3 {
                    margin-top: 0;
                    color: #856404;
                }
                .instructions ol {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .instructions li {
                    margin: 5px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎵 Audio Streamer</h1>
                <p class="subtitle">Connect your iPhone to stream Mac audio</p>
                
                <div class="qr-code">
                    <img src="${qrCodeDataURL}" alt="QR Code" style="max-width: 300px; border-radius: 10px;">
                </div>
                
                <div class="info">
                    <strong>Connection Details:</strong><br>
                    IP Address: <code>${macIP}</code><br>
                    Port: <code>${UDP_PORT}</code>
                </div>
                
                <div class="instructions">
                    <h3>📱 How to Connect:</h3>
                    <ol>
                        <li>Open your AudioReceiver app on iPhone</li>
                        <li>Tap "Scan QR Code"</li>
                        <li>Point camera at this QR code</li>
                        <li>Tap "Start Receiving" to begin streaming</li>
                    </ol>
                </div>
                
                <div class="status">
                    <strong>Status:</strong> Ready to connect<br>
                    <strong>Note:</strong> Make sure your Mac's UDP server is running on port ${UDP_PORT}
                </div>
            </div>
        </body>
        </html>
    `);
});

// API endpoint to get connection info as JSON
app.get('/api/connection', (req, res) => {
    res.json({
        ip: macIP,
        port: UDP_PORT,
        connectionString: `${macIP}:${UDP_PORT}`
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🌐 QR code web server running on port ${PORT}`);
    console.log(`📱 Access at: http://localhost:${PORT}`);
    console.log(`🔗 Connection info: ${macIP}:${UDP_PORT}`);
});
