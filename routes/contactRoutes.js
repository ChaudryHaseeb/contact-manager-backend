const express = require("express");
const router = express.Router();
const {
  getContact,
  postContact,
  getContactIndividual,
  putContact,
  deleteContact,
  allContacts,
  deleteContactByAdmin
} = require("../controllers/contactControllers");

const validateToken = require("../middleware/validateTokenHandler");
const rbac = require('../middleware/rbac');

router.get('/allcontacts',allContacts);

// router.delete('/admin/id', deleteContactByAdmin);

// Apply token validation to all routes
router.use(validateToken);


router.route('/')
    .get(rbac('read', 'contacts'), getContact) 
    .post(rbac('write', 'contacts'), postContact)

router.route('/:id')
    .get(rbac('read', 'contacts'), getContactIndividual) 
    .put(rbac('write', 'contacts'), putContact) 
    .delete(rbac('delete', 'contacts'), deleteContact); 

module.exports = router;