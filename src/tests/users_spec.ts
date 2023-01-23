import { UserStore } from "../models/users";
import app from "../server";
import supertest from "supertest";

const request = supertest(app)
const store = new UserStore()

describe ('Testing the UserStore model', () =>{
    it ('should have an index method', () =>{
        expect(store.index).toBeDefined();
    })
    it ('should have a create method', () => {
        expect(store.create).toBeDefined();
    })
    it ('should have a show method', () => {
        expect(store.show).toBeDefined();
    })
    it ('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    })
})

describe('Test User endpoints', () => {
    it ('POST /user -> creates new user', async () => {
        const test_user = {
            firstname: "voldemort",
            lastname: "test",
            username: "volde",
            password: "test_user_password"
        }
        const res = await request.post('/users').send(test_user)
        expect(res.status).toBe(200)
        const res2 = await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        });
        expect(res2.status).toBe(200)
    })
    it ('GET /login and GET /users', async () => {
        const test_user = {
            firstname: "tom",
            lastname: "riddle",
            username: "voldemort",
            password: "crucio"
        }
        const res = await request.post('/users').send(test_user)
        const req2 = await request.get('/login').send({
            username: test_user.username,
            password: test_user.password
        })
        expect(req2.status).toBe(200)

        // Testing the GET /users endpoint
        const token = req2.body
        const res3 = await request.get('/users').set('authorization', `Bearer ${token}`)
        expect(res3.status).toBe(200)
        const res2 = await request.delete('/users').send({
            username: test_user.username,
            password: test_user.password
        });
    })
})