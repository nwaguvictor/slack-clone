const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = {
  register: async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) return next(new Error('User with email already exist'));
      user = new User({ name, email, password });
      await user.save();
      const token = await user.signToken();
      res.status(200).send({ token });
    } catch (error) {
      next(error.message);
    }
  },
};
