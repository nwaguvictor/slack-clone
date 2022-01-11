const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'name of room is required'],
    lowercase: true,
  },
  namespace: {
    type: Schema.Types.ObjectId,
    required: [true, 'please provide namespace id'],
    ref: 'Namespace',
  },
});

schema.set('timestamps', true);

module.exports = model('Room', schema);
