"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
const store = new products_1.ProductStore();
const index = async (_req, res) => {
    const products = await store.index();
    res.json(products);
};
const show = async (req, res) => {
    try {
        const id = req.params.id;
        const matched_product = await store.show(id);
        res.json(matched_product);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const create = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(String(token), String(process.env.TOKEN_SECRET));
    }
    catch (err) {
        res.status(401);
        res.json('Acess denied, invalid token');
    }
    try {
        const product = {
            name: req.body.name,
            price: req.body.price
        };
        if (req.body.category) {
            product.category = req.body.category;
        }
        const new_product = await store.create(product);
        res.json(new_product);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const get_by_category = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await store.getProductsByCategory(category);
        res.json(products);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const product_routes = (app) => {
    app.get('/products', index),
        app.get('/products/categoty/:category', get_by_category),
        app.get('/products/:id', show),
        app.post('/products', auth_1.default, create);
};
exports.default = product_routes;
