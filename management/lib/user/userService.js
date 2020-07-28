var User = require("./userModel");
var jwt = require("jsonwebtoken");
var config = require("../../config");
var bcrypt = require("bcryptjs");

exports.getUserByEmail = async (email) => {
    return User.findOne({ email: email }).catch((err) => {
        console.log(err);
    });
};

exports.getUserById = async (id) => {
    return User.findOne({ _id: id }).catch((err) => {
        console.log(err);
    });
};

exports.signUser = (id) => {
    return jwt.sign({ id: id }, config.secret, { expiresIn: '1h' });
}

exports.createUser = async (newUser) => {
    return new Promise((resolve, reject) => {
        newUser.save((err, user) => {
            if (!err) {
                resolve(user);
            }
            reject(err);
        });
    });
}