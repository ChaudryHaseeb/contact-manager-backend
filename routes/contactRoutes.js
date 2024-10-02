const express = require("express");
const router = express.Router();
const {
  getContact,
  postContact,
  getContactIndividual,
  putContact,
  deleteContact,
  allContacts,
  deleteContactByAdmin,
} = require("../controllers/contactControllers");
const isAdmin = require("../middleware/admin");
const validateToken = require("../middleware/validateTokenHandler");
const rbac = require("../middleware/rbac");

router.use(validateToken);

router
  .route("/admin/:id")
  .delete(rbac("delete", "contacts"), isAdmin, deleteContactByAdmin);
router
  .route("/allcontacts")
  .get(rbac("read", "contacts"), isAdmin, allContacts);

router
  .route("/")
  .get(rbac("read", "contacts"), getContact)
  .post(rbac("write", "contacts"), postContact);

router
  .route("/:id")
  .get(rbac("read", "contacts"), getContactIndividual)
  .put(rbac("write", "contacts"), putContact)
  .delete(rbac("delete", "contacts"), deleteContact);

module.exports = router;
