CREATE DATABASE IF NOT EXISTS sneaker_store;
USE sneaker_store;

-- Drop existing tables so repeated executions keep the schema in sync
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS sneaker_sizes;
DROP TABLE IF EXISTS inventory_events;
DROP TABLE IF EXISTS sneakers;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

-- 1) Customers
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(255) NOT NULL,
    last_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    role          VARCHAR(32)  NOT NULL DEFAULT 'CUSTOMER',
    password_hash VARCHAR(255) NOT NULL,
    phone_number  VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city          VARCHAR(100),
    province      VARCHAR(100),
    postal_code   VARCHAR(20),
    country       VARCHAR(100),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city          VARCHAR(100),
    billing_province      VARCHAR(100),
    billing_postal_code   VARCHAR(20),
    billing_country       VARCHAR(100),
    credit_card_holder    VARCHAR(255),
    credit_card_number    VARCHAR(64),
    credit_card_expiry    VARCHAR(10),
    credit_card_cvv       VARCHAR(10)
);

-- 2) Products
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sku            VARCHAR(100) NOT NULL UNIQUE,
    name           VARCHAR(255) NOT NULL,
    brand          VARCHAR(255),
    description    VARCHAR(1000),
    price          DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    image_url      VARCHAR(500)
);

-- 3) Sneakers (catalog entries for the storefront)
CREATE TABLE IF NOT EXISTS sneakers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    brand       VARCHAR(255) NOT NULL,
    colorway    VARCHAR(255),
    price       DECIMAL(10,2) NOT NULL,
    stock       INT,
    category    VARCHAR(100),
    genre       VARCHAR(100),
    description VARCHAR(1000),
    image_url   VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS sneaker_sizes (
    sneaker_id BIGINT NOT NULL,
    size       VARCHAR(10) NOT NULL,
    PRIMARY KEY (sneaker_id, size),
    CONSTRAINT fk_sneaker_sizes_sneaker
        FOREIGN KEY (sneaker_id) REFERENCES sneakers(id)
        ON DELETE CASCADE
);

-- 4) Orders
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number     VARCHAR(255) NOT NULL UNIQUE,
    customer_id      BIGINT NOT NULL,
    order_date       DATETIME NOT NULL,
    status           VARCHAR(20) NOT NULL,
    total_amount     DECIMAL(12,2) NOT NULL,
    shipping_address VARCHAR(500),
    billing_address  VARCHAR(500),
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 5) Order items
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT NOT NULL,
    size       VARCHAR(10),
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 6) Carts
CREATE TABLE IF NOT EXISTS carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carts_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 7) Cart items
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id    BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT NOT NULL,
    size       VARCHAR(10),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);
-- 8) Inventory events for admin history views
CREATE TABLE IF NOT EXISTS inventory_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id     BIGINT      NOT NULL,
    type           VARCHAR(32) NOT NULL,
    event_time     DATETIME    NOT NULL,
    quantity_delta INT,
    previous_stock INT,
    new_stock      INT,
    previous_price DECIMAL(10,2),
    new_price      DECIMAL(10,2),
    order_id       BIGINT,
    note           VARCHAR(255),
    CONSTRAINT fk_inventory_events_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
