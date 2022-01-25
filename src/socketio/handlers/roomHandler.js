const Room = require('../../models/Room');
const Message = require('../../models/Message');

module.exports = class RoomHandler {
  constructor(socket) {
    this.socket = socket;
  }
  async add(name) {
    try {
      await Room.create({ name });
      this.socket.emit('room:added', { success: true, message: 'Room added successfully' });
    } catch (error) {
      this.socket.emit('room:add_error', { success: false, message: error.message });
    }
  }

  async getAll() {
    const rooms = await Room.find();
    return rooms;
  }

  async join(name) {
    try {
      const room = await Room.findOne({ name });
      if (room) {
        this.socket.join(name);
        const chats = await Message.find({ room: room._id });
        return chats;
      }
    } catch (error) {}
  }
};
