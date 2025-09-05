const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: "admin" },
      process.env.JWT_SCERECT_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      username: admin.username,
      role: admin.role,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const adminMe = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SCERECT_KEY);
    res.json({ username: decoded.username, role: decoded.role });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const signOut = (req, res, next) => {
  res.status(200).clearCookie("token").json({
    message: "Signed Out.",
  });
};

module.exports = { adminLogin, signOut, adminMe };
