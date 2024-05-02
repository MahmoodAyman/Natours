const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us Your name 😁']
  },
  email: {
    type: String,
    required: [true, 'user must Enter an E-mail'],
    unique: true, // email gonna be unique
    lowercase: true,
    validate: [validator.isEmail, 'please Enter a valid email address']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],

    validate: {
      // check if passwordConfirm is equivalent to the password
      validator: function(element) {
        return element === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Hashing the password
  this.password = await bcrypt.hash(this.password, 12);
  // we just need password confirm so user make sure he didn't mistake and then delete it
  this.passwordConfirm = undefined;
  next();
});
// login checker password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);
module.exports = User;