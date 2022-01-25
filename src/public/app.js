const params = new URL(document.location).searchParams;
const token = params.get('token');

const socket = io('http://localhost:2022/chat', { auth: { token } });

socket.on('room:list', ({ rooms }) => {
  if (rooms.length <= 0) {
    // Add initial 'general' room, if the room array is empty
    socket.emit('room:add', { name: 'general' });
  }
  appendRooms(rooms);

  // Initially join general room
  joinRoom('general');

  // Add eventListener to each DOM room list
  const roomList = document.querySelectorAll('.list__item');
  Array.from(roomList).forEach(room => {
    room.addEventListener('click', e => {
      const roomName = e.target.innerText.split(' ')[1];
      joinRoom(roomName);
    });
  });
});

// Room Messages
$('#message-form').addEventListener('submit', e => {
  e.preventDefault();
  const text = $('.message__input').value;
  const room = $('.chat__title-text').innerText.split(' ')[1];
  socket.emit('message:send', { room, text });
});

socket.on('message:receive', ({ text, user, time }) => {
  const message = buildHtmlMessage({ text, user, time });
  $('.messages').insertAdjacentHTML('beforeend', message);

  $('.chat').scrollTo({
    top: $('.chat').scrollHeight,
    left: 0,
    behavior: 'auto',
  });
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

function joinRoom(name) {
  // TODO:
  socket.emit('room:join', { name }, ({ count, chats }) => {
    // Update DOM room users count
    $('.chat__users-count').innerText = count;
    $('.chat__title-text').innerText = `# ${name}`;
    $('.message__input').setAttribute('placeholder', `Message #${name}`);

    // Update DOM chat messages
    let chatHistory = '';
    chats.forEach(({ text, user, createdAt }) => {
      const time = new Date(createdAt).toLocaleString();
      chatHistory += buildHtmlMessage({ text, user: user.name, time });
    });
    $('.messages').innerHTML = chatHistory;

    $('.chat').scrollTo({
      top: $('.chat').scrollHeight,
      left: 0,
      behavior: 'auto',
    });
  });
}

function buildHtmlMessage({ text, user, time }) {
  return `
  <div class="message__card">
    <div class="sender__avatar">
      <ion-icon name="person-outline" class="sender__avatar--icon"></ion-icon>
    </div>
    <div>
      <div class="sender__info">
        <div class="sender__name">${user}</div>
        <div class="sender__message-time">${time}</div>
      </div>
      <div class="sender__message">${text}</div>
    </div>
  </div>`;
}

function $(s) {
  return document.querySelector(s);
}
