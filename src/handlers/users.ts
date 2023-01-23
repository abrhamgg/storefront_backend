import express, {Request, Response} from 'express';
import { User, UserStore } from '../models/users';
import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middleware/auth';

const store = new UserStore()

const index = async(req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
}

const show = async(req: Request, res: Response) => {
    const id = req.params.id
    const user = await store.show(id)
    res.json(user)
}
const create = async(req: Request, res: Response) => {
    const user: User = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: req.body.password
    }
    try {
        const new_user = await store.create(user)
        if (new_user == -1) {
            res.status(200)
            res.json({"message": "User Exists. Please use a different username"})
        } else {
            var token = jwt.sign({user: new_user}, String(process.env.TOKEN_SECRET));
            res.json(token)
        }
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const authenticate = async (req: Request, res: Response) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    try {
        const u = await store.authenticate(user.username, user.password)
        if (u !== -1) {
            var token = jwt.sign({user: u}, String(process.env.TOKEN_SECRET));
            res.json(token)
        }
        else {
            res.status(401)
            res.json({"message": "Authentication failed"})
        }
        
    } catch (err) {
        res.status(401)
        res.json({err})
    }
}

const delete_user = async (req: Request, res: Response) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    const result = await store.delete(user.username, user.password)
    if (result === 0) {
        res.status(200)
        res.json({"message": "user deleted"})
    } else {
        res.status(400)
        res.json({"message": "Can't delete the user"})
    }
}

const user_routes = (app: express.Application) => {
    app.post('/users', create);
    app.get('/login', authenticate)
    app.get('/users', verifyAuthToken, index)
    app.get('/users/:id', verifyAuthToken, show)
    app.delete('/users', delete_user)
}

export default user_routes;