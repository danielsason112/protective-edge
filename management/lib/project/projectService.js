/**
 * Module dependencies.
 * @private
 */
var Project = require("./projectModel");
var Configuration = require("./configurationModel");
const {
    exec
} = require('child_process');

/**
 * Creates a new project in the db.
 * 
 * @param {mongoose.Model} newProject A new project.
 * @returns {Promise} Resolves when the project is saved or rejects on error.
 */
exports.createProject = async (newProject) => {
    return new Promise((resolve, reject) => {
        newProject.save((err, project) => {
            if (!err) {
                resolve(project);
            }
            reject(err);
        });
    });
}

/**
 * Creates a new configuration in the db.
 * 
 * @param {mongoose.Model} newConfiguration A new configuration.
 * @returns {Promise} Resolves when the configuration is saved or rejects on error.
 */
exports.createConfiguration = async (newConfiguration) => {
    return new Promise((resolve, reject) => {
        newConfiguration.save((err, config) => {
            if (!err) {
                resolve(config);
            }
            reject(err);
        });
    });
}

/**
 * finds all projects in the db.
 * 
 * @returns {Promise} Resolves when all documents are retreived or rejects on error.
 */
exports.findAll = () => {
    return new Promise((resolve, reject) => {
        Project.find({}, (err, projects) => {
            if (!err) {
                projects.forEach(async (project) => {
                    project.status = await this.getStatus(project);
                    await project.save();
                });
                resolve(projects);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * Finds a project by id.
 * 
 * @param {String} id A project id.
 * @returns {Promise} Resolves when the project is retreived or rejects on error.
 */
exports.findById = (id) => {
    return new Promise((resolve, reject) => {
        Project.findOne({
            _id: id
        }, async (err, project) => {
            if (!err) {
                project.status = await this.getStatus(project);
                await project.save();
                resolve(project);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * finds all configurations in the db.
 * 
 * @returns {Promise} Resolves when all documents are retreived or rejects on error.
 */
exports.findAllConfigurations = () => {
    return new Promise((resolve, reject) => {
        Configuration.find({}, (err, configs) => {
            err ? reject(err) : resolve(configs);
        });
    });
}

/**
 * Finds a configuration by id.
 * 
 * @param {String} id A project id.
 * @returns {Promise} Resolves when the configuration is retreived or rejects on error.
 */
exports.findConfigurationById = (id) => {
    return new Promise((resolve, reject) => {
        Configuration.findOne({
            _id: id
        }, (err, config) => {
            err ? reject(err) : resolve(config);
        });
    });
}

/**
 * Pulls a Docker image from dockerhub.
 * 
 * @param {String} imageName DockerHub image name full path: username/image_name:tag.
 * @returns {Promise} Resolves when the image is pulled or rejects on error.
 */
exports.pullImage = async (imageName) => {
    return new Promise((resolve, reject) => {
        exec(`sudo docker pull ${imageName}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                console.log(stdout);
                resolve();
            }
        });
    });
}

/**
 * Runs a Docker Container from image.
 * 
 * @param {String} imageName DockerHub image name full path: username/image_name:tag.
 * @param {String} name The container's name.
 * @param {Array} envVars An Array of enviroment variables for the container.
 * @returns {Promise} Resolves when the container is running or rejects on error.
 */
exports.runContainer = async (imageName, name, envVars) => {
    if (!envVars) {
        envVars = "";
    }

    return new Promise((resolve, reject) => {
        exec(`sudo docker run -d --rm --name ${name} ${envVars}--network host ${imageName}`,
            (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(stdout);
                    resolve();
                }
            });
    });
}

/**
 * Checks if a container is running.
 * 
 * @param {mongoose.Model} project An existing project.
 * @returns {Promise} Resolves when the container's status is found or rejects on error.
 */
exports.getStatus = (project) => {
    return new Promise((resolve, reject) => {
        exec(`sudo docker container inspect -f '{{.State.Running}}' ${project._id}`, (err, stdout, stderr) => {
            if (err || !stdout) {
                console.log(err);
                resolve(Project.schema.statics.status.WAITING);
            } else {
                resolve(Project.schema.statics.status.ACTIVE);
            }
        });
    });
}

/**
 * Stops a running container.
 * 
 * @param {String} projectId An existing project id.
 * @returns {Promise} Resolves when the container stops running or rejects on error.
 */
exports.stopContainer = (projectId) => {
    return new Promise((resolve, reject) => {
        exec(`sudo docker kill ${projectId} ${projectId}-core`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * Create an enviroment variables for running a client-side container.
 * 
 * @param {String} protocol "http:" or "https:".
 * @param {String} host Project host.
 * @param {Number} port  Project port.
 * @param {mongoose.Model} config Project configuration.
 * @returns {Array} An array of enviroment variables
 */
exports.createVarsArray = (protocol, host, port, config) => {
    var arr = [];
    arr.push(`TARGET_HOST='${host}'`);
    arr.push(`TARGET_PORT=${port}`);
    arr.push(`TARGET_PROTOCOL='${protocol}'`);
    arr.push(`CLIENT_HOST='${config.clientHost}'`);
    arr.push(`CLIENT_PORT=${config.clientPort}`);
    arr.push(`BLOCKING_MODE=${config.blockingMode}`);
    arr.push(`WAF_HOST='${config.coreHost}'`);
    arr.push(`WAF_PORT='${config.corePort}'`);

    return arr;
}

/**
 * Returns the enviroment variables array as a string with the "-e" flag before each.
 * 
 * @param {Array} varsArray An enviroment variables array.
 * @returns {String} enviroment variables string.
 */
exports.getEnvVars = (varsArray) => {
    var res = "";
    if (varsArray) {
        varsArray.forEach((i) => {
            res += `-e ${i} `;
        })
    }

    return res;
}