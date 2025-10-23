<?php
/**
 * Contact API Endpoint
 * Handles contact form submissions
 */

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
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

// Validate input
if (empty($name) || empty($email) || empty($message)) {
    send_json_response(false, 'All fields are required');
}

if (!is_valid_email($email)) {
    send_json_response(false, 'Invalid email format');
}

if (strlen($message) < 10) {
    send_json_response(false, 'Message must be at least 10 characters long');
}

// Insert contact message
$sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $message);

if ($stmt->execute()) {
    $contact_id = $stmt->insert_id;
    
    // Optional: Send email notification to admin
    // mail('admin@siptalk.com', 'New Contact Message', $message, 'From: ' . $email);
    
    send_json_response(true, 'Your message has been sent successfully!', [
        'contact_id' => $contact_id
    ]);
} else {
    send_json_response(false, 'Failed to send message. Please try again.');
}

$stmt->close();
$conn->close();
?>

