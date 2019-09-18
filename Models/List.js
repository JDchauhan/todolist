'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },

  date: {
    type: Date,
    required: [true, 'please enter the date']
  },

  title: {
    type: String,
    required: [true, 'please enter title'],
  },

  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    required: [true, 'please enter status'],
  },

});

module.exports = mongoose.model('lists', ListSchema, 'lists');