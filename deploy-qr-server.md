# Deploy QR Code Server to Cloud

This guide shows how to deploy your QR code server to various cloud platforms so it's accessible from anywhere.

## Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create deployment files:**
   ```bash
   # Create vercel.json
   echo '{
     "version": 2,
     "builds": [
       {
         "src": "qr-web-server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "qr-web-server.js"
       }
     ]
   }' > vercel.json
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Update your Mac's public IP:**
   - Go to [whatismyip.com](https://whatismyip.com) to get your public IP
   - Update the `macIP` variable in `qr-web-server.js` with your public IP

## Option 2: Heroku (Free tier available)

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Procfile:**
   ```bash
   echo "web: node qr-web-server.js" > Procfile
   ```

3. **Deploy:**
   ```bash
   heroku create your-audio-streamer-qr
   git add .
   git commit -m "Deploy QR server"
   git push heroku main
   ```

## Option 3: Railway (Free tier available)

1. **Connect GitHub repository**
2. **Deploy from GitHub**
3. **Set environment variables if needed**

## Option 4: Netlify Functions

1. **Create netlify.toml:**
   ```toml
   [build]
     functions = "netlify/functions"
   
   [[redirects]]
     from = "/*"
     to = "/.netlify/functions/qr-server"
     status = 200
   ```

2. **Create netlify/functions/qr-server.js** (similar to qr-web-server.js)

## Important Notes:

1. **Update IP Address:** You'll need to update the `macIP` variable with your home's public IP address
2. **Port Forwarding:** Make sure port 3001 is forwarded on your router for UDP traffic
3. **Dynamic IP:** If your home IP changes, you'll need to update the cloud server

## Quick Setup for Vercel:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Get your public IP
curl ifconfig.me

# 4. Update the deployed server with your public IP
```

Your QR code will then be accessible from anywhere at: `https://your-app.vercel.app`
