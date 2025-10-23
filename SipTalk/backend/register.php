<?php
/**
 * Registration API Endpoint
 * Handles new user registration
 */

// Start session
session_start();

// Enable CORS - use environment variable in production
$allowed_origin = getenv('FRONTEND_URL') ?: 'http://localhost:5174';
header("Access-Control-Allow-Origin: " . $allowed_origin);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection - Use PostgreSQL for production
if (file_exists('db_postgres.php')) {
    require_once 'db_postgres.php';
} else {
    require_once 'db.php'; // Fallback to MySQL for local dev
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(false, 'Only POST requests are allowed');
}

// Get form data
$fullname = isset($_POST['fullname']) ? sanitize_input($_POST['fullname']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Validate input
if (empty($fullname) || empty($email) || empty($password)) {
    send_json_response(false, 'All fields are required');
}

if (!is_valid_email($email)) {
    send_json_response(false, 'Invalid email format');
}

if (strlen($password) < 6) {
    send_json_response(false, 'Password must be at least 6 characters long');
}

// Check if email already exists
// Support both mysqli and PDO
if ($conn instanceof PDO) {
    // PostgreSQL/PDO
    $check_sql = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->execute(['email' => $email]);
    if ($check_stmt->rowCount() > 0) {
        send_json_response(false, 'Email already registered. Try logging in.');
    }
} else {
    // MySQL/mysqli
    $check_sql = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    if ($check_result->num_rows > 0) {
        send_json_response(false, 'Email already registered. Try logging in.');
    }
    $check_stmt->close();
}

// Hash password
$hashed_password = hash_password($password);

// Insert new user - Support both mysqli and PDO
if ($conn instanceof PDO) {
    // PostgreSQL/PDO
    try {
        $insert_sql = "INSERT INTO users (fullname, email, password) VALUES (:fullname, :email, :password) RETURNING id";
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->execute([
            'fullname' => $fullname,
            'email' => $email,
            'password' => $hashed_password
        ]);
        $user = $insert_stmt->fetch(PDO::FETCH_ASSOC);
        $user_id = $user['id'];
        
        send_json_response(true, 'Registration successful! Please log in.', [
            'user_id' => $user_id
        ]);
    } catch (PDOException $e) {
        error_log("Registration error: " . $e->getMessage());
        send_json_response(false, 'Registration failed. Please try again.');
    }
} else {
    // MySQL/mysqli
    $insert_sql = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("sss", $fullname, $email, $hashed_password);
    
    if ($insert_stmt->execute()) {
        $user_id = $insert_stmt->insert_id;
        
        send_json_response(true, 'Registration successful! Please log in.', [
            'user_id' => $user_id
        ]);
    } else {
        send_json_response(false, 'Registration failed. Please try again.');
    }
    
    $insert_stmt->close();
    $conn->close();
}
?>

