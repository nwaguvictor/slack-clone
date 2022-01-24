const params = new URL(document.location).searchParams;
const token = params.get('token');

const socket = io('http://localhost:2022/chat', { auth: { token } });

socket.on('chat:rooms', ({ rooms }) => {
  if (rooms.length <= 0) {
    // Add a general room, if the room array is empty
    socket.emit('room:add', { name: 'general' });
  }
  appendRooms(rooms);
});

$('#add__room').addEventListener('click', e => {
  e.preventDefault();
  $('.channel__form').classList.toggle('show');
});

$('.channel__form').addEventListener('submit', e => {
  e.preventDefault();
  const roomName = $('#channel').value;
  socket.emit('room:add', { name: roomName });

  $('#channel').value = '';
});

const roomList = document.querySelectorAll('.list__item');
console.log(roomList);

socket.on('room:added', ({ success, message }) => {
  if (success) {
    window.location.reload();
  }
});

socket.on('connect_error', error => {
  window.location.href = `http://localhost:2022/login.html?error=${error.message}`;
});

// Helpers
function appendRooms(rooms = []) {
  let roomList = '';
  rooms.forEach(room => {
    roomList += `<li class="list__item"># ${room.name}</li>`;
  });
  document.querySelector('.list').insertAdjacentHTML('beforeend', roomList);
}

function $(s) {
  return document.querySelector(s);
}
