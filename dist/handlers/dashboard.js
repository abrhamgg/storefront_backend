"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_1 = require("../services/dashboard");
const dashboard = new dashboard_1.DashbordQueries();
const popular_products = async (_req, res) => {
    try {
        const products = await dashboard.most_popular_products();
        res.json(products);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const dashboard_routes = (app) => {
    app.get('/popular_products', popular_products);
};
exports.default = dashboard_routes;
