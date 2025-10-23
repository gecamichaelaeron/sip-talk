-- ============================================
-- Sip & Talk Coffee Shop Database Schema
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS sip_talk_db;
USE sip_talk_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESERVATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_reservation_date (reservation_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- FEEDBACK TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- MENU ITEMS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('cold-coffee', 'hot-coffee', 'dessert', 'snacks') NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDERS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDER ITEMS TABLE (Optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample Users (passwords are hashed with password_hash())
-- Password for all test users: "password123"
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
WHERE r.reservation_date >= CURDATE()
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
-- STORED PROCEDURES (Optional - for complex operations)
-- ============================================

DELIMITER //

-- Create reservation with validation
CREATE PROCEDURE create_reservation(
    IN p_user_id INT,
    IN p_name VARCHAR(255),
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(20),
    IN p_date DATE,
    IN p_time TIME,
    IN p_guests INT
)
BEGIN
    -- Check if date is in the past
    IF p_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot book reservation in the past';
    END IF;
    
    -- Insert reservation
    INSERT INTO reservations (user_id, name, email, phone, reservation_date, reservation_time, guests)
    VALUES (p_user_id, p_name, p_email, p_phone, p_date, p_time, p_guests);
    
    SELECT LAST_INSERT_ID() as reservation_id;
END //

-- Cancel reservation
CREATE PROCEDURE cancel_reservation(IN p_reservation_id INT)
BEGIN
    UPDATE reservations 
    SET status = 'cancelled' 
    WHERE id = p_reservation_id;
END //

DELIMITER ;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
-- Most indexes are already created in table definitions above

-- ============================================
-- GRANTS (Optional - create specific user for app)
-- ============================================
-- CREATE USER 'siptalk_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON sip_talk_db.* TO 'siptalk_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================
-- DATABASE INFO
-- ============================================
SELECT 
    'Database created successfully!' as message,
    DATABASE() as current_database,
    NOW() as created_at;

