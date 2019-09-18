'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    minlength: [3, 'name is atleast of 3 characters'],
    maxlength: [30, 'name does not exceeds 30 characters'],
    required: [true, 'please enter your name']
  },

  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'please enter your password'],
  },

});

module.exports = mongoose.model('user', UserSchema, 'users');