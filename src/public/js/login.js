const socket = io('http://localhost:2022');

const params = new URL(document.location).searchParams;
const error = params.get('error');
if (error) {
  alert(error);
}

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

socket.on('user:login-success', ({ token }) => {
  window.location = `http://localhost:2022/index.html?token=${token}`;
});
socket.on('user:login-error', message => alert(message));
