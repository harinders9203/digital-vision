const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { getAuthConfig } = require("./config");

function isSecureRequest(req) {
    const forwardedProto = req.headers["x-forwarded-proto"];

    if (typeof forwardedProto === "string" && forwardedProto.trim()) {
        return forwardedProto.split(",")[0].trim() === "https";
    }

    return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

function getRequestCookies(req) {
    return cookie.parse(req.headers.cookie || "");
}

function signAdminJwt(username) {
    // Keep the token payload minimal: identity plus authorization context only.
    const config = getAuthConfig();

    return jwt.sign(
        { role: "admin" },
        config.jwtSecret,
        {
            algorithm: "HS256",
            audience: "digital-vision-admin",
            expiresIn: config.tokenTtlSeconds,
            issuer: "digital-vision",
            subject: username
        }
    );
}

function verifyAdminJwt(token) {
    const config = getAuthConfig();

    return jwt.verify(token, config.jwtSecret, {
        algorithms: ["HS256"],
        audience: "digital-vision-admin",
        issuer: "digital-vision"
    });
}

function createSessionCookie(req, token) {
    // HTTP-only, same-site cookies keep the JWT out of frontend JavaScript.
    const config = getAuthConfig();

    return cookie.serialize(config.tokenCookieName, token, {
        httpOnly: true,
        maxAge: config.tokenTtlSeconds,
        path: "/",
        sameSite: "strict",
        secure: isSecureRequest(req)
    });
}

function clearSessionCookie(req) {
    const config = getAuthConfig();

    return cookie.serialize(config.tokenCookieName, "", {
        expires: new Date(0),
        httpOnly: true,
        maxAge: 0,
        path: "/",
        sameSite: "strict",
        secure: isSecureRequest(req)
    });
}

function getAdminSession(req) {
    const config = getAuthConfig();
    const cookies = getRequestCookies(req);
    const token = cookies[config.tokenCookieName];

    if (!token) {
        return null;
    }

    try {
        // Invalid or expired tokens never leak details back to the client.
        return verifyAdminJwt(token);
    } catch {
        return null;
    }
}

module.exports = {
    clearSessionCookie,
    createSessionCookie,
    getAdminSession,
    signAdminJwt
};
