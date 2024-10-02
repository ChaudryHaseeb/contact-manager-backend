const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@des Get all contacts
//@routes GET api/contacts
//@access private

const getContact = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const contacts = await Contact.find({ user_id: req.user.id })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalContacts = await Contact.countDocuments();

    res.json({
      contacts,
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@des post all contacts
//@routes post api/contacts
//@access private

const postContact = asyncHandler(async (req, res) => {
  // console.log("the user phone number is :", req.body);
  const { name, email, number } = req.body;
  if (!name || !email || !number) {
    res.status(400);
    throw new Error("All fields are mendatory");
  }
  const contact = await Contact.create({
    name,
    email,
    number,
    user_id: req.user.id,
  });
  res.send(contact);
});

//@des Get individual contact
//@routes GET api/contacts/id
//@access private

const getContactIndividual = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.send(contact);
});

//@des put all contacts
//@routes put api/contacts/id
//@access private

const putContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user dont have permission to update other users contact");
  }

  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.send(updateContact);
});

//@des delete contacts by user
//@routes delete api/contacts/id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (req.user.id !== contact.user_id.toString()) {
    res.status(403);
    throw new Error(
      "User does not have permission to delete other users' contacts"
    );
  }

  const deleted = await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Contact deleted successfully", deleted });
});

//---------------------------------------------ADMIN Contoller----------------------------------------

//@des all contacts information
//@routes POST api/contacts/allcontacts
//@access private

const allContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const contacts = await Contact.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalContacts = await Contact.countDocuments();

    res.json({
      contacts,
      totalPages: Math.ceil(totalContacts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@des delete contacts by  admin
//@routes delete api/contacts/admin/id
//@access private

const deleteContactByAdmin = asyncHandler(async (req, res) => {
  // console.log("Contact ID received:", req.params.id);

  const contact = await Contact.findById(req.params.id);
  // console.log("contact------------", contact);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  // console.log("roleeeeeeee-----------", req.user.role);
  if (req.user.role === "admin") {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    return res.json({ message: "contact is deleted", deleted });
  } else {
    res.status(403);
    throw new Error("You do not have permission to delete this contact.");
  }
});

module.exports = {
  getContact,
  postContact,
  getContactIndividual,
  putContact,
  deleteContact,
  allContacts,
  deleteContactByAdmin,
};
