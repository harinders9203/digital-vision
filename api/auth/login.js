const bcrypt = require("bcryptjs");
const { clearSessionCookie, createSessionCookie, signAdminJwt } = require("../_lib/auth");
const { getAuthConfig } = require("../_lib/config");
const { getClientIp, readJsonBody, sendJson, sendMethodNotAllowed } = require("../_lib/http");
const { clearRateLimit, consumeRateLimit } = require("../_lib/rate-limit");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        sendMethodNotAllowed(res, ["POST"]);
        return;
    }

    let payload;

    try {
        payload = await readJsonBody(req);
    } catch (error) {
        sendJson(res, 400, {
            error: error.message === "Request body too large."
                ? "Request body too large."
                : "Invalid JSON body."
        });
        return;
    }

    const username = String(payload?.username || "").trim();
    const password = String(payload?.password || "");
    const rateLimitKey = `login:${getClientIp(req)}:${username.toLowerCase() || "unknown"}`;
    const rateLimit = consumeRateLimit(rateLimitKey);

    res.setHeader("X-RateLimit-Limit", String(rateLimit.limit));
    res.setHeader("X-RateLimit-Remaining", String(rateLimit.remaining));

    if (!rateLimit.allowed) {
        res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
        sendJson(res, 429, {
            error: "Too many login attempts. Please wait and try again."
        });
        return;
    }

    if (!username || !password) {
        sendJson(res, 400, {
            error: "Username and password are required."
        });
        return;
    }

    try {
        const config = getAuthConfig();
        const isUsernameMatch = username === config.adminUser;
        const isPasswordMatch = isUsernameMatch && bcrypt.compareSync(password, config.adminPassHash);

        if (!isUsernameMatch || !isPasswordMatch) {
            // Use a generic error so attackers do not learn which field was wrong.
            res.setHeader("Set-Cookie", clearSessionCookie(req));
            sendJson(res, 401, {
                error: "Invalid credentials."
            });
            return;
        }

        clearRateLimit(rateLimitKey);

        const token = signAdminJwt(config.adminUser);
        res.setHeader("Set-Cookie", createSessionCookie(req, token));
        sendJson(res, 200, {
            ok: true,
            redirectTo: "/admin"
        });
    } catch (error) {
        console.error("Admin login error:", error);
        sendJson(res, 500, {
            error: "Authentication is currently unavailable."
        });
    }
};
