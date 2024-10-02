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

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-token", verifyEmail);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.get("/allusers", validateToken, isAdmin, allUser);
router.delete("/:_id", validateToken, isAdmin, deleteUser);
// router.get('/admin',validateToken,isAdmin);

module.exports = router;
