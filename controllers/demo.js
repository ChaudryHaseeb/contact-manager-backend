const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Assuming you have a User model

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or any other service like SendGrid
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Request password reset - Generate token and send email
app.post('/api/request-reset-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Generate a reset token with expiration (1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the reset email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `Click here to reset your password: ${resetUrl}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: message,
    });

    res.status(200).send('Password reset link sent to your email');
  } catch (error) {
    res.status(500).send('Error sending reset email');
  }
});

// Reset password using token
app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).send('Invalid token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).send('Password reset successful');
  } catch (error) {
    res.status(400).send('Token expired or invalid');
  }
});
