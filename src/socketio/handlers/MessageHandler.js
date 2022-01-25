const Message = require('../../models/Message');
const Room = require('../../models/Room');

module.exports = class MessageHandler {
  constructor(socket) {
    this.socket = socket;
  }

  async create(room, text) {
    try {
      const user = this.socket.user._id;
      const _room = await Room.findOne({ name: room });
      const message = await Message.create({ text, user, room: _room._id });

      return {
        text: message.text,
        user: this.socket.user.name,
        time: new Date(message.createdAt).toLocaleString(),
      };
    } catch (error) {}
  }
};
