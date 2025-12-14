INSERT IGNORE INTO brands (name, description, logo_url) VALUES
('Nike', 'Just Do It - Leading athletic footwear brand', 'https://example.com/logos/nike.png'),
('Adidas', 'Impossible is Nothing - German sportswear manufacturer', 'https://example.com/logos/adidas.png'),
('Jordan', 'Air Jordan - Basketball sneakers by Nike', 'https://example.com/logos/jordan.png'),
('New Balance', 'Made in USA - Comfortable running shoes', 'https://example.com/logos/newbalance.png'),
('Puma', 'Forever Faster - German sportswear brand', 'https://example.com/logos/puma.png');

INSERT IGNORE INTO categories (name, description) VALUES
('Running', 'Sneakers designed for running and jogging'),
('Basketball', 'High-performance basketball shoes'),
('Casual', 'Everyday casual sneakers'),
('Lifestyle', 'Fashion-forward lifestyle sneakers'),
('Training', 'Athletic training and gym shoes');

INSERT INTO sneakers (name, description, price, stock_quantity, image_url, size_range, brand_id, category_id)
SELECT 
    'Air Max 90',
    'Classic Nike Air Max with visible air cushioning',
    129.99,
    50,
    'https://example.com/images/airmax90.jpg',
    '6-13',
    (SELECT id FROM brands WHERE name = 'Nike'),
    (SELECT id FROM categories WHERE name = 'Running')
WHERE NOT EXISTS (SELECT 1 FROM sneakers WHERE name = 'Air Max 90');

INSERT INTO sneakers (name, description, price, stock_quantity, image_url, size_range, brand_id, category_id)
SELECT 
    'Air Jordan 1 Retro',
    'Iconic basketball sneaker with high-top design',
    170.00,
    30,
    'https://example.com/images/aj1.jpg',
    '7-14',
    (SELECT id FROM brands WHERE name = 'Jordan'),
    (SELECT id FROM categories WHERE name = 'Basketball')
WHERE NOT EXISTS (SELECT 1 FROM sneakers WHERE name = 'Air Jordan 1 Retro');

INSERT INTO sneakers (name, description, price, stock_quantity, image_url, size_range, brand_id, category_id)
SELECT 
    'Ultraboost 22',
    'Adidas premium running shoe with Boost technology',
    180.00,
    40,
    'https://example.com/images/ultraboost.jpg',
    '6-13',
    (SELECT id FROM brands WHERE name = 'Adidas'),
    (SELECT id FROM categories WHERE name = 'Running')
WHERE NOT EXISTS (SELECT 1 FROM sneakers WHERE name = 'Ultraboost 22');

INSERT INTO sneakers (name, description, price, stock_quantity, image_url, size_range, brand_id, category_id)
SELECT 
    '990v5',
    'New Balance classic running shoe made in USA',
    185.00,
    25,
    'https://example.com/images/990v5.jpg',
    '6-13',
    (SELECT id FROM brands WHERE name = 'New Balance'),
    (SELECT id FROM categories WHERE name = 'Running')
WHERE NOT EXISTS (SELECT 1 FROM sneakers WHERE name = '990v5');

INSERT INTO sneakers (name, description, price, stock_quantity, image_url, size_range, brand_id, category_id)
SELECT 
    'RS-X3',
    'Puma futuristic lifestyle sneaker',
    100.00,
    35,
    'https://example.com/images/rsx3.jpg',
    '6-13',
    (SELECT id FROM brands WHERE name = 'Puma'),
    (SELECT id FROM categories WHERE name = 'Lifestyle')
WHERE NOT EXISTS (SELECT 1 FROM sneakers WHERE name = 'RS-X3');

INSERT IGNORE INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@sneakerstore.com', 'admin123', 'Admin', 'User', 'ADMIN'),
('john_doe', 'john@example.com', 'password123', 'John', 'Doe', 'CUSTOMER'),
('jane_smith', 'jane@example.com', 'password123', 'Jane', 'Smith', 'CUSTOMER');
