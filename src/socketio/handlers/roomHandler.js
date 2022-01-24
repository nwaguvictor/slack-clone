const Room = require('../../models/Room');

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
};
