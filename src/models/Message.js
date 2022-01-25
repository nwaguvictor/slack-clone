const { Schema, model } = require('mongoose');

const schema = new Schema({
  text: {
    type: String,
    required: [true, 'text is required when creating a message'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'user id is required to create a message'],
    ref: 'User',
  },
  room: {
    type: Schema.Types.ObjectId,
    required: [true, 'a message must have a room id'],
    ref: 'Room',
  },
});

schema.set('timestamps', true);

schema.pre(/^find/, function (next) {
  this.populate({
    path: 'room',
    select: 'name -_id',
  });
  this.populate({
    path: 'user',
    select: 'name -_id',
  });
  next();
});

module.exports = model('Message', schema);
