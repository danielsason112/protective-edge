var express = require("express");
var bodyParser = require("body-parser");
var authMiddleware = require("./lib/authMiddleware");
var grpcManagement = require("./lib/grpcManagement");

const PORT = 5000;
const DB_ADDRESS = "mongodb://localhost:27017/management";

var db = require("./lib/db");
db(DB_ADDRESS);

var userRouter = require("./lib/user").Router;
var projectRouter = require("./lib/project").Router;
var messageRouter = require("./lib/message").Router;

var app = express();

grpcManagement.start();

app.set("view engine", "ejs");

app.use("/", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(authMiddleware.requestToken);
app.use(authMiddleware.checkJWTToken);

app.use("/users", userRouter);
app.use("/projects", projectRouter);
app.use("/messages", messageRouter);

app.get("/", (req, res) => {
    if (!req.user) {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/app", (req, res) => {
    res.render("app");
});

app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`);
});