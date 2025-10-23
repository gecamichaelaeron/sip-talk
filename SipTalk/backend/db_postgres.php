<?php
/**
 * PostgreSQL Database Connection for Sip & Talk Coffee Shop
 * 
 * This file establishes a connection to the PostgreSQL database
 * and is included in all PHP API endpoints.
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// Load environment variables (if using phpdotenv or similar)
// require_once __DIR__ . '/../vendor/autoload.php';
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
// $dotenv->load();

// Database configuration - use environment variables
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'sip_talk_db');
define('DB_USER', getenv('DB_USER') ?: 'postgres');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');

// Build PostgreSQL connection string
$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;

try {
    // Create PDO connection to PostgreSQL
    $conn = new PDO($dsn, DB_USER, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Log error and return JSON response
    error_log("Database connection failed: " . $e->getMessage());
    send_json_response(false, 'Database connection failed', null);
    exit;
}

/**
 * Helper function to sanitize input
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Helper function to send JSON response
 */
function send_json_response($success, $message, $data = null) {
    header('Content-Type: application/json');
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

/**
 * Helper function to validate email
 */
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Helper function to hash password
 */
function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

/**
 * Helper function to verify password
 */
function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Helper function to execute prepared statement
 */
function execute_query($sql, $params = []) {
    global $conn;
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Query error: " . $e->getMessage());
        return false;
    }
}

/**
 * Helper function to fetch single row
 */
function fetch_one($sql, $params = []) {
    $stmt = execute_query($sql, $params);
    return $stmt ? $stmt->fetch() : false;
}

/**
 * Helper function to fetch all rows
 */
function fetch_all($sql, $params = []) {
    $stmt = execute_query($sql, $params);
    return $stmt ? $stmt->fetchAll() : false;
}

// Connection is established and ready to use
?>

