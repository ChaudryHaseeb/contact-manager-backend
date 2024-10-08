const asyncHandler = require('express-async-handler');
const NodeMailer = require('nodemailer');
const  bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const Transporter = NodeMailer.createTransport({
    host : 'smtp.gmail.com',
    port : 465,
    secure : true,
    auth : {
       user :  process.env.EMAIL_USER,
       pass :  process.env.EMAIL_PASS,
    },
});

const forgotPassword = asyncHandler( async (req, res) =>{
    const { email } = req.body;
    try {

        const user = await User.findOne({ email });

        if(!user){

            return res.status(400).send('User not found');

        };

        const resetToken = jwt.sign({id : user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '1h'});

        const resetURL = `http://localhost:3000/auth/reset_password/${resetToken}`;
        const message = `Click here to reset your password: ${resetURL}`;

        await Transporter.sendMail({
            from : process.env.EMAIL_USER,
            to : email,
            subject : 'Reset Password',
            text : message,
        }
        );

        res.status(200).send('Password reset link sent to your email ');

    } catch (error) {

        res.status(404).send('Error in sending email');

    };
});


const resetPassword = asyncHandler( async(req, res )=>{
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify( token , process.env.ACCESS_TOKEN_SECRET );
        const user = await User.findById( decoded.id );

        console.log('user----------', user);

        if (!user) {
            return res.status(400).send('User token is not valid');
        }

        const hashedPassword = await bcrypt.hash( password, 10 );

        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password reset successfull');
        
    } catch (error) {
        res.status(404).send('Error in reseting password or invalid token');
    }
})
 
module.exports = { forgotPassword, resetPassword };