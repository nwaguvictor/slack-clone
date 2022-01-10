const { Server } = require('socket.io');

const options = {
  cors: {
    origin: '*',
  },
};

module.exports = httpServer => {
  const io = new Server(httpServer, options);

  io.on('connection', socket => {
    socket.on('event:connected', msg => console.log(msg));
  });
};
