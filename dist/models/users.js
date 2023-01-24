"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;
class UserStore {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM users";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Can't get users. Error ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM users WHERE id = ($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot get user with id ${id}. Error: ${err}`);
        }
    }
    async create(u) {
        try {
            const conn = await database_1.default.connect();
            const sql = "INSERT INTO users (firstname, lastname, username, password) VALUES($1, $2, $3, $4) RETURNING *";
            const hash = bcrypt_1.default.hashSync(u.password + pepper, Number(saltRounds));
            const sql2 = "SELECT * FROM users WHERE username = ($1)";
            const checked_user = await conn.query(sql2, [u.username]);
            if (checked_user.rows.length == 1) {
                return -1;
            }
            const result = await conn.query(sql, [u.firstname, u.lastname, u.username, hash]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Cannot create user. Error ${err}`);
        }
    }
    async delete(username, password) {
        // DELETE a user from a table and returns 0 if success and -1 if it fails to delete the user
        const conn = await database_1.default.connect();
        const verification = await this.authenticate(username, password);
        if (verification !== -1) {
            const sql = 'DELETE FROM users WHERE username = ($1)';
            const result = await conn.query(sql, [username]);
            conn.release();
            return 0;
        }
        else {
            return -1;
        }
    }
    async authenticate(username, password) {
        const conn = await database_1.default.connect();
        const sql = 'SELECT password FROM users WHERE username=($1)';
        const result = await conn.query(sql, [username]);
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                return user;
            }
        }
        return -1;
    }
}
exports.UserStore = UserStore;
