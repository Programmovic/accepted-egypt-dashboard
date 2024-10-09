import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token format

    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = decoded; // Attach user info to the request
        next();
    });
};

export default authMiddleware;
