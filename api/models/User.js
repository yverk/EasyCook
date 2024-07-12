const mongoose = require('mongoose');
/*
 - Username and password is stored into 'User' in database
 - User has a subsection called recipeHistory that stores string of text into database
*/
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  recipeHistory: [
    {
      input: { type: String },
      output: {type: String },
    },
  ],
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;