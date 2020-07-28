var router = require("express").Router();
var userController = require("./userController");
var permissionMiddleware = require("../auth/permissionMiddleware");

router.post("/login", userController.login);

router.get("/", permissionMiddleware.checkUserPermission, userController.user);

router.post("/register", permissionMiddleware.checkAdminPermission, userController.register);

router.get("/logout", userController.logout);

module.exports = router;