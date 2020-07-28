var Project = require("./projectModel");
var Configuration = require("./configurationModel");
const {
    exec
} = require('child_process');

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

exports.findAllConfigurations = () => {
    return new Promise((resolve, reject) => {
        Configuration.find({}, (err, configs) => {
            err ? reject(err) : resolve(configs);
        });
    });
}

exports.findConfigurationById = (id) => {
    return new Promise((resolve, reject) => {
        Configuration.findOne({
            _id: id
        }, (err, config) => {
            err ? reject(err) : resolve(config);
        });
    });
}

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

exports.getEnvVars = (varsArray) => {
    var res = "";
    if (varsArray) {
        varsArray.forEach((i) => {
            res += `-e ${i} `;
        })
    }

    return res;
}