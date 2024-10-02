const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Route to verify email
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
  
    const user = await User.findOne({ verificationToken: token });
  
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  
    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token after verification
    await user.save();
  
    res.status(200).json({ message: "Email verified successfully" });
  });
  
  module.exports = { verifyEmail };
  