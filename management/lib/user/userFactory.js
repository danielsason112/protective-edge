var User = require("./userModel");
var bcrypt = require("bcryptjs");

const SALT_ROUNDS = 8;

exports.newInstace = (email, password, name, role) => {
    return new User({
        email: email,
        password: bcrypt.hashSync(password, SALT_ROUNDS),
        name: name,
        role: role
    });
};