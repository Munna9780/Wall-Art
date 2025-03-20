// Simple reliable server for luxury wall arts website
const http = require('http');
const fs = require('fs');
const path = require('path');

// Try different ports if one is in use
let PORT = 3000;
const MAX_PORT_ATTEMPTS = 10;
let currentPortAttempt = 0;

// Basic MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Handle file not found errors - provide fallbacks for critical files
function handleMissingFile(filePath, res) {
    // Check if this is a critical file that has a fallback
    if (filePath === './3d-carousel.css') {
        // For missing 3d-carousel.css, return empty CSS
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end('/* Fallback empty CSS */');
        return true;
    } 
    else if (filePath === './3d-carousel.js' || filePath === './fallback.js') {
        // For missing JS files, return empty script
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
        res.end('/* Fallback empty JavaScript */');
        return true;
    }
    else if (filePath === './favicon.ico') {
        // For missing favicon, return 204 No Content
        res.writeHead(204);
        res.end();
        return true;
    }
    
    // No fallback available
    return false;
}

// Create server function
function createServer(port) {
    const server = http.createServer((req, res) => {
        // Handle requests
        console.log(`Request: ${req.method} ${req.url}`);
        
        // Get file path
        let filePath = '.' + req.url;
        if (filePath === './') {
            filePath = './index.html';
        }
        
        // Get file extension
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        
        // Read file
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // File not found - check for fallbacks
                    if (!handleMissingFile(filePath, res)) {
                        console.log(`File not found: ${filePath}`);
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(`<h1>404 Not Found</h1><p>The file ${filePath.substring(2)} could not be found.</p>`);
                    }
                } else {
                    // Server error
                    console.error(`Server error reading ${filePath}: ${error.code}`);
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(`<h1>Server Error</h1><p>${error.code}</p>`);
                }
            } else {
                // Success! Serve the file
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
    
    // Try to start the server
    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            currentPortAttempt++;
            if (currentPortAttempt < MAX_PORT_ATTEMPTS) {
                console.log(`Port ${port} is in use, trying port ${port + 1}...`);
                createServer(port + 1);
            } else {
                console.error(`Unable to find an available port after ${MAX_PORT_ATTEMPTS} attempts.`);
                console.error(`Try manually closing other servers or specifying a different port.`);
                process.exit(1);
            }
        } else {
            console.error(`Server error: ${e.message}`);
            process.exit(1);
        }
    });
    
    server.listen(port, () => {
        console.log('\n==================================================');
        console.log(`🚀 Server running at http://localhost:${port}/`);
        console.log(`🔒 Admin page: http://localhost:${port}/admin.html`);
        console.log('==================================================\n');
        console.log('Press Ctrl+C to stop the server');
    });
}

// Start the server
createServer(PORT); 