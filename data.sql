USE sneaker_store;

-- Seed customers (two fully populated example customers)
INSERT INTO customers (
    first_name,
    last_name,
    email,
    password_hash,
    phone_number,
    address_line1,
    address_line2,
    city,
    province,
    postal_code,
    country
)
VALUES
    (
        'Alice',
        'Wong',
        'alice@example.com',
        '$2a$10$fakehashAlice',
        '+1-416-555-0001',
        '123 King St',
        'Unit 905',
        'Toronto',
        'ON',
        'M5H 1A1',
        'Canada'
    ),
    (
        'Bob',
        'Chen',
        'bob@example.com',
        '$2a$10$fakehashBob',
        '+1-647-555-0002',
        '456 Queen St',
        'Apt 1203',
        'Markham',
        'ON',
        'L3R 2Y8',
        'Canada'
    );

-- Seed products
INSERT INTO products (sku, name, brand, description, price, stock_quantity, image_url)
VALUES
    ('SKU-001', 'Air Max 90',   'Nike',   'Classic running shoe', 129.99, 50, 'https://example.com/airmax90.jpg'),
    ('SKU-002', 'Ultraboost',   'Adidas', 'Boost running shoe',   180.00, 40, 'https://example.com/ultraboost.jpg'),
    ('SKU-003', 'Air Jordan 1', 'Nike',   'Iconic basketball',    170.00, 30, 'https://example.com/aj1.jpg');

-- Seed sneakers (front-end catalog)
INSERT INTO sneakers (name, brand, colorway, price, stock, description, image_url)
VALUES
    ('Air Max 90',   'Nike',  'Infrared',      129.99, 50, 'Classic Nike Air Max', 'https://example.com/airmax90.jpg'),
    ('Ultraboost',   'Adidas','Triple White',  180.00, 40, 'Adidas running',       'https://example.com/ultraboost.jpg'),
    ('Air Jordan 1', 'Nike',  'Bred',          170.00, 30, 'Jordan basketball',    'https://example.com/aj1.jpg');

INSERT INTO sneaker_sizes (sneaker_id, size)
VALUES
    (1, '8'), (1, '9'), (1, '10'),
    (2, '8'), (2, '9.5'),
    (3, '9'), (3, '10.5');

-- Sample cart for Alice (customer id 1)
INSERT INTO carts (customer_id)
VALUES (1);

INSERT INTO cart_items (cart_id, product_id, quantity, size)
VALUES
    (1, 1, 1, '9'),
    (1, 2, 2, '9.5');

-- Sample paid order for Alice
INSERT INTO orders (order_number, customer_id, order_date, status, total_amount, shipping_address, billing_address)
VALUES
    ('ORD-1001', 1, NOW(), 'PAID', 129.99, '123 King St, Unit 905, Toronto, ON M5H 1A1, Canada',
     '123 King St, Unit 905, Toronto, ON M5H 1A1, Canada');

INSERT INTO order_items (order_id, product_id, quantity, size, unit_price, line_total)
VALUES
    (1, 1, 1, '9', 129.99, 129.99);


