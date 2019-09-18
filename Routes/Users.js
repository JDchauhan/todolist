'use strict';

const Joi = require('joi');
const Validator = require('express-joi-validation').createValidator({
    // You can pass a specific Joi instance using this option. By default the
    // module will load the @hapi/joi version you have in your package.json
    // joi: require('@hapi/joi')
    passError: true
});

var Controllers = require('../Controllers');    
var Utils = require('../Utils');

module.exports = function (app) {

    // user Routes

    app.post("/register", Validator.body(Joi.object({
        name: Joi.string().alphanum().min(3).max(50).required(),
        email: Joi.string().email().max(50).required(),
        password: Joi.string().alphanum().min(8).max(16).required()
    })), Controllers.Users.register);

    app.post("/login", Validator.body(Joi.object({
        email: Joi.string().email().min(3).max(256).required(),
        password: Joi.string().min(8).max(16).required(),
    })), Controllers.Users.login);

    app.put("/user",(req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify,
        Validator.body(Joi.object({
            name: Joi.string().alphanum().max(50).optional(),
            password: Joi.string().max(16).optional(),
        })), Controllers.Users.update);

};