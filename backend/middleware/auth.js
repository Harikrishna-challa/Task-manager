// middleware/auth.js  
import jwt from 'jsonwebtoken';  
import User from '../models/User.js';  

export const isAuthenticated = async (req, res, next) => {  
  // 1️ Try to read token from Authorization header  
  let token = null;  
  const authHeader = req.headers.authorization;  
  if (authHeader && authHeader.startsWith('Bearer ')) {  
    token = authHeader.split(' ')[1];  
  }  

  // 2️ Fallback: read token from cookie if not in header  
  if (!token && req.cookies?.token) {  
    token = req.cookies.token;  
  }  

  if (!token) {  
    return res  
      .status(401)  
      .json({ success: false, message: 'Authentication required' });  
  }  

  try {  
    // verify JWT  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  

    // load user and omit password  
    const user = await User.findById(decoded.id).select('-password');  
    if (!user) {  
      return res  
        .status(401)  
        .json({ success: false, message: 'User not found' });  
    }  

    req.user = user;            // attach user to request  
    next();                     // proceed to next middleware/controller  
  } catch (error) {  
    return res  
      .status(401)  
      .json({ success: false, message: 'Invalid or expired token' });  
  }  
};  
