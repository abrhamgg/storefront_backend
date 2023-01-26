import express, {Request, Response} from 'express';
import verifyAuthToken from '../middleware/auth';
import { Order, OrderStore } from '../models/orders';

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index();
        res.json(orders)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
    
}


const create = async(req: Request, res: Response) => {
    try {
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id
        }
        const new_order = await store.create(order)
        res.json(new_order)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const delete_order = async(req: Request, res: Response) => {
    try {
        const order_id = req.params.id
        const status = await store.delete(order_id)
        res.status(200)
        res.json({message: "order has been removed"})
    } catch {
        res.json({message: "Error"})
    }
}

const addProduct = async(_req: Request, res: Response) => {
    const order_id: string = _req.params.id
    const product_id: string = _req.body.product_id
    const quantity: number = parseInt(_req.body.quantity)

    try {
        const added_product = await store.addProduct(quantity, order_id, product_id)
        res.json(added_product)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const get_current_orders = async(_req: Request, res: Response) => {
    const user_id = _req.params.user_id
    try {
        const current_orders = await store.show_current_orders(user_id)
        res.json(current_orders)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const get_completed_orders = async(_req: Request, res: Response) => {
    const user_id = _req.params.user_id
    try {
        const completed_orders = await store.show_completed_orders(user_id)
        res.json(completed_orders)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}



const order_routes = (app: express.Application) => {
    app.get('/orders', verifyAuthToken, index),
    app.post('/orders', verifyAuthToken, create),
    app.post('/orders/:id/products', verifyAuthToken, addProduct),
    app.get('/orders/:user_id/current', verifyAuthToken, get_current_orders),
    app.get('/orders/:user_id/completed', verifyAuthToken, get_completed_orders),
    app.delete('/orders/:id', verifyAuthToken, delete_order)
}



export default order_routes