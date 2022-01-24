const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const util = require('util');

const AuthHandler = require('./handlers/AuthHandler');
const RoomHandler = require('./handlers/roomHandler');
const User = require('../models/User');
const Room = require('../models/Room');

const options = {
  cors: {
    origin: '*',
  },
};

module.exports = httpServer => {
  const io = new Server(httpServer, options);

  io.on('connection', socket => {
    const auth = new AuthHandler(socket);

    socket.on('user:register', async data => await auth.register(data));
    socket.on('user:login', async data => await auth.login(data));
  });

  // Chat Namespace
  const chatNs = io.of('/chat');

  chatNs.on('connect', async socket => {
    const roomHandler = new RoomHandler(socket);
    const rooms = await Room.find();
    socket.emit('chat:rooms', { rooms });
    socket.on('room:add', ({ name }) => roomHandler.add(name));
  });

  chatNs.use(async (socket, next) => {
    const { token } = socket.handshake.auth;
    try {
      const payload = await util.promisify(jwt.verify)(token, 'secret');
      const user = await User.findOne({ _id: payload.id }, { name: 1, email: 1 });
      if (!user) next(new Error('User with token invalid, try again.'));
      socket.user = user;
    } catch (error) {
      if (error.name == 'JsonWebTokenError') {
        next(new Error('Invalid token: please try again.'));
      }
      next(new Error(error));
    }
    next();
  });
};
