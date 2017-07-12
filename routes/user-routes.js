const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/users');

// Register
router.post('/register', (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: "Failed to register user"});
    } else {
      res.json({success: true, msg: "User registered"});
    }
  })
});

// Authenticate
router.post('/authenticate', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;

    // No user returned
    if (!user) {
      return res.json({success: false, msg: "User not found"});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if(isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({success: false, msg: "Wrong password"});
      }
    });
  })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({user: req.user});
});

// Get Settings
router.get('/settings', (req, res) => {
  User.getUserById(req.query._id, (err, user) => {
      res.json({user: user});
  });
});

// Add Message Topics
router.post('/settings', (req, res) => {
  console.log(req.body);
  User.getUserById(req.body._id, (err, user) => {
    console.log(user);
    user.settings = req.body.selections;
    user.save((err, updatedUser) => {
      if (err) console.log(err);
        res.json(updatedUser);
    });
  });
});

module.exports = router;
