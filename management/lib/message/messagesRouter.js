var router = require("express").Router();
var messageController = require("./messageController");
var permissionMiddleware = require("../auth/permissionMiddleware");

router.get("/", permissionMiddleware.checkUserPermission, messageController.getAll);

router.get("/count",
    permissionMiddleware.checkUserPermission,
    messageController.unseenCount);

router.get("/:messageId/seen",
    permissionMiddleware.checkUserPermission,
    messageController.seen);

module.exports = router;