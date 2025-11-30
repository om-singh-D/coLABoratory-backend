import jwt from "jsonwebtoken";


export const authUser = (req, res, next) => {
    console.log('=== AUTH MIDDLEWARE EXECUTING ===');
    try {
        // Prefer Authorization header over cookies
        let token = req.headers.authorization || req.cookies.token;
        
        console.log('Raw token from headers:', req.headers.authorization);
        console.log('Raw token from cookies:', req.cookies.token);
        
        // Remove 'Bearer ' prefix if present
        if (token && token.startsWith('Bearer ')) {
            token = token.replace('Bearer ', '');
        }
        
        console.log('Final token to verify:', token);
        
        if (!token) { 
            console.log('No token found!');
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        console.log('req.user set to:', req.user);
        next();
    } catch (error) {
        console.log('Auth error:', error.message);
        res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
}