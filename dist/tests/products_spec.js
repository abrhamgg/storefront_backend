"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const server_1 = __importDefault(require("../server"));
const supertest_1 = __importDefault(require("supertest"));
const product = new products_1.ProductStore();
const request = (0, supertest_1.default)(server_1.default);
describe('Testing product model', () => {
    it('should have an index method', () => {
        expect(product.index).toBeDefined();
    });
    it('should have an show method', () => {
        expect(product.show).toBeDefined();
    });
    it('should have an create method', () => {
        expect(product.create).toBeDefined();
    });
});
describe('test product model methods', () => {
    it('fetch all products', async () => {
        const p = {
            name: "Legion Laptop",
            price: 800,
            category: "Laptop"
        };
        await product.create(p);
        const products = await product.index();
        expect(products.length).toBeGreaterThan(0);
    });
    it('fetch product by id', async () => {
        const p = {
            name: "Asus Laptop",
            price: 800,
            category: "Laptop"
        };
        await product.create(p);
        const my_product = await product.show("1");
        expect(my_product).toBeInstanceOf(Object);
    });
    it('fetch products by category', async () => {
        const p = {
            name: "Lenovo Laptop",
            price: 800,
            category: "Laptop"
        };
        await product.create(p);
        const products = await product.getProductsByCategory('Laptop');
        expect(products?.length).toBeGreaterThanOrEqual(1);
    });
});
describe('Testing the Product endpoints', () => {
    it('GET /products', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
    });
    it('GET /products/:id', async () => {
        const response = await request.get('/products/1');
        expect(response.status).toBe(200);
    });
    it('GET /popular_products', async () => {
        const response = await request.get('/popular_products');
        expect(response.status).toBe(200);
    });
    it('POST /products', async () => {
        // Create a temporary user
        const test_user = {
            firstname: "tom",
            lastname: "riddle",
            username: "voldemort",
            password: "crucio"
        };
        const res = await request.post('/users').send(test_user);
        // Get jwt Token
        const token = res.body;
        console.log(token);
        // Create new product using the Jwt
        const new_product = {
            "name": "temp_product",
            "price": 199
        };
        const res3 = await request.post('/products').set('authorization', `Bearer ${token}`).send(new_product);
        expect(res3.status).toBe(200);
        await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        });
    });
});
