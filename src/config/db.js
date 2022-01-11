const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/slack', options);
    console.log(`::> Database connected successfully`);
  } catch (error) {
    console.log(`<:: Database connection error: ${error.message}`);
  }

  mongoose.connection.on('disconnected', () => {
    console.log(`<:: Database disconnected... Check mongod connection`);
  });
};
