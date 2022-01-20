const socket = io('http://localhost:2022');

const $ = s => document.querySelector(s);

// Register form submission
$('#form__register').addEventListener('submit', e => {
  e.preventDefault();

  const name = $('#name').value;
  const email = $('#email').value;
  const password = $('#password').value;
  socket.emit('user:register', { name, email, password });

  // clear fields
  $('#name').value = '';
  $('#email').value = '';
  $('#password').value = '';
});

socket.on('user:register-success', ({ success, token, user }) => {
  if (success) {
    window.location = 'http://localhost:2022/index.html';
  }
});
socket.on('user:register-error', message => alert(message));
