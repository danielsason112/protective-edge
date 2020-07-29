/**
 * Module dependencies.
 * @private
 */
var router = require("express").Router();
var projectController = require("./projectController");
var permissionMiddleware = require("../auth/permissionMiddleware");

/**
 * POST "/projects"
 * {
 *  name: String,
 *  porotocol: String,
 *  host: String,
 *  port: Number,
 *  configuration: {
 *      name: String,
 *      clientProtocol: String,
 *      clientHost: String,
 *      clientPort: Number,
 *      coreProtocol: String,
 *      coreHost: String,
 *      corePort: String,
 *      blockingMode: String
 *  }
 * }
 */
router.post("/", permissionMiddleware.checkAdminPermission, projectController.create);

// GET "/projects"
router.get("/", permissionMiddleware.checkUserPermission, projectController.getAll);

/**
 * POST "/projects/configurations"
 * {
 *   name: String,
 *   clientProtocol: String,
 *   clientHost: String,
 *   clientPort: Number,
 *   coreProtocol: String,
 *   coreHost: String,
 *   corePort: String,
 *   blockingMode: String
 *  }
 */
router.post("/configurations", permissionMiddleware.checkAdminPermission, projectController.createConfiguration);


// GET "/projects/configurations"
router.get("/configurations", permissionMiddleware.checkUserPermission, projectController.getAllConfigurations);

// GET "/projects/:projectId/deploy"
router.get("/:projectId/deploy", permissionMiddleware.checkAdminPermission, projectController.deploy);

// GET "/projects/:projectId/status"
router.get("/:projectId/status", permissionMiddleware.checkUserPermission, projectController.status);

// GET "/projects/:projectId/stop"
router.get("/:projectId/stop", permissionMiddleware.checkAdminPermission, projectController.stop);

module.exports = router;