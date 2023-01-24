"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { POSTGRES_HOST, POSTGRES_DB_DEV, POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_DB_TEST, ENV } = process.env;
let selected_database;
if (ENV === 'dev') {
    selected_database = POSTGRES_DB_DEV;
}
else if (ENV === 'test') {
    selected_database = POSTGRES_DB_TEST;
}
let client = new pg_1.Pool({
    host: POSTGRES_HOST,
    database: selected_database,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
});
exports.default = client;
