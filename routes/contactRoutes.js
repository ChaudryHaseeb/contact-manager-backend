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


//------------------------------ IMPLEMENT TOKEN VALIDATION -------------------------

router.use(validateToken);

//------------------------------ ADMIN ACCESSIBLE ROUTES -------------------------

router
  .route("/admin/:id")
  .delete(rbac("delete", "contacts"), isAdmin, deleteContactByAdmin);
router
  .route("/allcontacts")
  .get(rbac("read", "contacts"), isAdmin, allContacts);


  //------------------------------ USER ACCESSIBLE ROUTES -------------------------

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
