const axios = require('axios').default;

class AuthHandler {
  constructor(socket) {
    this.socket = socket;
  }

  async register({ name, email, password }) {
    try {
      const response = await axios.post('http://localhost:2022/register', { name, email, password });
      const { success, token } = await response.data;

      if (success) {
        this.socket.emit('user:register-success', { token });
      } else {
        this.socket.emit('user:register-error', response.data.message);
      }
    } catch (error) {
      this.socket.emit('user:register-error', error.message);
    }
  }

  async login({ email, password }) {
    try {
      const response = await axios.post('http://localhost:2022/login', { email, password });
      const { success, token } = await response.data;

      if (success) {
        this.socket.emit('user:login-success', { token });
      } else {
        this.socket.emit('user:login-error', response.data.message);
      }
    } catch (error) {
      this.socket.emit('user:login-error', error.message);
    }
  }
}

module.exports = AuthHandler;
