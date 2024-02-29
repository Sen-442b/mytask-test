CREATE DATABASE customer_details;

CREATE TABLE customers (
    sno SERIAL PRIMARY KEY,
    customer_name VARCHAR(100),
    age INT,
    phone VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);