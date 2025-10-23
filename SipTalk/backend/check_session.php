<?php
/**
 * Check Session API Endpoint
 * Checks if user is currently logged in
 */

// Start session
session_start();

// Enable CORS for development
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Check if user is logged in
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo json_encode([
        'success' => true,
        'loggedin' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'fullname' => $_SESSION['fullname'],
            'email' => $_SESSION['email']
        ]
    ]);
} else {
    echo json_encode([
        'success' => true,
        'loggedin' => false,
        'user' => null
    ]);
}
?>

