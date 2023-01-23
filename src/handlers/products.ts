import express, {Request, Response} from 'express';
import { Product, ProductStore } from '../models/products';
import jwt from 'jsonwebtoken'
import verifyAuthToken from '../middleware/auth';

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
    const products = await store.index();
    res.json(products)
}

const show = async(req: Request, res: Response) => {
    try {
        const id = req.params.id
        const matched_product = await store.show(id);
        res.json(matched_product)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}
const create = async(req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader?.split(' ')[1]
        jwt.verify(String(token), String(process.env.TOKEN_SECRET))
    } catch (err) {
        res.status(401)
        res.json('Acess denied, invalid token')
    }
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price
        }
        if (req.body.category) {
            product.category = req.body.category
        }
        const new_product = await store.create(product)
        res.json(new_product)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const get_by_category = async(req: Request, res: Response) => {
    try {
        const category = req.params.category
        const products = await store.getProductsByCategory(category);
        res.json(products)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}


const product_routes = (app:express.Application) => {
    app.get('/products', index),
    app.get('/products/:category', get_by_category),
    app.get('/products/:id', show),
    app.post('/products', verifyAuthToken, create)
}

export default product_routes