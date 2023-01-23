// @ts-ignore
import { Connection } from "pg";
import client from "../database";

export type Product = {
    id?: number,
    name: string,
    price: number,
    category?: string
}

export class ProductStore {
    async index(): Promise<Product[]> {
        /* returns all products*/
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`)
        }
    }

    async show(id: string): Promise<Product> {
        /* returns a product with a specific id */
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id =($1)';
            const result = await conn.query(sql, [id])
            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find a product with id ${id}. Error: ${err}`)
        }
    }

    async create(p: Product): Promise<Product> {
        try {
            if (p.category){
                const sql = "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *"
                const conn = await client.connect()
                const result = await conn.query(sql, [p.name, p.price, p.category])
                conn.release()
                
                return result.rows[0]
            }
            const sql = "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *"
            const conn = await client.connect()
            const result = await conn.query(sql, [p.name, p.price])
            conn.release()
            
            return result.rows[0]
            

        } catch (err) {
            throw new Error(`Cannot create a product ${err}`)
        }
    
    }

    async getProductsByCategory(category: string): Promise<Product[] | null> {
        try {
            const sql = "SELECT * FROM products WHERE category=($1)"
            const conn = await client.connect()
            const result = await conn.query(sql, [category])
            conn.release()

            return result.rows
            

            return result.rows
        } catch (err) {
            throw new Error(`Cannot get products with category ${category}. Error: ${err}`)
        }
    }
}