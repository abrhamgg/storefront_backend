import { Order, OrderStore } from "../models/orders";
import supertest from "supertest";
import { UserStore } from "../models/users";
import jwt from 'jsonwebtoken'
import app from "../server";

const order = new OrderStore()
const store = new UserStore()
const request = supertest(app)
const secret = process.env.TOKEN_SECRET;


describe('Testing the OrderStore model', () => {
    it ('Should have a create method', () => {
        expect(order.create).toBeDefined();
    })
    it ('Should have an index method', () => {
        expect(order.index).toBeDefined()
    })
    it ('should have  a show_completed_orders method', () => {
        expect(order.show_completed_orders).toBeDefined()
    })
    it ('should have  a show_current_orders method', () => {
        expect(order.show_current_orders).toBeDefined()
    })
    it ('should have an addProduct method', () => {
        expect(order.addProduct).toBeDefined()
    })
})

describe('Testing the OrderStore model methods', () => {

    it ('fetch orders and show current orders', async () => {
        const test_user = {
            firstname: "tom",
            lastname: "hank",
            username: "walter_white",
            password: "test_user_password"
        }
        const response = await request.post("/users").send(test_user)
        const token = response.body
        const decoded = jwt.verify(token, String(secret))
        const user_id = Object(decoded).user.id
        const o = {
            user_id: user_id,
            status: "active"
        }
        await order.create(o)
        const orders = await order.index()
        expect(orders.length).toBeGreaterThanOrEqual(1)

        // Testing show_current_orders

        const current_orders = await order.show_current_orders(user_id)
        expect(current_orders.length).toBeGreaterThanOrEqual(1)
        
        await order.delete(String(user_id))
        await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        })
    });    
})

describe ('Testing orders endpoints', () => {

    it ('GET /orders without passing a token', async () => {
        const res = await request.get('/orders')
        expect(res.status).toBe(400)
    })
    it ('POST /orders without passing a token', async () => {
        const o = {
            user_id: 777,
            status: "completed"
        }
        const temp_token = jwt.sign({o}, String(process.env.TOKEN_SECRET))
        const res = await request.post('/orders').send(o)
        expect(res.status).toBe(400)
    })
    
    it ('GET /orders',async () => {
        const o = {
            user_id: 777,
            status: 'completed'
        }
        const temp_token = jwt.sign({o}, String(process.env.TOKEN_SECRET))
        const response = await request.get('/orders').set('authorization', `Bearer ${temp_token}`)
        expect(response.status).toBe(200)
    })

})