var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;

exports.checkAdminPermission = (req, res, next) => {
    if (!req.user) {
        return res.send(responseMessageFactory.createUnsuccessful("Unauthorized access."));
    }
    if (!req.user.isAdmin()) {
        return res.send(responseMessageFactory.createUnsuccessful("Unauthorized action. Only admins permited to register new projects."));
    }
    next();
};

exports.checkUserPermission = (req, res, next) => {
    if (!req.user) {
        return res.send(responseMessageFactory.createUnsuccessful("Unauthorized access."));
    }
    next();
};