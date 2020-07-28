var router = require("express").Router();
var projectController = require("./projectController");
var permissionMiddleware = require("../auth/permissionMiddleware");


router.post("/", permissionMiddleware.checkAdminPermission, projectController.create);

router.get("/", permissionMiddleware.checkUserPermission, projectController.getAll);

router.post("/configurations", permissionMiddleware.checkAdminPermission, projectController.createConfiguration);

router.get("/configurations", permissionMiddleware.checkUserPermission, projectController.getAllConfigurations);

router.get("/:projectId/deploy", permissionMiddleware.checkAdminPermission, projectController.deploy);

router.get("/:projectId/status", permissionMiddleware.checkUserPermission, projectController.status);

router.get("/:projectId/stop", permissionMiddleware.checkAdminPermission, projectController.stop);

module.exports = router;