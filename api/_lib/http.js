const DEFAULT_HTML_CSP = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "img-src 'self' data: https:",
    "script-src 'self'",
    "style-src 'self'",
    "connect-src 'self'",
    "object-src 'none'"
].join("; ");

function applyBaseSecurityHeaders(res) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
    applyBaseSecurityHeaders(res);
    Object.entries(extraHeaders).forEach(([header, value]) => {
        res.setHeader(header, value);
    });
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(payload));
}

function sendHtml(res, statusCode, html, extraHeaders = {}) {
    applyBaseSecurityHeaders(res);
    res.setHeader("Content-Security-Policy", DEFAULT_HTML_CSP);
    Object.entries(extraHeaders).forEach(([header, value]) => {
        res.setHeader(header, value);
    });
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
}

function redirect(res, location, statusCode = 302) {
    applyBaseSecurityHeaders(res);
    res.statusCode = statusCode;
    res.setHeader("Location", location);
    res.end();
}

function sendMethodNotAllowed(res, allowedMethods) {
    res.setHeader("Allow", allowedMethods.join(", "));
    sendJson(res, 405, {
        error: "Method not allowed."
    });
}

function getClientIp(req) {
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string" && forwardedFor.trim()) {
        return forwardedFor.split(",")[0].trim();
    }

    const realIp = req.headers["x-real-ip"];
    if (typeof realIp === "string" && realIp.trim()) {
        return realIp.trim();
    }

    return req.socket?.remoteAddress || "unknown";
}

async function readJsonBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }

    if (typeof req.body === "string" && req.body.trim()) {
        return JSON.parse(req.body);
    }

    return new Promise((resolve, reject) => {
        let rawBody = "";

        req.on("data", (chunk) => {
            rawBody += chunk;

            if (rawBody.length > 1024 * 1024) {
                reject(new Error("Request body too large."));
                req.destroy();
            }
        });

        req.on("end", () => {
            if (!rawBody.trim()) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(rawBody));
            } catch {
                reject(new Error("Invalid JSON body."));
            }
        });

        req.on("error", reject);
    });
}

module.exports = {
    getClientIp,
    redirect,
    readJsonBody,
    sendHtml,
    sendJson,
    sendMethodNotAllowed
};
