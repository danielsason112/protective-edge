var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Project = require("../project").Project;
var Configuration = require("../project").Configuration;

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    password: String,
    role: Number
});

userSchema.statics.roles = {
    ADMIN: 0,
    VIEWER: 1,
};

userSchema.methods.isAdmin = function () {
    return this.role === userSchema.statics.roles.ADMIN;
}

userSchema.methods.compare = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.toReflectedObject = function () {
    var reflected = this.toObject();
    delete reflected.password
    delete reflected._id

    return reflected;
}

module.exports = mongoose.model("User", userSchema);