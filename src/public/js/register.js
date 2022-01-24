const socket = io('http://localhost:2022');

const params = new URL(document.location).searchParams;
const error = params.get('error');
if (error) {
  alert(error);
}

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

socket.on('user:register-success', ({ token }) => {
  window.location = `http://localhost:2022/index.html?token=${token}`;
});
socket.on('user:register-error', message => alert(message));
