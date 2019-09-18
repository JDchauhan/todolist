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
    app.get("/todo" , (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify,
        Controllers.Lists.list);

    app.post("/todo" , (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify, 
        Validator.body(Joi.object({
            date: Joi.date().required(),
            title: Joi.string().trim().max(50).required(),
            status: Joi.string().alphanum().valid(["todo", "inprogress", "done"]).required()
        })), 
        Controllers.Lists.register);

    app.put("/todo" , (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify, 
        Validator.body(Joi.object({
            date: Joi.date().optional(),
            title: Joi.string().trim().max(50).optional(),
            status: Joi.string().alphanum().valid(["todo", "inprogress", "done"]).optional()
        })), 
        Controllers.Lists.update);

    app.delete("/todo" , (req, res, next) => {next(["user"], ...arguments)}, Utils.Auth.verify,
        Controllers.Lists.list);

};