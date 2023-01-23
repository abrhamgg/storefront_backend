import express, { Request, Response } from 'express';
import { DashbordQueries } from '../services/dashboard';

const dashboard = new DashbordQueries()

const popular_products = async(_req: Request, res: Response) => {
    try {
        const products = await dashboard.most_popular_products();
        res.json(products)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const dashboard_routes = (app: express.Application) => {
    app.get('/popular_products', popular_products)
}
export default dashboard_routes