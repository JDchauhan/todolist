var mongoose = require('mongoose');

var Models = require('../Models');
Lists = mongoose.model('lists');

var Utils = require('../Utils');

module.exports.register = function (req, res, next) {
    try {
        req.body.user = req.user._id
        Lists.create(req.body,
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

module.exports.update = function (req, res, next) {
    try {
        let dataToUpdate = {}
        if (req.body.date) {
            dataToUpdate.date = req.body.date
        }
        if (req.body.title) {
            dataToUpdate.title = req.body.title
        }
        if (req.body.status) {
            dataToUpdate.status = req.body.status
        }

        Lists.findOneAndUpdate({
            _id: req.body._id,
            user: req.user._id
        }, {
            $set: dataToUpdate
        }, {
            new: true,
            lean: true
        }, function (err, todo) {
            if (err) {
                return next(err);
            }

            if(todo){
                return Utils.Responses.successMsg(req, res, todo);
            }

            return Utils.Responses.successMsg(req, res, "No record updated");

        });

    } catch (err) {
        return next(err);
    }
}

module.exports.list = function (req, res, next) {
    try {
        Lists.find({ user: req.user._id },
            function (err, list) {
                if (err) {
                    return next(err);
                }

                if (!list) {
                    let error = new Error()
                    error.code = 404
                    return next(error)
                }

                return Utils.Responses.successMsg(req, res, list);

            });

    } catch (err) {
        return next(err);
    }
}

module.exports.get = function (req, res, next) {
    try {
        Lists.findOne({ 
            user: req.user._id,
            _id: req.params.id 
        },
            function (err, list) {
                if (err) {
                    return next(err);
                }

                if (!list) {
                    let error = new Error()
                    error.code = 404
                    return next(error)
                }

                return Utils.Responses.successMsg(req, res, list);

            });

    } catch (err) {
        return next(err);
    }
}

module.exports.remove = function (req, res, next) {
    try {

        Lists.findOneAndRemove({
            _id: req.params.id,
            user: req.user._id
        }, function (err, todo) {
            if (err) {
                return next(err);
            }

            if(todo){
                return Utils.Responses.successMsg(req, res, todo);
            }

            return Utils.Responses.successMsg(req, res, "No record deleted");
            
        });

    } catch (err) {
        return next(err);
    }
}
