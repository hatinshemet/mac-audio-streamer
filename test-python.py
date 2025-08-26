#!/usr/bin/env python3
import http.server
import socketserver
import socket

PORT = 8888
HOST = '0.0.0.0'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html = f"""
            <html>
                <head><title>Python Test Server</title></head>
                <body>
                    <h1>🐍 Python Test Server!</h1>
                    <p>If you can see this from your iPhone, Python server works!</p>
                    <p>Time: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                    <p>Request: {self.path}</p>
                    <p>Server: Python HTTP Server</p>
                </body>
            </html>
            """
            self.wfile.write(html.encode())
        else:
            super().do_GET()

try:
    with socketserver.TCPServer((HOST, PORT), MyHTTPRequestHandler) as httpd:
        print(f"🐍 Python test server running on port {PORT}")
        print(f"📱 Try from iPhone: http://192.168.0.101:{PORT}")
        print(f"💻 Local test: http://localhost:{PORT}")
        print(f"🌐 Network test: http://192.168.0.101:{PORT}")
        httpd.serve_forever()
except OSError as e:
    print(f"❌ Error starting server: {e}")
except KeyboardInterrupt:
    print("\n🛑 Server stopped by user")
