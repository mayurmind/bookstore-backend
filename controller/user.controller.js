import User from "../model/usermodel.js";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET_KEY || "change_this_dev_secret";
    return jwt.sign({ userId, role }, secret, { expiresIn: "30d" });
};

export const signup = async (req, res) => {
    try {
        const { username, email, password,role } = req.body;
        if (!username || !email || !password || !role ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = await User.create({ username, email, password ,role});
        const token = generateToken(newUser._id, newUser.role);
        return res.status(201).json({
            success: true,
            message: "User created",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
   

 export const login = async (req, res) => { 
  try { 
    const { email, password } = req.body; 
 
    if (!email || !password) { 
      return res.status(400).json({ message: "Email and password are required" }); 
    } 
 
    const user = await User.findOne({ email }).select("+password"); 
    if (!user) { 
      return res.status(401).json({ message: "Invalid email or password" }); 
    } 
 
    const isPasswordCorrect = await user.matchPassword(password); 
    if (!isPasswordCorrect) { 
      return res.status(401).json({ message: "Invalid email or password" }); 
    } 
 
    const token = generateToken(user._id, user.role); 
 
    res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
      }, 
    }); 
  } catch (error) { 
    console.error("Login Error:", error); 
res.status(500).json({ message: "Internal Server Error" }); 
} 
};
