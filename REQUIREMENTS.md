# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index ``` GET /products```
- Show  ``` GET /products/id```
- Create [token required]  POST ``` /products```
- [OPTIONAL] Top 5 most popular products GET ``` /popular_products``
- [OPTIONAL] Products by category (args: product category) ``` /products/:category```

#### Users
- Index [token required]  -> GET ``` /users ```
- Show [token required] -> GET ``` /users/id ``` 
- Create N[token required] -> POST ``` /users ```

#### Orders
- Current Order by user (args: user id)[token required] ->  GET ```/orders/:user_id/current ```
- [OPTIONAL] Completed Orders by user (args: user id)[token required] -> GET ```/orders/:user_id/completed ```

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

- CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price int,
    category VARCHAR(50) DEFAULT 'unknown'
);

#### User
- id
- firstName
- lastName
- password

- CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    username VARCHAR(50) UNIQUE,
    password VARCHAR
);

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

- CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(64) DEFAULT 'active',
    user_id bigint REFERENCES users(id)
);

#### Order-products
- id
- quantity
- order_id
- product_id

- CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    quantity integer,
    order_id bigint REFERENCES orders(id),
    product_id bigint REFERENCES products(id)
);

