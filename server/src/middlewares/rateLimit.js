import { ipKeyGenerator, rateLimit } from 'express-rate-limit';


//for general rateLimit for authentication endpoints
export const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, //this gives us a one minute window
    max: 10, //No of attempts within a one-minute window
    message: "too many requests, try again after one minute",
    standardHeaders: true, //this returns rateLimit info in the headers
    keyGenerator: (req) => {
        //we use ip address + user agent to identify unique clients
        return `${ipKeyGenerator(req.ip)}-${req.headers["user-agent"] | "unknown user-agent"}`;
    },
legacyHeaders: false, //this disables X-RateLimit headers
trustProxy: true, //trust the X-Forwarded-For header
});

// rate limit for refresh token endpoint
export const refreshTokenLimit = rateLimit({
    windowMs: 15 * 60 * 1000, //this gives us a 15 minute window
    max: 30, //No of attempts within a 30-minute window
    message: "too many requests, try again after one minute",
    standardHeaders: true, //this returns rateLimit info in the headers
    keyGenerator: (req) => {
        //we use ip address + user agent to identify unique clients
        return `${ipKeyGenerator(req.ip)}-${req.headers["user-agent"] | "unknown user agent"}`;
    },
legacyHeaders: false, //this disables X-RateLimit headers
trustProxy: true, //trust the X-Forwarded-For header
});