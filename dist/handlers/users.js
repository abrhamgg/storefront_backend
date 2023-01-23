"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const store = new users_1.UserStore();
const index = async (req, res) => {
    const users = await store.index();
    res.json(users);
};
const show = async (req, res) => {
    const id = req.params.id;
    const user = await store.show(id);
    res.json(user);
};
const create = async (req, res) => {
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password
    };
    try {
        const new_user = await store.create(user);
        if (new_user == -1) {
            res.status(200);
            res.json({ "message": "User Exists. Please use a different username" });
        }
        else {
            var token = jsonwebtoken_1.default.sign({ user: new_user }, String(process.env.TOKEN_SECRET));
            res.json(token);
        }
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const authenticate = async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    try {
        const u = await store.authenticate(user.username, user.password);
        if (u !== -1) {
            var token = jsonwebtoken_1.default.sign({ user: u }, String(process.env.TOKEN_SECRET));
            res.json(token);
        }
        else {
            res.status(401);
            res.json({ "message": "Authentication failed" });
        }
    }
    catch (err) {
        res.status(401);
        res.json({ err });
    }
};
const delete_user = async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    const result = await store.delete(user.username, user.password);
    if (result === 0) {
        res.status(200);
        res.json({ "message": "user deleted" });
    }
    else {
        res.status(400);
        res.json({ "message": "Can't delete the user" });
    }
};
const user_routes = (app) => {
    app.post('/users', create);
    app.get('/login', authenticate);
    app.get('/users', auth_1.default, index);
    app.get('/users/:id', auth_1.default, show);
    app.delete('/users', delete_user);
};
exports.default = user_routes;
