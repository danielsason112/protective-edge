var userService = require("./userService");
var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;
var userFactory = require("./userFactory");

exports.login = async (req, res) => {
    req.user = await userService.getUserByEmail(req.body.email);

    if (req.user) {
        var result = await req.user.compare(req.body.password)
        if (result) {
            req.token = userService.signUser(req.user.id);

            return res.send(responseMessageFactory.createSuccessful({
                token: req.token,
                redirect: "/app"
            }));
        }
    }
    res.send(responseMessageFactory.createUnsuccessful("No such user."));
};

exports.user = (req, res) => {
    res.send(responseMessageFactory.createSuccessful({
        user: req.user.toReflectedObject()
    }));
};

exports.register = async (req, res) => {
    let newUser = userFactory.newInstace(req.body.email, req.body.password, req.body.name, req.body.role);

    await userService.createUser(newUser)
        .then((newUser) => {
            res.send(responseMessageFactory.createSuccessful({ user: newUser.toReflectedObject() }));
        })
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.toString()));
        });
}

exports.logout = (req, res) => {
    res.render("logout");
}