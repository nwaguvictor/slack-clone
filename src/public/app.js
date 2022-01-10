const socket = io('http://localhost:2022');

socket.on('connect', () => {
  socket.emit('event:connected', `${socket.id} connected`);
});

socket.on('welcome', msg => console.log(msg));
