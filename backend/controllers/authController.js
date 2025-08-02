const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email/Password Registration
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: 'User',
      isVerified: true,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Email/Password Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,           // Added _id here
        email: user.email,
        role: user.role,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        password: '', // Google account, so not needed
        name,
        profilePic: picture,
        role: 'User',
        isVerified: true,
      });
    } else {
      // Update name/profilePic if not set
      let updated = false;
      if (!user.name) {
        user.name = name;
        updated = true;
      }
      if (!user.profilePic) {
        user.profilePic = picture;
        updated = true;
      }
      if (updated) await user.save();
    }

    const appToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token: appToken,
      user: {
        _id: user._id,           // Added _id here
        email: user.email,
        role: user.role,
        name: user.name,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};
