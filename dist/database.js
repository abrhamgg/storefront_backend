"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1["default"].config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_DB_DEV = _a.POSTGRES_DB_DEV, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_DB_TEST = _a.POSTGRES_DB_TEST, ENV = _a.ENV;
var selected_database;
if (ENV === 'dev') {
    selected_database = POSTGRES_DB_DEV;
}
else if (ENV === 'test') {
    selected_database = POSTGRES_DB_TEST;
}
var client = new pg_1.Pool({
    host: POSTGRES_HOST,
    database: selected_database,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
});
exports["default"] = client;
