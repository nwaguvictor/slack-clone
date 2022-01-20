const socket = io('http://localhost:2022');

const $ = s => document.querySelector(s);

// Login form submission
$('#form__login').addEventListener('submit', e => {
  e.preventDefault();

  const email = $('#email').value;
  const password = $('#password').value;
  socket.emit('user:login', { email, password });

  // clear fields
  $('#email').value = '';
  $('#password').value = '';
});

socket.on('user:login-success', ({ success, token, user }) => {
  if (success) {
    window.location = 'http://localhost:2022/index.html';
  }
});
socket.on('user:login-error', message => alert(message));
