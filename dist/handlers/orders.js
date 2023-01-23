"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
const orders_1 = require("../models/orders");
const store = new orders_1.OrderStore();
const index = async (_req, res) => {
    const orders = await store.index();
    res.json(orders);
};
const create = async (req, res) => {
    try {
        const order = {
            status: req.body.status,
            user_id: req.body.user_id
        };
        const new_order = await store.create(order);
        res.json(new_order);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const addProduct = async (_req, res) => {
    const order_id = _req.params.id;
    const product_id = _req.body.product_id;
    const quantity = parseInt(_req.body.quantity);
    try {
        const added_product = await store.addProduct(quantity, order_id, product_id);
        res.json(added_product);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const get_current_orders = async (_req, res) => {
    const user_id = _req.params.user_id;
    try {
        const current_orders = await store.show_current_orders(user_id);
        res.json(current_orders);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const get_completed_orders = async (_req, res) => {
    const user_id = _req.params.user_id;
    try {
        const completed_orders = await store.show_completed_orders(user_id);
        res.json(completed_orders);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const order_routes = (app) => {
    app.get('/orders', auth_1.default, index),
        app.post('/orders', auth_1.default, create),
        app.post('/orders/:id/products', addProduct),
        app.get('/orders/:user_id/current', auth_1.default, get_current_orders),
        app.get('/orders/:user_id/completed', auth_1.default, get_completed_orders);
};
exports.default = order_routes;
