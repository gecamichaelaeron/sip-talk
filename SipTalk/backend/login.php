<?php
/**
 * Login API Endpoint
 * Handles user authentication
 */

// Start session
session_start();

// Enable CORS for development
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(false, 'Only POST requests are allowed');
}

// Get form data
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Validate input
if (empty($email) || empty($password)) {
    send_json_response(false, 'Email and password are required');
}

if (!is_valid_email($email)) {
    send_json_response(false, 'Invalid email format');
}

// Check if user exists
$sql = "SELECT id, fullname, email, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    send_json_response(false, 'Email not registered. Please sign up first.');
}

// Verify password
$user = $result->fetch_assoc();

if (!verify_password($password, $user['password'])) {
    send_json_response(false, 'Incorrect password. Please try again.');
}

// Login successful - create session
$_SESSION['user_id'] = $user['id'];
$_SESSION['fullname'] = $user['fullname'];
$_SESSION['email'] = $user['email'];
$_SESSION['loggedin'] = true;

// Set cookie for session persistence
setcookie('loggedin', '1', time() + (86400 * 30), "/"); // 30 days

// Return success response
send_json_response(true, 'Login successful', [
    'user' => [
        'id' => $user['id'],
        'fullname' => $user['fullname'],
        'email' => $user['email']
    ]
]);

$stmt->close();
$conn->close();
?>

