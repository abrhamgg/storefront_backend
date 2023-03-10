CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(64) DEFAULT 'active',
    user_id bigint REFERENCES users(id) on DELETE CASCADE ON UPDATE CASCADE
);