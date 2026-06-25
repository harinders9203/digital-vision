const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
require("dotenv").config();

// Import API handlers
const loginHandler = require("./api/auth/login");
const meHandler = require("./api/auth/me");
const logoutHandler = require("./api/auth/logout");
const adminHandler = require("./api/admin");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname);

// MIME types
const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf"
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // API Routes
    if (pathname === "/api/auth/login") {
        try {
            await loginHandler(req, res);
        } catch (error) {
            console.error("Login handler error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
        return;
    }

    if (pathname === "/api/auth/me") {
        try {
            await meHandler(req, res);
        } catch (error) {
            console.error("Me handler error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
        return;
    }

    if (pathname === "/api/auth/logout") {
        try {
            await logoutHandler(req, res);
        } catch (error) {
            console.error("Logout handler error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
        return;
    }

    if (pathname === "/api/admin") {
        try {
            await adminHandler(req, res);
        } catch (error) {
            console.error("Admin handler error:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal server error" }));
        }
        return;
    }

    // Static file serving
    if (pathname === "/") {
        pathname = "/index.html";
    }

    let filePath = path.join(PUBLIC_DIR, pathname);

    // Security: prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not Found");
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType,
            "Cache-Control": "no-cache"
        });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
    console.log(`📁 Serving files from: ${PUBLIC_DIR}`);
    console.log(`🔐 Admin login: http://127.0.0.1:${PORT}/admin.html`);
    console.log(`🛑 Press Ctrl+C to stop the server`);
});
