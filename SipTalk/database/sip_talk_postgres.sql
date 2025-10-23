-- ============================================
-- Sip & Talk Coffee Shop - PostgreSQL Database Schema
-- Converted from MySQL to PostgreSQL
-- ============================================

-- Create Database (run separately if needed)
-- CREATE DATABASE sip_talk_db;
-- \c sip_talk_db;

-- ============================================
-- Enable UUID extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- RESERVATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at);

-- ============================================
-- FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);

-- ============================================
-- MENU ITEMS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('cold-coffee', 'hot-coffee', 'dessert', 'snacks')),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

-- ============================================
-- ORDERS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ============================================
-- ORDER ITEMS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Create index
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- Password for all test users: "password123"
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ============================================

INSERT INTO users (fullname, email, password) VALUES
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Admin User', 'admin@siptalk.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample Menu Items
INSERT INTO menu_items (name, category, description, price, image_url) VALUES
-- Cold Coffee
('Iced Latte', 'cold-coffee', 'Smooth espresso with cold milk and ice', 4.50, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg'),
('Cold Brew', 'cold-coffee', 'Slow-steeped coffee served over ice', 4.00, 'https://images.pexels.com/photos/1833753/pexels-photo-1833753.jpeg'),
('Frappuccino', 'cold-coffee', 'Blended coffee drink with ice', 5.50, 'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg'),
('Iced Mocha', 'cold-coffee', 'Chocolate and espresso over ice', 5.00, 'https://images.pexels.com/photos/373639/pexels-photo-373639.jpeg'),

-- Hot Coffee
('Espresso', 'hot-coffee', 'Strong concentrated coffee', 3.00, 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg'),
('Cappuccino', 'hot-coffee', 'Espresso with steamed milk foam', 4.00, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg'),
('Latte', 'hot-coffee', 'Espresso with steamed milk', 4.50, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'),
('Americano', 'hot-coffee', 'Espresso with hot water', 3.50, 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg'),

-- Desserts
('Chocolate Cake', 'dessert', 'Rich chocolate layer cake', 5.00, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'),
('Cheesecake', 'dessert', 'Creamy New York style cheesecake', 5.50, 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'),
('Brownie', 'dessert', 'Fudgy chocolate brownie', 3.50, 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg'),
('Tiramisu', 'dessert', 'Italian coffee-flavored dessert', 6.00, 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg'),

-- Snacks
('Croissant', 'snacks', 'Buttery French pastry', 3.00, 'https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg'),
('Blueberry Muffin', 'snacks', 'Fresh baked muffin with blueberries', 3.50, 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg'),
('Bagel with Cream Cheese', 'snacks', 'Toasted bagel with cream cheese', 4.00, 'https://images.pexels.com/photos/2135677/pexels-photo-2135677.jpeg'),
('Cookies', 'snacks', 'Assorted homemade cookies', 2.50, 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg');

-- Sample Reservations
INSERT INTO reservations (user_id, name, email, phone, reservation_date, reservation_time, guests, status) VALUES
(1, 'John Doe', 'john@example.com', '123-456-7890', '2025-10-25', '18:00:00', 4, 'confirmed'),
(2, 'Jane Smith', 'jane@example.com', '098-765-4321', '2025-10-26', '19:30:00', 2, 'pending');

-- ============================================
-- VIEWS (for easier data retrieval)
-- ============================================

-- View for upcoming reservations
CREATE OR REPLACE VIEW upcoming_reservations AS
SELECT 
    r.id,
    r.user_id,
    r.name,
    r.email,
    r.phone,
    r.reservation_date,
    r.reservation_time,
    r.guests,
    r.status,
    u.fullname as user_fullname
FROM reservations r
LEFT JOIN users u ON r.user_id = u.id
WHERE r.reservation_date >= CURRENT_DATE
    AND r.status IN ('pending', 'confirmed')
ORDER BY r.reservation_date, r.reservation_time;

-- View for recent feedback
CREATE OR REPLACE VIEW recent_feedback AS
SELECT 
    id,
    name,
    email,
    rating,
    message,
    created_at
FROM feedback
ORDER BY created_at DESC
LIMIT 50;

-- ============================================
-- FUNCTIONS (PostgreSQL replacement for stored procedures)
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATABASE INFO
-- ============================================
SELECT 
    'Database created successfully!' as message,
    current_database() as current_database,
    NOW() as created_at;

