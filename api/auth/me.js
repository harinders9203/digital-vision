const { getAdminSession } = require("../_lib/auth");
const { sendJson, sendMethodNotAllowed } = require("../_lib/http");

module.exports = function handler(req, res) {
    if (req.method !== "GET") {
        sendMethodNotAllowed(res, ["GET"]);
        return;
    }

    try {
        const session = getAdminSession(req);

        if (!session) {
            sendJson(res, 401, {
                authenticated: false,
                error: "Not authenticated."
            });
            return;
        }

        sendJson(res, 200, {
            authenticated: true,
            user: session.sub
        });
    } catch (error) {
        console.error("Admin session check error:", error);
        sendJson(res, 500, {
            authenticated: false,
            error: "Unable to verify the current session."
        });
    }
};
