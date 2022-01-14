const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const schema = new Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'name field is required'],
  },
  email: {
    type: String,
    required: [true, 'email address field is required'],
    lowercase: true,
    trim: true,
    unique: [true, 'email address already exist'],
  },
  password: {
    type: String,
    required: [true, 'password field is required'],
    minlength: [4, 'password field must be at least 4 character'],
  },
});

schema.set('timestamps', true);

schema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.isNew) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.signToken = async function () {
  const token = await promisify(jwt.sign)({ id: this.id }, 'secret', { expiresIn: '90d' });
  return token;
};

module.exports = model('User', schema);
