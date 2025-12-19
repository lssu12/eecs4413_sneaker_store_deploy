USE sneaker_store;

-- Seed customers (two fully populated example customers)
INSERT INTO customers (
    first_name, last_name, email, password_hash,
    phone_number, address_line1, address_line2,
    city, province, postal_code, country,
    billing_address_line1, billing_address_line2, billing_city,
    billing_province, billing_postal_code, billing_country,
    credit_card_holder, credit_card_number, credit_card_expiry, credit_card_cvv,
    role
)
VALUES
('Alice','Wong','alice@example.com','$2a$10$fakehash1','416-555-0001','123 King St','Unit 905','Toronto','ON','M5H1A1','Canada',
 '123 King St','Unit 905','Toronto','ON','M5H1A1','Canada','Alice Wong','4111111111111111','12/28','101','CUSTOMER'),
('Bob','Chen','bob@example.com','$2a$10$fakehash2','647-555-0002','456 Queen St','Apt 1203','Markham','ON','L3R2Y8','Canada',
 '456 Queen St','Apt 1203','Markham','ON','L3R2Y8','Canada','Bob Chen','5555444433332222','11/27','202'),
('Chris','Lee','chris@example.com','$2a$10$fakehash3','416-555-0003','89 Yonge St',NULL,'Toronto','ON','M5E1A1','Canada',
 '100 Front St',NULL,'Toronto','ON','M5J1E3','Canada','Chris Lee','4000123412341234','10/26','303'),
('Diana','Xu','diana@example.com','$2a$10$fakehash4','416-555-0004','12 Bay St','Suite 400','Toronto','ON','M5J2X2','Canada',
 '12 Bay St','Suite 400','Toronto','ON','M5J2X2','Canada','Diana Xu','6011000990139424','03/29','404'),
('Evan','Park','evan@example.com','$2a$10$fakehash5','647-555-0005','77 Finch Ave',NULL,'North York','ON','M2N6Z8','Canada',
 '500 Bayview Ave',NULL,'Toronto','ON','M2L1B4','Canada','Evan Park','378282246310005','07/27','123'),
('Fiona','Li','fiona@example.com','$2a$10$fakehash6','416-555-0006','33 Bloor St','Unit 210','Toronto','ON','M4W1A9','Canada',
 '33 Bloor St','Unit 210','Toronto','ON','M4W1A9','Canada','Fiona Li','3530111333300000','08/28','456'),
('George','Zhao','george@example.com','$2a$10$fakehash7','647-555-0007','9 Highway 7',NULL,'Richmond Hill','ON','L4B3P4','Canada',
 '88 Leslie St',NULL,'Richmond Hill','ON','L4S1N2','Canada','George Zhao','4000000000000002','09/26','789'),
('Helen','Sun','helen@example.com','$2a$10$fakehash8','416-555-0008','101 College St',NULL,'Toronto','ON','M5G1L7','Canada',
 '101 College St',NULL,'Toronto','ON','M5G1L7','Canada','Helen Sun','4242424242424242','04/30','321'),
('Ian','Kim','ian@example.com','$2a$10$fakehash9','647-555-0009','55 Sheppard Ave','Unit 1601','Toronto','ON','M2N2Z8','Canada',
 '55 Sheppard Ave','Unit 1601','Toronto','ON','M2N2Z8','Canada','Ian Kim','5105105105105100','05/27','654'),
('Jenny','Liu','jenny@example.com','$2a$10$fakehash10','416-555-0010','88 Dundas St',NULL,'Toronto','ON','M5B1C6','Canada',
 '88 Dundas St',NULL,'Toronto','ON','M5B1C6','Canada','Jenny Liu','6011111111111117','06/28','987'),
('Demo','Admin','demo@sneakerstore.test','$2y$10$176gsMzrx50I5jLY9MknGOpp2mS/FPLNB3QsT6unusT0OFWTUS4CS','000-000-0000','1 Admin Way',NULL,'Toronto','ON','M1M1M1','Canada',
 '1 Admin Way',NULL,'Toronto','ON','M1M1M1','Canada','Demo Admin','4242424242424242','12/30','111','ADMIN');
-- Seed products
INSERT INTO products (sku, name, brand, description, price, stock_quantity, image_url)
VALUES
('SKU-001','Air Max 90','Nike','Classic running shoe',129.99,50,'/images/sneakers/1.png'),
('SKU-002','Ultraboost','Adidas','Boost running shoe',180.00,40,'/images/sneakers/2.png'),
('SKU-003','Air Jordan 1','Nike','Iconic basketball shoe',170.00,30,'/images/sneakers/3.png'),
('SKU-004','Air Force 1','Nike','Everyday lifestyle sneaker',120.00,60,'/images/sneakers/4.png'),
('SKU-005','Stan Smith','Adidas','Classic tennis shoe',110.00,45,'/images/sneakers/5.png'),
('SKU-006','Yeezy 350','Adidas','Kanye West collaboration',220.00,20,'/images/sneakers/6.png'),
('SKU-007','Gel-Kayano','ASICS','Stability running shoe',160.00,35,'/images/sneakers/7.png'),
('SKU-008','New Balance 990','New Balance','Made in USA runner',195.00,25,'/images/sneakers/8.png'),
('SKU-009','Puma Suede','Puma','Retro suede sneaker',95.00,55,'/images/sneakers/9.png'),
('SKU-010','Reebok Classic','Reebok','Timeless leather sneaker',100.00,50,'/images/sneakers/10.png');
-- Seed sneakers (front-end catalog)
INSERT INTO sneakers (name, brand, colorway, price, stock, category, genre, description, image_url)
VALUES
('Air Max 90','Nike','Infrared',129.99,50,'Running','Men','Classic Nike Air Max','/images/sneakers/1.png'),
('Ultraboost','Adidas','Triple White',180.00,40,'Running','Unisex','Adidas running shoe','/images/sneakers/2.png'),
('Air Jordan 1','Nike','Bred',170.00,30,'Basketball','Unisex','Jordan basketball icon','/images/sneakers/3.png'),
('Air Force 1','Nike','White',120.00,60,'Lifestyle','Unisex','Nike lifestyle sneaker','/images/sneakers/4.png'),
('Stan Smith','Adidas','Green Heel',110.00,45,'Tennis','Unisex','Adidas tennis classic','/images/sneakers/5.png'),
('Yeezy 350','Adidas','Zebra',220.00,20,'Lifestyle','Unisex','Yeezy collaboration','/images/sneakers/6.png'),
('Gel-Kayano','ASICS','Blue/White',160.00,35,'Running','Men','Stability runner','/images/sneakers/7.png'),
('NB 990','New Balance','Grey',195.00,25,'Running','Unisex','Premium runner','/images/sneakers/8.png'),
('Puma Suede','Puma','Black/White',95.00,55,'Lifestyle','Unisex','Retro suede','/images/sneakers/9.png'),
('Reebok Classic','Reebok','White',100.00,50,'Lifestyle','Unisex','Classic leather','/images/sneakers/10.png');
INSERT INTO sneaker_sizes (sneaker_id, size)
VALUES
(1,'8'),(1,'9'),(1,'10'),
(2,'8.5'),(2,'9.5'),
(3,'9'),(3,'10.5'),
(4,'8'),(4,'9'),
(5,'9'),(5,'10'),
(6,'9.5'),(6,'10.5'),
(7,'8'),(7,'9'),
(8,'9'),(8,'10'),
(9,'8.5'),(9,'9.5'),
(10,'9'),(10,'10');
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

-- Inventory history samples to populate admin timeline
INSERT INTO inventory_events (
    product_id, type, event_time, quantity_delta, previous_stock, new_stock,
    previous_price, new_price, order_id, note
)
VALUES
    (1, 'RESTOCK', DATE_SUB(NOW(), INTERVAL 30 DAY), 25, 25, 50, NULL, NULL, NULL, 'Initial stock delivery'),
    (1, 'PRICE_CHANGE', DATE_SUB(NOW(), INTERVAL 20 DAY), NULL, 50, 50, 139.99, 129.99, NULL, 'Spring promo adjustment'),
    (1, 'SALE', DATE_SUB(NOW(), INTERVAL 5 DAY), -1, 50, 49, NULL, NULL, 1, 'Order ORD-1001'),
    (2, 'RESTOCK', DATE_SUB(NOW(), INTERVAL 15 DAY), 15, 25, 40, NULL, NULL, NULL, 'Supplier replenishment'),
    (3, 'ADJUSTMENT', DATE_SUB(NOW(), INTERVAL 7 DAY), -5, 35, 30, NULL, NULL, NULL, 'Damaged box write-off');
