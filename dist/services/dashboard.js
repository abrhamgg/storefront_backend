"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashbordQueries = void 0;
const database_1 = __importDefault(require("../database"));
class DashbordQueries {
    // Get the 5 most popular products
    async most_popular_products() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT name, COUNT(*) AS num_orders FROM products INNER JOIN order_products ON order_products.product_id = products.id GROUP BY products.id ORDER BY num_orders DESC LIMIT 5';
            const result = await database_1.default.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Unable to get products. Error: ${err}`);
        }
    }
}
exports.DashbordQueries = DashbordQueries;
