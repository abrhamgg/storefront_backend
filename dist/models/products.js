"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async index() {
        /* returns all products*/
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    async show(id) {
        /* returns a product with a specific id */
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products WHERE id =($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find a product with id ${id}. Error: ${err}`);
        }
    }
    async create(p) {
        try {
            if (p.category) {
                const sql = "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";
                const conn = await database_1.default.connect();
                const result = await conn.query(sql, [p.name, p.price, p.category]);
                conn.release();
                return result.rows[0];
            }
            const sql = "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [p.name, p.price]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot create a product ${err}`);
        }
    }
    async getProductsByCategory(category) {
        try {
            const sql = "SELECT * FROM products WHERE category=($1)";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
            return result.rows;
        }
        catch (err) {
            throw new Error(`Cannot get products with category ${category}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
