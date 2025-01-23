import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.body.token;
  // console.log(token);
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Add user info to request object
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token' });
  }
};

export default authenticateToken;
