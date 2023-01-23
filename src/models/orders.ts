import client from "../database";

export type Order = {
    id?: number,
    status: string,
    user_id: string
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Cannot get orders. Error: ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const conn = await client.connect()
            const result = await conn.query(sql, [o.user_id, 'active']);
            conn.release
            return result.rows[0]
        } catch (err) {
            throw new Error(`Cannot create orders. Error: ${err}`)
        }
    }
    async show_current_orders(user_id: string): Promise<Order[]> {
        try {
            const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'"
            const conn = await client.connect()
            const result = await conn.query(sql, [user_id])
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Cannot get orders by user_id: ${user_id}. Error: ${err}`)
        }
    }

    async show_completed_orders(user_id: string): Promise<Order[]> {
        try {
            const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='completed'"
            const conn = await client.connect()
            const result = await conn.query(sql, [user_id])
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Cannot get orders by user_id: ${user_id}. Error: ${err}`)
        }
    }

    async addProduct(quantity: number, order_id: string, product_id: string): Promise<Order> {
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const conn = await client.connect()
            const result = await conn.query(sql, [quantity, order_id, product_id])
            const sql1 = "UPDATE orders SET status='completed' WHERE id = ($1)";
            conn.query(sql1, [order_id])
            console.log("has been completed");
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not add product ${product_id}`)
        }
        
    }
}