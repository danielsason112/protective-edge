var jwt = require("jsonwebtoken");
var userService = require('./user').Service;
var config = require("../config");
var responseMessageFactory = require("./responseMessage").ResponseMessageFactory;

exports.requestToken = (req, res, next) => {
    req.token = null;
    let authHeader = req.headers.authorization
    if (authHeader) { // Authorization header provided.
        req.token = authHeader.startsWith("Barier ") ? authHeader.substring(7) : authHeader;
        //console.log(req.token);
    }
    next();
}

exports.checkJWTToken = async (req, res, next) => {
    req.user = null;
    if (req.token) {
        let decoded = await verifyToken(req.token).catch((err) => {
            console.log(err);
        });
        if (decoded) {
            req.user = await userService.getUserById(decoded.id);
        }

    }
    next();
}

async function verifyToken(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error("No token provided"));
        }
        jwt.verify(token, config.secret, async (err, decoded) => {
            if (!err) {
                resolve(decoded);
            } else {
                reject(err);
            }
        });
    });
}