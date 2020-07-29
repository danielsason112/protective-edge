/**
 * Module dependencies.
 * @private
 */
var router = require("express").Router();
var messageController = require("./messageController");
var permissionMiddleware = require("../auth/permissionMiddleware");

// GET "/messages"
router.get("/", permissionMiddleware.checkUserPermission, messageController.getAll);

// GET "/messages/count"
router.get("/count",
    permissionMiddleware.checkUserPermission,
    messageController.unseenCount);

// GET "/messages/:messageId/seen"
router.get("/:messageId/seen",
    permissionMiddleware.checkUserPermission,
    messageController.seen);

module.exports = router;