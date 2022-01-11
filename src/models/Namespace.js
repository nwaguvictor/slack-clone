const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    unique: [true, 'namespace with name already used'],
  },
  rooms: {
    type: [Schema.Types.ObjectId],
    ref: 'Room',
  },
});

schema.set('timestamps', true);

module.exports = model('Namespace', schema);
