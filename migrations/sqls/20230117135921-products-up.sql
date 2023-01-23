CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price int,
    category VARCHAR(50) DEFAULT 'unknown'
);