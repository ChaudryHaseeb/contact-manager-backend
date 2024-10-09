const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Contact = require("../models/contactModel");
const NodeMailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Setup Nodemailer Transporter
const transporter = NodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//=============================== USER REGISTERATION API ========================================

//@des register a user
//@routes POST api/user/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Create user (not verified yet)
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
    verificationToken,
    isVerified: false,
  });

  // Send verification email
  const verificationLink = `${process.env.FRONTEND_URL}/verify-token?token=${verificationToken}&email=${email}`;
  // console.log('send mail-----',process.env.FRONTEND_URL);
  // console.log('link----------',verificationLink);
  await transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Email Verification",
      html: `<h4>Verify your email</h4><p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    }, (error, info) => {
      if (error) {
        // console.error("Error sending email:", error); 
        return res.status(500).json({ message: "Error sending verification email." });
      } else {
        // console.log("Email sent: " + info.response); 
        return res.status(201).json({message:"User registered! Check your email to verify your account.",
          });
      }
    }
  );

  res.status(201).json({message: "User registered! Check your email to verify your account.", });
});


//=============================== USER REGISTERATION API EMAIL VERIFICATION ========================================

//@des verify email
//@routes GET api/user/verify-email
//@access public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.query;

  const user = await User.findOne({ email, verificationToken: token });

  if (!user) {

       return res.status(400).json({message : 'invalid email or token'}) 
 }

  user.isVerified = true;
  // user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

//=============================== USER LOGIN API ========================================


//@des login a user
//@routes POST api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    res.status(401);
    return res.json({ message: "Invalid email or account not verified" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    return res.json({ message: "Invalid password" });
  }

  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // user.verificationToken = undefined;
  res.status(200).json({ accessToken, user });
});

//=============================== USER CURRENT LOGIN API ========================================


//@des current user information
//@routes POST api/user/current
//@access private

const currentUser = asyncHandler(
  async (req, res) => {
    res.json(req.user);
  },
  {
    timestamp: true,
  }
);

//--------------------------------- ADMIN CONTTROLLER -------------------------------------------

//=============================== ADMIN GET API ALL USERS ========================================

//@des all user information get by admin
//@routes GET api/user/alluser
//@access private

const allUser = asyncHandler(
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
      const users = await User.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalUsers = await User.countDocuments();
      res.status(200).json({
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
        message: "All users retrieved successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  {
    timestamp: true,
  }
);

//=============================== ADMIN DELETE API ALL USER ========================================


//@des delete user by admin
//@routes DELETE api/user/deleteuser
//@access private

const deleteUser = asyncHandler(
  async (req, res) => {
    const users = await User.findById(req.params._id);
    if (!users) {
      res.status(404);
      throw new Error("user not found");
    }

    await User.findByIdAndDelete(req.params._id);
    const deleteContacts = await Contact.deleteMany({
      user_id: req.params._id,
    });
    // console.log('deleted all contacts', deleteContacts)
    return res.json({ message: "user deleted successfully", deleteContacts });
  },
  {
    timestamp: true,
  }
);

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  allUser,
  deleteUser,
  currentUser,
};
