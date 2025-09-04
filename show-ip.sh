#!/bin/bash

echo "🎵 Audio Streamer - Connection Info"
echo "=================================="

# Get Mac's IP address
os_name=$(uname -s)
if [ "$os_name" = "Darwin" ]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
else
    # Linux
    IP=$(hostname -I | awk '{print $1}')
fi

echo "📱 Your Mac's IP Address: $IP"
echo "🔌 Port: 3001"
echo ""
echo "📱 For iPhone app:"
echo "   IP: $IP"
echo "   Port: 3001"
echo ""
echo "🌐 For sharing with others:"
echo "   GitHub Pages: https://hatinshemet.github.io/mac-audio-streamer/"
echo ""
echo "🚀 To start audio streaming:"
echo "   ./start-audio-only.sh"
