const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = {
  register: async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new Error('name, email, and password are required fields'));
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) return next(new Error('User with email already exist'));
      user = new User({ name, email, password });
      await user.save();
      const token = await user.signToken();
      res.status(200).send({ success: true, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new Error('email and password must be provided'));
    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.confirmPassword(password))) {
        return next(new Error('Incorrect email or password'));
      }
      const token = await user.signToken();
      res.status(200).send({ success: true, token });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },
};
