var newProject = document.getElementById("new-project");
var welcome = document.getElementById("welcome");
var projectTab = document.getElementById("project");
var projectFailed = document.getElementById("project-failed");
var messagesTab = document.getElementById("messages");


var user = null;
var projects = null;
var messages = null;
var currentTab = welcome;

const PROJECT_STATUS = ["Waiting", "Active", "Error"];
const PROJECT_STATUS_ICON = ['<i class="fa fa-pause" aria-hidden="true" aria-hidden="true"></i>',
    '<i class="fa fa-check" aria-hidden="true"></i>', ''
];
const MESSAGE_SEEN = `<i class="fas fa-envelope-open"></i>`;
const MESSAGE_NOT_SEEN = `<i class="fas fa-envelope"></i>`;

document.getElementById("new-project-button").addEventListener("click", (event) => {
    if (user.role == 1) {
        newProject.innerHTML = `<p>This action requires admin permissions.</p>`;
    }
    switchTab(newProject);
});

$.ajax({
    url: "/messages/count",
    type: "GET",
    accepts: "application/json",
    beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem(
            "token"))
    },
    success: handleMessagesCountRes
});

setInterval(() => {
    $.ajax({
        url: "/messages/count",
        type: "GET",
        accepts: "application/json",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem(
                "token"))
        },
        success: handleMessagesCountRes
    });
}, 1000);



function handleMessagesCountRes(res) {
    document.getElementById("header-menu-msg-count").innerHTML = res.data;
    document.getElementById("aside-menu-msg-count").innerHTML = res.data;
}

document.getElementById("projects-link").addEventListener("click", (event) => {
    switchTab(welcome);
    $.ajax({
        url: "/projects",
        type: "GET",
        accepts: "application/json",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem(
                "token"))
        },
        success: handleProjectRes
    });
});

document.getElementById("messages-link").addEventListener("click", messagesOnClick);
document.getElementById("message-aside-link").addEventListener("click", messagesOnClick);

function messagesOnClick(event) {
    switchTab(messagesTab);
    $.ajax({
        url: "/messages",
        type: "GET",
        accepts: "application/json",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem(
                "token"))
        },
        success: handleMessagesRes
    });
}

$.ajax({
    type: "GET",
    url: "/users",
    beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token"))
    },
    success: handleUsersRes
});

function handleProjectRes(res) {
    console.log(res);
    if (res.success) {
        projects = res.data
        var list = document.getElementById("projects-list");
        list.innerHTML = "";
        projects.forEach(project => {
            var li = document.createElement("li");
            li.innerHTML = getProjectLiHtml(project);
            list.appendChild(li);
            li.addEventListener("click", (event) => {
                populateProject(project)
            });
        });
    }
}

function handleMessagesRes(res) {
    console.log(res);
    if (res.success) {
        messages = res.data
        var list = document.getElementById("messages-list");
        list.innerHTML = "";
        messages.forEach(message => {
            var li = document.createElement("li");
            var div = document.createElement("div");
            div.isOpen = false;
            div.style.maxWidth = "500px";
            li.innerHTML = getMessageLiHtml(message);
            list.appendChild(li);
            list.appendChild(div);
            li.addEventListener("click", (event) => {
                populateMessage(message, div);
                if (!message.isSeen) {
                    li.children[0].children[1].innerHTML = "seen" + MESSAGE_SEEN;
                    $.ajax({
                        type: "GET",
                        url: "/messages/" + message._id + "/seen",
                        beforeSend: (xhr) => {
                            xhr.setRequestHeader("Authorization", "Barier " + window
                                .localStorage.getItem("token"))
                        },
                        success: (res) => {
                            console.log(res);
                            if (res.data.ok) {
                                message.isSeen = true;
                            }
                        }
                    });
                }
            });
        });
    }
}

function populateMessage(message, div) {
    if (message.type == "MaliciousRequestMessage" && !div.isOpen) {
        var projectName = "";
        projects.forEach((project) => {
            projectName = project._id == message.project ? project.name : projectName;
        });
        div.innerHTML = `<p>A new malicious request was found in project ${projectName}.</p>
            <p>The request was identified in ${new Date(message.timestamp)}, as a ${message.attackType} attack.</p>`;
        div.isOpen = true;
    } else {
        div.innerHTML = "";
        div.isOpen = false;
    }
}

function getProjectLiHtml(project) {
    return `    <a href="#43">
                    <p class="next-days-date"><span class="day">${project.name}</span> <span
                            class="scnd-font-color">${project.createdAt.substring(8, 10)}/${project.createdAt.substring(5, 7)}</span></p>
                    <p class="next-days-temperature">${PROJECT_STATUS[project.status]} ${PROJECT_STATUS_ICON[project.status]}
                    </p>
                </a>`
}

function getMessageLiHtml(message) {
    return `    <a href="#43">
                    <p class="next-days-date"><span class="day">${message.topic}</span> <span
                            class="scnd-font-color">${message.createdAt.substring(8, 10)}/${message.createdAt.substring(5, 7)}</span></p>
                    <p class="next-days-temperature">${message.isSeen ? "seen" + MESSAGE_SEEN : "not seen" + MESSAGE_NOT_SEEN}
                    </p>
                </a>`
}

function populateProject(project) {

    projectTab.innerHTML = `
                    <h2 class="titular">${project.name}</h2>
                    <div class="tweet">
                        <p><span class="scnd-font-color">location: </span>${project.protocol}//${project.host}:${project.port}</p>
                    </div>
                    <div class="tweet">
                        <p><span class="scnd-font-color">created: </span>${project.createdAt.substring(0, 10)}</p>
                    </div>
                    <div class="tweet">
                        <p><span class="scnd-font-color">status: </span>${PROJECT_STATUS[project.status]}</p>
                    </div>
                    <div id="deploy-loader" class="cs-loader">
                    <div class="cs-loader-inner">
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                    </div>
                    </div>`;

    if (project.status == 0 && user.role == 0) {
        projectTab.innerHTML +=
            '<a id="deploy-button" style="margin-top: 50px;" class="add-event button" href="#27">Deploy</a>';
        document.getElementById("deploy-button").addEventListener("click", (event) => {
            $.ajax({
                url: "/projects/" + project._id + "/deploy",
                type: "GET",
                beforeSend: (xhr) => {
                    xhr.setRequestHeader("Authorization", "Barier " + window.localStorage
                        .getItem(
                            "token"))
                },
                success: (res) => {
                    console.log(res);
                    $.ajax({
                        url: "/projects/" + project._id + "/status",
                        type: "GET",
                        beforeSend: (xhr) => {
                            xhr.setRequestHeader("Authorization", "Barier " + window
                                .localStorage
                                .getItem(
                                    "token"))
                        },
                        success: (res) => {
                            if (res.success) {
                                console.log(res);
                                if (res.data.status != project.status) {
                                    project.status = res.data.status;
                                    populateProject(project);
                                }
                            }
                        }
                    });
                }
            });
            document.getElementById("deploy-button").style.display = "none";
            document.getElementById("deploy-loader").style.visibility = "visible";
        });
    }

    if (project.status == 1 && user.role == 0) {
        projectTab.innerHTML += `<a id="kill-button" class="sign-in button">KILL</a>`;
        document.getElementById("kill-button").addEventListener("click", (event) => {
            $.ajax({
                url: "/projects/" + project._id + "/stop",
                type: "GET",
                beforeSend: (xhr) => {
                    xhr.setRequestHeader("Authorization", "Barier " + window.localStorage
                        .getItem(
                            "token"))
                },
                success: (res) => {
                    console.log(res);
                    $.ajax({
                        url: "/projects/" + project._id + "/status",
                        type: "GET",
                        beforeSend: (xhr) => {
                            xhr.setRequestHeader("Authorization", "Barier " + window
                                .localStorage
                                .getItem(
                                    "token"))
                        },
                        success: (res) => {
                            if (res.success) {
                                console.log(res);
                                if (res.data.status != project.status) {
                                    project.status = res.data.status;
                                    populateProject(project);
                                }
                            }
                        }
                    });
                }
            });
            document.getElementById("kill-button").style.display = "none";
            document.getElementById("deploy-loader").style.visibility = "visible";
        });
    }

    switchTab(projectTab);
}

function switchTab(tab) {
    if (currentTab != tab) {
        if (currentTab != null) {
            currentTab.style.display = "none";
        }
        tab.style.display = "block";
        currentTab = tab;
    }
}

function handleUsersRes(res) {
    console.log(res);
    if (res.success) {
        user = res.data.user;
        document.querySelector(".loader").style.display = "none";
        document.getElementById("user-name").innerHTML = res.data.user.name;
    } else {
        window.location.href = "/login";
    }
}

function submitform() {
    var object = {};
    object.configuration = {};
    object.project = {};
    var formData = $("#new-project-form").serializeArray();
    formData.forEach(function (entry) {
        if (entry.name.startsWith("configuration")) {
            object.configuration[entry.name.substring(14, entry.name.length - 1)] = entry.value;
        } else {
            object.project[entry.name] = entry.value;
        }
    });
    object.configuration.blockingMode = object.configuration.blockingMode == "true"
    formData = JSON.stringify(object);
    console.log(object);
    $.ajax({
        type: "POST",
        url: "/projects",
        data: formData,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token"))
        },
        success: (res) => {
            console.log(res)
            if (res.success) {
                switchTab(projectTab);
            } else {
                switchTab(projectFailed);
            }
        },
        dataType: "json",
        contentType: "application/json",
    });
}

// Get projects

$.ajax({
    url: "/projects",
    type: "GET",
    accepts: "application/json",
    beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token"))
    },
    success: handleProjectRes
});

// Create new user

// $.ajax({
//     type: "POST",
//     url: "/users/register",
//     contentType: "application/json",
//     accepts: "application/json",
//     data: JSON.stringify({
//         email: "user@gmail.com",
//         name: "user1",
//         password: "password",
//         role: 1
//     }),
//     beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token")) },
//     success: (res) => {
//         console.log(res);
//     }
// });

// Create project.

// $.ajax({
//     type: "POST",
//     url: "/projects",
//     contentType: "application/json",
//     accepts: "application/json",
//     data: JSON.stringify({
//         project: {
//             name: "WebGoat",
//             protocol: "http:",
//             host: "localhost",
//             port: 8080
//         },
//         configuration: {
//             name: "default",
//             clientProtocol: "http:",
//             clientHost: "localhost",
//             clientPort: 8081,
//             coreProtocol: "http:",
//             coreHost: "localhost",
//             corePort: 8080,
//             blockingMode: true
//         }
//     }),
//     beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token")) },
//     success: (res) => {
//         console.log(res);
//     }
// });



// Get configurations

// $.ajax({
//     url: "/projects/configurations",
//     type: "GET",
//     accepts: "application/json",
//     beforeSend: (xhr) => {
//         xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token"))
//     },
//     success: (res) => {
//         console.log(res);
//     },
//     success: (res) => {
//         console.log(res);
//     }
// });

// Create configuration

// $.ajax({
//     type: "POST",
//     url: "/projects/configurations",
//     contentType: "application/json",
//     accepts: "application/json",
//     data: JSON.stringify({
//         configuration: {
//             name: "default",
//             clientProtocol: "http:",
//             clientHost: "localhost",
//             clientPort: 8081,
//             coreProtocol: "http:",
//             coreHost: "localhost",
//             corePort: 8080,
//             blockingMode: true
//         }
//     }),
//     beforeSend: (xhr) => { xhr.setRequestHeader("Authorization", "Barier " + window.localStorage.getItem("token")) },
//     success: (res) => {
//         console.log(res);
//     }
// });