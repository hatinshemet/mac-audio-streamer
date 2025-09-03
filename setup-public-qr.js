const https = require('https');
const fs = require('fs');

// Get public IP address
function getPublicIP() {
    return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data.trim()));
        }).on('error', reject);
    });
}

// Update QR server with public IP
async function updateQRServer() {
    try {
        console.log('🌐 Getting your public IP address...');
        const publicIP = await getPublicIP();
        console.log(`📍 Your public IP: ${publicIP}`);
        
        // Read the current QR server file
        let qrServerContent = fs.readFileSync('qr-web-server.js', 'utf8');
        
        // Update the IP address
        qrServerContent = qrServerContent.replace(
            /let macIP = '127\.0\.0\.1';/,
            `let macIP = '${publicIP}';`
        );
        
        // Write the updated file
        fs.writeFileSync('qr-web-server.js', qrServerContent);
        
        console.log('✅ Updated qr-web-server.js with your public IP');
        console.log(`🔗 Your QR code will now show: ${publicIP}:3001`);
        console.log('');
        console.log('📋 Next steps:');
        console.log('1. Deploy qr-web-server.js to a cloud service (Vercel, Heroku, etc.)');
        console.log('2. Make sure port 3001 is forwarded on your router');
        console.log('3. Run your UDP server: node udp-server.js');
        console.log('4. Access your QR code from the cloud URL');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the update
updateQRServer();
