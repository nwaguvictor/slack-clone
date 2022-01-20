const { Server } = require('socket.io');
const AuthHandler = require('./handlers/AuthHandler');

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
};
