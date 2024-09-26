const asyncHandler = require("express-async-handler");
const getPaginatedContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5 } = req.query; 
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const skip = (pageNum - 1) * limitNum;

  // Fetch paginated contacts from the database
  const contacts = await Contact.find({ user_id: req.user.id })
    .skip(skip)
    .limit(limitNum)
    .exec();

  const totalContacts = await Contact.countDocuments({ user_id: req.user.id });
  const totalPages = Math.ceil(totalContacts / limitNum);

  res.json({
    contacts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalPages,
      totalContacts,
    },
  });
});
