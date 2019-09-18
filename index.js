#!/usr/bin/env nodejs

'use strict';

var Config = require('./Config');

const express = require('express'),
    app = express(),
    port = Config.App.port,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    rateLimit = require("express-rate-limit");

var Utils = require('./Utils');

app.use(helmet())

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: "Too Many Requests",
        errors: "Too many requests, please try again later."
    }
});

//  apply to all requests
app.use(limiter);

// for limiting which starts with /api/
// app.use("/api/", limiter);

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

mongoose.Promise = global.Promise;

mongoose.connect(Config.Database.url, {
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(function (req, res, next) {
    req.startRequestTime = new Date()
    next()
})

var Routes = require('./Routes');

Routes.Users(app);
Routes.Lists(app);
Routes.Star(app);

//error handling

//Joi
app.use(function (err, req, res, next) {
    let errors
    if (err && err.error && err.error.isJoi) {
        errors = err.error.details[0].message.toString()
        return Utils.Responses.errorMsg(req, res, 400, "Bad Request", "validation failed.", errors);

    } else {
        next(err)
    } 
});

//Remaining
app.use(function (err, req, res, next) {
    if (err.code && err.code == 404) {
        return Utils.Responses.errorMsg(req, res, 404, "Not Found", "no data found.", null);

    } else if ((err.name && err.name == "UserExistsError") || (err.code && err.code == 11000)) {
        return Utils.Responses.errorMsg(req, res, 409, "Conflict", "duplicate record.", null);

    } else if (err.name && err.name == "ValidationError") {
        errors = {
            "index": err.name
        };
        return Utils.Responses.errorMsg(req, res, 400, "Bad Request", "validation failed.", errors);

    } else if (err.code && err.code == 403) {
        return Utils.Responses.errorMsg(req, res, 403, "Forbidden", "Permission Denied.", null);
    
    } else if (err.code && err.code == 401) {
        return Utils.Responses.errorMsg(req, res, 401, "Unauthorized", "failed to authenticate token.", null);

    } else {
        return Utils.Responses.errorMsg(req, res, 500, "Unexpected Error", "unexpected error.", null, err.stack);
    }
})

app.listen(Config.App.port);

console.log('RESTful API server started on PORT:' + Config.App.port + ', DEBUG: ' +
    process.env.DEBUG + ', NODE_ENV: ' + process.env.NODE_ENV);

if (process.env.DEBUG === 'false') {
    console.log = function () {}
}