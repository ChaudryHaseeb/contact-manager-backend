const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@des register a user
//@routes POST api/user/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password ,role} = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mendatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User is alreay register");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log('hashed password', hashedPassword);

  //create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || 'user',
  });
//   console.log(`user is created ${user}`);
  // console.log('user===============================',user)
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("user is not valid");
  }

  res.json({ message: "register the user" });
});

//@des login a user
//@routes POST api/user/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
    // 
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        return res.json({ message: "Invalid email or password" });
    }

    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        res.status(401);
        return res.json({ message: "Invalid email or password" });
    }

    // Generate access token if password matches
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
        { expiresIn: "96000m" }
    );
    // console.log('check credientail-------',req.body)
    res.status(200).json({ accessToken,user });
});


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

//@des all user information
//@routes GET api/user/alluser
//@access private

const allUser = asyncHandler(
  async (req, res) => {
    const users = await User.find(req.user);
    res.status(200).json({
        message: 'All users retrieved successfully',
        users: users,
      });
  },
  {
    timestamp: true,
  }
);
//@des all user information
//@routes DELETE api/user/deleteuser
//@access private

const deleteUser = asyncHandler(
  async (req, res) => {
    const users = await User.find(req.user);
    res.status(200).json({
        message: 'Delete users retrieved successfully',
        users: users,
      });
  },
  {
    timestamp: true,
  }
);

module.exports = { registerUser, loginUser, currentUser, allUser, deleteUser };
