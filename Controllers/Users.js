var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Models = require('../Models');
User = mongoose.model('user');

var Utils = require('../Utils');

module.exports.register = function (req, res, next) {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
        User.create(req.body,
            function (err, user) {
                if (err) {
                    return next(err);
                }

                return Utils.Responses.successMsg(req, res, null);
            });

    } catch (err) {
        return next(err);
    }
}

module.exports.login = function (req, res, next) {
    try {
        User.findOne({ email: req.body.email },
            function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    let error = new Error()
                    error.code = 404
                    return next(error)
                }

                var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

                if (!passwordIsValid) {
                    let error = new Error()
                    error.code = 401
                    return next(error)
                } else {
                    let token = Utils.Auth.generate(user._id, "user")

                    let results = {
                        token: token,
                    };
                    return Utils.Responses.successMsg(req, res, results);
                }

            });

    } catch (err) {
        return next(err);
    }
}

module.exports.update = function (req, res, next) {
    try {
        let dataToUpdate = {}
        if (req.body.name) {
            dataToUpdate.name = req.body.name
        }
        if (req.body.password) {
            dataToUpdate.password = bcrypt.hashSync(req.body.password, 8);
        }

        User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: dataToUpdate
        }, {
            new: true,
            lean: true
        }, function (err, user) {
            if (err) {
                return next(err);
            }

            if(user){
                user.password = undefined
                return Utils.Responses.successMsg(req, res, user);
            }

            return Utils.Responses.successMsg(req, res, "No record updated");

        });

    } catch (err) {
        return next(err);
    }
}
