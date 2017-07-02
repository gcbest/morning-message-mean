const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors'); // allows you to make requests to your api from a different domain name/port
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect to Database
mongoose.connect(config.database);

// Listen for connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${config.database}`);
});

// Listen for error
mongoose.connection.on('error', (err) => {
  console.log(`database error: ${err}`);
});

const app = express();

const users = require('./routes/user-routes');

const port = process.env.PORT || 4000;

// Cors Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', users);

// Index Route
app.get('/', (req,res) => {
  res.send('Nothing here');
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
