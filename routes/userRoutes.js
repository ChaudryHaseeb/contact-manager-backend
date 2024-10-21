const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  allUser,
  deleteUser,
  verifyEmail,
} = require("../controllers/userController");
const isAdmin = require("../middleware/admin");
const validateToken = require("../middleware/validateTokenHandler");
const { forgotPassword, resetPassword} = require("../controllers/resetPassword");


const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-token", verifyEmail);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//------------------------------ ADMIN ACCESSIBLE ROUTES -------------------------

router.get("/allusers", validateToken, isAdmin, allUser);
router.delete("/:_id", validateToken, isAdmin, deleteUser);

module.exports = router;
