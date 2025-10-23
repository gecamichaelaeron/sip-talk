<?php
/**
 * Feedback API Endpoint
 * Handles customer feedback submissions
 */

// Enable CORS for development
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database connection
require_once 'db.php';

// Handle GET request - Get all feedback (for admin)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, name, email, rating, message, created_at 
            FROM feedback 
            ORDER BY created_at DESC 
            LIMIT 50";
    
    $result = $conn->query($sql);
    
    $feedback_list = [];
    while ($row = $result->fetch_assoc()) {
        $feedback_list[] = $row;
    }
    
    send_json_response(true, 'Feedback retrieved successfully', [
        'feedback' => $feedback_list
    ]);
}

// Handle POST request - Submit feedback
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $rating = isset($_POST['rating']) ? (int)$_POST['rating'] : 0;
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    
    // Validate input
    if (empty($name) || empty($email) || empty($message)) {
        send_json_response(false, 'All fields are required');
    }
    
    if (!is_valid_email($email)) {
        send_json_response(false, 'Invalid email format');
    }
    
    if ($rating < 1 || $rating > 5) {
        send_json_response(false, 'Rating must be between 1 and 5');
    }
    
    if (strlen($message) < 10) {
        send_json_response(false, 'Feedback message must be at least 10 characters long');
    }
    
    // Insert feedback
    $sql = "INSERT INTO feedback (name, email, rating, message) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssis", $name, $email, $rating, $message);
    
    if ($stmt->execute()) {
        $feedback_id = $stmt->insert_id;
        
        send_json_response(true, 'Thank you for your feedback!', [
            'feedback_id' => $feedback_id
        ]);
    } else {
        send_json_response(false, 'Failed to submit feedback. Please try again.');
    }
    
    $stmt->close();
    $conn->close();
}
?>

