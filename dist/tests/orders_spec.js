"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const supertest_1 = __importDefault(require("supertest"));
const users_1 = require("../models/users");
const server_1 = __importDefault(require("../server"));
const order = new orders_1.OrderStore();
const store = new users_1.UserStore();
const request = (0, supertest_1.default)(server_1.default);
describe('Testing the OrderStore model', () => {
    it('Should have a create method', () => {
        expect(order.create).toBeDefined();
    });
    it('Should have an index method', () => {
        expect(order.index).toBeDefined();
    });
    it('should have  a show_completed_orders method', () => {
        expect(order.show_completed_orders).toBeDefined();
    });
    it('should have  a show_current_orders method', () => {
        expect(order.show_current_orders).toBeDefined();
    });
    it('should have an addProduct method', () => {
        expect(order.addProduct).toBeDefined();
    });
});
describe('Testing orders endpoints', () => {
    it('GET /orders without passing a token', async () => {
        const res = await request.get('/orders');
        expect(res.status).toBe(400);
    });
    /*
    it ('/GET orders', async () => {
        const test_user = {
            firstname: "tom",
            lastname: "riddle",
            username: "voldemort",
            password: "crucio"
        }
        const res = await request.post('/users').send(test_user)

        // Get jwt Token
        const token = res.body
        const res2 = await request.get('/orders').set('authorization', `Bearer ${token}`)
        expect(res2.status).toBe(200)
        await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        });
    })
    */
    it('GET /orders/:user_id/current', async () => {
        const test_user = {
            id: 100,
            firstname: "tom",
            lastname: "riddle",
            username: "voldemort",
            password: "crucio"
        };
        const res = await request.post('/users').send(test_user);
        // Get jwt Token
        const token = res.body;
        const res2 = await request.get('/orders/100/current').set('authorization', `Bearer ${token}`);
        //console.log(res2.body)
        expect(res2.status).toBe(200);
        await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        });
    });
    it('GET /orders/:user_id/completed', async () => {
        const test_user = {
            id: 100,
            firstname: "tom",
            lastname: "riddle",
            username: "voldemort",
            password: "crucio"
        };
        const res = await request.post('/users').send(test_user);
        // Get jwt Token
        const token = res.body;
        const res2 = await request.get('/orders/100/completed').set('authorization', `Bearer ${token}`);
        console.log(res2.body);
        console.log(token);
        expect(res2.status).toBe(200);
        await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        });
    });
});
describe('Testing the OrderStore model methods', () => {
    it('fetch orders index method', async () => {
        const test_user = {
            firstname: "tom",
            lastname: "hank",
            username: "walter_white",
            password: "test_user_password"
        };
        await store.create(test_user);
        const o = {
            user_id: "1",
            status: "active"
        };
        console.log(await order.create(o));
        const orders = await order.index();
        expect(orders.length).toBeGreaterThanOrEqual(1);
    });
    it('show current orders', async () => {
        const o = {
            user_id: '1',
            status: "active"
        };
        await order.create(o);
        const my_orders = await order.show_completed_orders(o.user_id);
        expect(my_orders).toBeLessThanOrEqual(1);
    });
});
