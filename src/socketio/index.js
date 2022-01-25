const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const util = require('util');

const AuthHandler = require('./handlers/AuthHandler');
const RoomHandler = require('./handlers/RoomHandler');
const User = require('../models/User');
const MessageHandler = require('./handlers/MessageHandler');

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
    socket.emit('user:connected', socket.user);

    const roomHandler = new RoomHandler(socket);
    const messageHandler = new MessageHandler(socket);
    const rooms = await roomHandler.getAll();

    socket.emit('room:list', { rooms });
    socket.on('room:add', async ({ name }) => await roomHandler.add(name));

    socket.on('room:join', async ({ name }, cb) => {
      const chats = await roomHandler.join(name);
      const count = io.of('/chat').adapter.rooms.get(name).size;
      chatNs.to(name).emit('room:joined', count);
      cb(chats);
    });

    // Messages
    socket.on('message:send', async ({ room, text }) => {
      const messageData = await messageHandler.create(room, text);
      chatNs.in(room).emit('message:receive', messageData);
    });
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
