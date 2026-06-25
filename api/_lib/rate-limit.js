const attempts = new Map();

function cleanup(now, windowMs) {
    for (const [key, entry] of attempts.entries()) {
        if (now - entry.startedAt > windowMs) {
            attempts.delete(key);
        }
    }
}

function consumeRateLimit(key, { windowMs = 15 * 60 * 1000, max = 5 } = {}) {
    // This in-memory limiter is a best-effort shield for Vercel serverless functions.
    // For globally shared limits across instances, move this to a dedicated shared store.
    const now = Date.now();
    cleanup(now, windowMs);

    const current = attempts.get(key);

    if (!current || now - current.startedAt > windowMs) {
        attempts.set(key, {
            count: 1,
            startedAt: now
        });

        return {
            allowed: true,
            limit: max,
            remaining: Math.max(max - 1, 0),
            retryAfterSeconds: 0
        };
    }

    current.count += 1;
    attempts.set(key, current);

    const retryAfterSeconds = Math.max(
        0,
        Math.ceil((windowMs - (now - current.startedAt)) / 1000)
    );

    return {
        allowed: current.count <= max,
        limit: max,
        remaining: Math.max(max - current.count, 0),
        retryAfterSeconds
    };
}

function clearRateLimit(key) {
    attempts.delete(key);
}

module.exports = {
    clearRateLimit,
    consumeRateLimit
};
