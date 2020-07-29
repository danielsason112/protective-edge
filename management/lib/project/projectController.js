/**
 * Module dependencies.
 * @private
 */
var projectFactory = require("./projectFactory");
var projectService = require("./projectService");
var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;
const {
    exec
} = require('child_process');

/**
 * Module variables.
 * @private
 */
const CLIENT_IMAGE_NAME = require("../../config").clientContainer;
const CORE_IMAGE_NAME = require("../../config").coreContainer;

/**
 * Creates a new Project and configuration and sends a response with the created document.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.create = async (req, res) => {

    let {
        name,
        protocol,
        host,
        port
    } = req.body.project;

    // Create the configuration.
    var configuration = await projectService.createConfiguration(projectFactory.newConfigurationInstace(req.body.configuration))
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage))
        });

    // Create the project.
    var project = await projectService.createProject(projectFactory.newInstance(name, protocol, host, port, configuration._id))
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage))
        });

    res.send(responseMessageFactory.createSuccessful(project));
}

/**
 * Sends a response with all projects.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.getAll = async (req, res) => {
    var projects = await projectService.findAll()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(projects));
}

/**
 * Creates a new configuration and sends a response with the created document.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.createConfiguration = async (req, res) => {
    var configuration = await projectService.createConfiguration(projectFactory.newConfigurationInstace(req.body.configuration))
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage))
        });

    res.send(responseMessageFactory.createSuccessful(configuration));
}

/**
 * Sends a response with all configurations.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.getAllConfigurations = async (req, res) => {
    var configurations = await projectService.findAllConfigurations()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(configurations));
}

/**
 * Deploys client side and core containers and sends a successful response message or unsuccessful on failure.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.deploy = async (req, res) => {
    var project = await projectService.findById(req.params.projectId)
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful("No such project exists"));
        });

    // Pull client-side Docker image from DockerHub.
    await projectService.pullImage(CLIENT_IMAGE_NAME).catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });
    // Pull core Docker image from DockerHub.
    await projectService.pullImage(CORE_IMAGE_NAME).catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });
    // Run the core container.
    await projectService.runContainer(CORE_IMAGE_NAME, project._id + "-core").catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });

    // Create the ENV variables for the client-side container.
    var config = await projectService.findConfigurationById(project.configuration);
    var varsArray = projectService.createVarsArray(project.protocol, project.host, project.port, config);
    var envVars = projectService.getEnvVars(varsArray);

    // Run the client-side container.
    await projectService.runContainer(CLIENT_IMAGE_NAME, project._id, envVars).catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });

    res.send(responseMessageFactory.createSuccessful({}));
}

/**
 * Sends a respons with the project status.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.status = async (req, res) => {
    var project = await projectService.findById(req.params.projectId)
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful("No such project exists"));
        });

    var status = await projectService.getStatus(project)
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful("Error getting project status"));
        });

    res.send(responseMessageFactory.createSuccessful({
        status: status
    }));
}

/**
 * Stops running deployment for a project.
 * 
 * @param {HTTP.IncomingMessage} req Client's request.
 * @param {HTTP.ServerResponse} res Servers's response.
 */
exports.stop = async (req, res) => {
    var project = await projectService.findById(req.params.projectId)
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful("No such project exists"));
        });

    await projectService.stopContainer(req.params.projectId)
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err));
        });;

    res.send(responseMessageFactory.createSuccessful({}));
}