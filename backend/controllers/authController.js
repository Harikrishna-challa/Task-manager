// controllers/authController.js
import User from "../models/User.js"; // Import the User model
import jwt from "jsonwebtoken";

//  1. Generate JWT Token
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

//  2. Register User (POST /api/auth/register)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
//   decide role based on secret
     const role =adminKey ===process.env.ADMIN_SECRET ? "admin" : "user"; 
    //  Mongoose will hash the password using pre-save hook
    const user = await User.create({ name, email, password, role });

    // Create JWT payload
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  3. Login User (POST /api/auth/login)
export const loginUser = async (req, res) => {
  try {
    console.log("[Login] req.body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password role");
    console.log("[Login] User from DB:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password); // ✅ Use model method
    console.log("[Login] bcrypt.compare result:", isMatch);

    if (!isMatch) {
      console.log("[Login] Password did not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id.toString(),
      role: user.role,
    };

    const token = generateToken(payload);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
