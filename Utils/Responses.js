'use strict';

const Logger = require('./Logger')

module.exports.errorMsg = function (req, res, statusCode, statusMessage, message, errors, err= undefined) {
    res.statusCode = statusCode;
    res.statusMessage = statusMessage;
    res.send({
        "status": statusCode,
        "message": message,
        "results": null,
        "errors": errors
    });
    Logger.log(true, req, {
        "status": statusCode,
        "message": message,
        "results": null,
        "errors": err !== undefined ? err : errors
    })
};

module.exports.successMsg = function (req, res, results) {
    res.statusCode = 200;
    res.statusMessage = "OK";
    // res.set("authorization", req.user.token)
    res.send({
        "status": 200,
        "message": "OK",
        "results": results,
        "errors": null
    });
    Logger.log(false, req, {
        "status": 200,
        "message": "OK",
        "results": results,
        "errors": null
    })
}