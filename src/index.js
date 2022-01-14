const express = require('express');
const { createServer } = require('http');
const connectDB = require('./config/db');
const socketio = require('./socketio');
const authRoute = require('./routes/auth.route');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/', authRoute);

// Error Handlers
app.all('*', (req, res, next) => {
  next(new Error(`Route not found: can not make a ${req.method} request to ${req.originalUrl}`));
});

app.use((err, req, res, next) => {
  res.status(500).send({ success: false, message: err.message });
});

const server = createServer(app);
socketio(server);

const PORT = process.env.PORT || 2022;
server.listen(PORT, async () => {
  await connectDB();
  console.log(`::> Server running http://localhost:${PORT}`);
});
