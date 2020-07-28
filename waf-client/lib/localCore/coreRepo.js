var download = require("download-git-repo");

exports.pull = (repo, path) => {
    return new Promise((resolve, reject) => {
        download(repo, path, (err) => {
            err ? reject(err) : resolve();
        });
    });
};