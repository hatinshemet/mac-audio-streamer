#!/bin/bash

echo "🎵 Starting Audio Streamer (UDP Only)"
echo "📱 Use GitHub Pages for QR code: https://hatinshemet.github.io/mac-audio-streamer/"
echo ""

# Start only the UDP audio server
node udp-server.js
