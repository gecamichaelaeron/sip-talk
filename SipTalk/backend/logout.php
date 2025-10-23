<?php
/**
 * Logout API Endpoint
 * Destroys user session
 */

// Start session
session_start();

// Enable CORS for development
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Unset all session variables
$_SESSION = array();

// Delete the session cookie
if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - 3600, '/');
}

// Delete the loggedin cookie
setcookie('loggedin', '', time() - 3600, '/');

// Destroy the session
session_destroy();

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
?>

