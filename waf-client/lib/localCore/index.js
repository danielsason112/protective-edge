var schedule = require('node-schedule');
var grpcClient = require("../grpcClient");
var coreRepo = require("./coreRepo");
var config = require("../../config");
const {
    stdout
} = require('process');
const {
    resolve
} = require('path');
var exec = require("child_process").exec;

const FAILED_ATTEMPTS_LIMIT = config.failedAttemptsLimit || 10;
const CRON_EXP = config.coreCronExp || '* * * * * *'; // By config or every second.

class localCore {

    constructor() {
        this.job = null;
        this.failedAttemptsCounter = 0;
        this.coreRepo = coreRepo;
    }

    incrCounter() {
        this.failedAttemptsCounter++;
    }

    init() {
        this.job = schedule.scheduleJob(CRON_EXP, function () {
            grpcClient.ping({}, (err, response) => {
                if (err) {
                    this.localCore.incrCounter();
                    console.log(`LocalCore: Failed ping attempt #${this.localCore.failedAttemptsCounter}`);
                    if (this.localCore.failedAttemptsCounter == FAILED_ATTEMPTS_LIMIT) {
                        this.localCore.onConnectionLoss();
                    }
                }
            });
        });
        this.job.localCore = this;
    }

    async onConnectionLoss() {
        this.job.cancel();

        console.log(`LocalCore: Reached limit of failed ping attempts to remote core, initiating local core.`);
        await this.coreRepo.pull(config.coreRepo, config.localCorePath)
            .catch((err) => {
                console.log(err);
                return;
            });
        console.log("LocalCore: Pulled latest core repo. installing packages...");

        var stdout = await this.installPackages().catch((err) => {
            console.log(err);
            return;
        });
        console.log(stdout);
        console.log("LocalCore: Packages installed. starting server...");

        stdout = await this.run().catch((err) => {
            console.log(err);
            return;
        });
        console.log(stdout);
        console.log("LocalCore: Local server is running.");
    }

    run() {
        return new Promise((resolve, reject) => {
            exec(`node ./${config.localCorePath}/index.js`, (err, stdout) => {
                err ? reject(err) : resolve(stdout);
            });
        });
    }

    installPackages() {
        return new Promise((resolve, reject) => {
            exec(`npm install --prefix ./${config.localCorePath}`, (err, stdout) => {
                err ? reject(err) : resolve(stdout);
            });
        });
    }

}

class Singleton {

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new localCore();
        }
    }

    getInstance() {
        return Singleton.instance;
    }

}

module.exports = Singleton;