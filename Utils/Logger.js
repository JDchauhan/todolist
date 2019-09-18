'use strict';

const fs = require('fs');

const colors = require('colors');

module.exports.log = function (isError, req, response) {
    let logged = {
        isError: isError,
        ip: req.ip,
        path: req.url,
        method: req.method,
        timeTaken: new Date() - req.startRequestTime + " ms",
        time: new Date().toString(),
        user: req.user,
        header: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
        response: response
    }
    fs.appendFile('logs.txt', ',\n' + JSON.stringify(logged), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    console.log("-----------------------------------------------------------------------".yellow)
    if (isError) {
        console.log((req.method + " " + req.url).toString().bold.underline.red)
    } else {
        console.log((req.method + " " + req.url).toString().bold.underline.green)
    }
    console.log("IP: ".toString().bold + logged.ip)
    console.log("Time: ".toString().bold + logged.time)
    console.log("Time Taken: ".toString().bold + logged.timeTaken)
    console.log("User: ".toString().bold + logged.user)
    console.log("Header: ".toString().bold + JSON.stringify(logged.header))
    console.log("Params: ".toString().bold + JSON.stringify(logged.params))
    console.log("Query: ".toString().bold + JSON.stringify(logged.query))
    console.log("Body: ".toString().bold + JSON.stringify(logged.body))
    console.log("Response: ".toString().bold + JSON.stringify(logged.response))    
    console.log("-----------------------------------------------------------------------".yellow)

     
};
