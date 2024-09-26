const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@des Get all contacts
//@routes GET api/contacts
//@access private

// const getContact = asyncHandler(async (req, res) => {
//   const contact = await Contact.find({ user_id: req.user.id });
//   res.send(contact);
// });


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
  console.log("the user phone number is :", req.body);
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

//@des delete all contacts
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
    throw new Error("user dont have permission to delete other users contact");
  }

  const deleted = await Contact.findByIdAndDelete(req.params.id);
  res.send(deleted);
});



//@des all contacts information
//@routes POST api/contacts/allcontacts
//@access private


  const allContacts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
  
    try {
      const contacts = await Contact.find(req.user)
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
  


//@des delete all contacts by  admin
//@routes delete api/contacts/admin/id
//@access private

const deleteContactByAdmin = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if (req.user.id !== "66f06f73a7b56e75e12659c9") {
    res.status(403);
    throw new Error("user dont have permission to delete other users contact");
  }

  const deleted = await Contact.findByIdAndDelete(req.params.id);
  res.send(deleted);
});

module.exports = {
  getContact,
  postContact,
  getContactIndividual,
  putContact,
  deleteContact,
  allContacts,
  deleteContactByAdmin
};
