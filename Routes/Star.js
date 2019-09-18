'use strict';
   
const fs = require('fs');

var Utils = require('../Utils');

module.exports = function (app) {

    // star Routes
    app.get('/logs', function(req, res){
        let data = fs.readFileSync('logs.txt', "utf8")

        data = data.slice(2, data.length)
        data = "[" + data + "]"
        data = JSON.parse(data)
        data.reverse()
        res.send(data)   
    })

    app.route('*')
        .get(function (req, res) {
            let error = new Error()
            error.code = 404
            throw error
            // return Utils.Responses.errorMsg(req, res, 404, "Not Found", "path not found.", null);
        })
        .put(function (req, res) {
            let error = new Error("Page not found here")
            error.code = 404
            throw error
        })
        .delete(function (req, res) {
            let error = new Error("Page not found here")
            error.code = 404
            throw error
        })
        .post(function (req, res) {
            let error = new Error("Page not found here")
            error.code = 404
            throw error
        })

};