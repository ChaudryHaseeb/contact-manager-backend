const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter username"],
  },
  email: {
    type: String,
    required: [true, "Please enter user email address"],
    unique: [true, "Please enter unique email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter user password"],
  },
 role:{
    type: String,
    enum: ['admin','user'],
    default: 'user'        
 }
});
userSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("User", userSchema);
