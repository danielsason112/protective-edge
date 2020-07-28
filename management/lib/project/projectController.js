var projectFactory = require("./projectFactory");
var projectService = require("./projectService");
var responseMessageFactory = require("../responseMessage").ResponseMessageFactory;
const {
    exec
} = require('child_process');
const CLIENT_IMAGE_NAME = require("../../config").clientContainer;
const CORE_IMAGE_NAME = require("../../config").coreContainer;

exports.create = async (req, res) => {

    let {
        name,
        protocol,
        host,
        port
    } = req.body.project;

    var configuration = await projectService.createConfiguration(projectFactory.newConfigurationInstace(req.body.configuration))
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage))
        });

    var project = await projectService.createProject(projectFactory.newInstance(name, protocol, host, port, configuration._id))
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage))
        });

    res.send(responseMessageFactory.createSuccessful(project));
}

exports.getAll = async (req, res) => {
    var projects = await projectService.findAll()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(projects));
}

exports.createConfiguration = async (req, res) => {
    var configuration = await projectService.createConfiguration(projectFactory.newConfigurationInstace(req.body.configuration))
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage))
        });

    res.send(responseMessageFactory.createSuccessful(configuration));
}

exports.getAllConfigurations = async (req, res) => {
    var configurations = await projectService.findAllConfigurations()
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful(err.massage));
        });

    res.send(responseMessageFactory.createSuccessful(configurations));
}

exports.deploy = async (req, res) => {
    var project = await projectService.findById(req.params.projectId)
        .catch((err) => {
            return res.send(responseMessageFactory.createUnsuccessful("No such project exists"));
        });

    await projectService.pullImage(CLIENT_IMAGE_NAME).catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });
    await projectService.pullImage(CORE_IMAGE_NAME).catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });
    await projectService.runContainer(CORE_IMAGE_NAME, project._id + "-core").catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });

    var config = await projectService.findConfigurationById(project.configuration);
    var varsArray = projectService.createVarsArray(project.protocol, project.host, project.port, config);
    var envVars = projectService.getEnvVars(varsArray);

    await projectService.runContainer(CLIENT_IMAGE_NAME, project._id, envVars).catch((err) => {
        return res.send(responseMessageFactory.createUnsuccessful(err));
    });

    res.send(responseMessageFactory.createSuccessful({}));
}

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