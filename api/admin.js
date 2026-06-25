const { getAdminSession } = require("./_lib/auth");
const { renderAdminPage } = require("./_lib/admin-page");
const { redirect, sendHtml, sendMethodNotAllowed } = require("./_lib/http");

module.exports = function handler(req, res) {
    if (req.method !== "GET") {
        sendMethodNotAllowed(res, ["GET"]);
        return;
    }

    try {
        const session = getAdminSession(req);

        if (!session) {
            // Browsers are redirected to the login page instead of receiving the protected HTML.
            redirect(res, "/admin.html?reason=session-expired", 302);
            return;
        }

        sendHtml(res, 200, renderAdminPage(), {
            Vary: "Cookie"
        });
    } catch (error) {
        console.error("Protected admin route error:", error);
        redirect(res, "/admin.html?reason=session-expired", 302);
    }
};
