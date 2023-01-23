import client from "../database";

export class DashbordQueries {
    // Get the 5 most popular products
    async most_popular_products(): Promise<{name: string}[]> {
        try {
            const conn = await client.connect()
            const sql = 'SELECT name, COUNT(*) AS num_orders FROM products INNER JOIN order_products ON order_products.product_id = products.id GROUP BY products.id ORDER BY num_orders DESC LIMIT 5'
            const result = await client.query(sql)
            conn.release()

            return result.rows
        } catch (err) {
            throw new Error(`Unable to get products. Error: ${err}`)
        }
    }
}