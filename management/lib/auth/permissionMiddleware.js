/**
 * Module dependencies.
 * @private
 */
var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;

/**
 * Middleware that checks that the user exixst and is admin.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 * @param {Function} next next middleware.
 */
exports.checkAdminPermission = (req, res, next) => {
    if (!req.user) {
        return res.send(responseMessageFactory.createUnsuccessful("Unauthorized access."));
    }
    if (!req.user.isAdmin()) {
        return res.send(responseMessageFactory.createUnsuccessful("Unauthorized action. Only admins permited to register new projects."));
    }
    next();
};

/**
 * Middleware that checks that the user exixst.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 * @param {Function} next next middleware.
 */
exports.checkUserPermission = (req, res, next) => {
    if (!req.user) {
        return res.send(responseMessageFactory.createUnsuccessful("Unauthorized access."));
    }
    next();
};