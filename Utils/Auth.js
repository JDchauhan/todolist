'use strict';
var jwt = require('jsonwebtoken');
var Config = require('../Config');
var Utils = require('../Utils');

module.exports.verify = (userType, req, res, next) => {
    console.log(userType)

    var token = req.headers.authorization || req.params.token;
    token = token.split(" ")[1]
    console.log(token)
    if (!token) {
        let error = new Error()
        error.code = 403
        next(error)
    }

    jwt.verify(token, Config.App.JWT_SECRET, function (err, decoded) {    
        if (err) {
            let error = new Error()
            error.code = 401
            next(error)
        } else if (!decoded._id || decoded._id.length !== 24) {
            let error = new Error()
            error.code = 401
            next(error)
        } else if (userType.find((value) => {
            return value === decoded.userType
        }) === undefined){
            let error = new Error()
            error.code = 403
            next(error)    
        }
    
        User.findById(decoded._id, {
            password: 0
        }, // projection
        function (err, user) {

            if (err) {
                let error = new Error()
                error.code = 500
                next(error)    
            }

            if (!user) {
                let error = new Error()
                error.code = 401
                next(error)
            }

            req.user = user

            next();
        });
    });
}

module.exports.generate = (id, userType) => {
    var token = jwt.sign({
        _id: id,
        userType: userType,
    }, Config.App.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        })

    console.log(token)
    return token

}