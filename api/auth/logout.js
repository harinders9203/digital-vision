const { clearSessionCookie } = require("../_lib/auth");
const { sendJson, sendMethodNotAllowed } = require("../_lib/http");

module.exports = function handler(req, res) {
    if (req.method !== "POST") {
        sendMethodNotAllowed(res, ["POST"]);
        return;
    }

    try {
        res.setHeader("Set-Cookie", clearSessionCookie(req));
        sendJson(res, 200, {
            ok: true
        });
    } catch (error) {
        console.error("Admin logout error:", error);
        sendJson(res, 500, {
            error: "Logout is currently unavailable."
        });
    }
};
