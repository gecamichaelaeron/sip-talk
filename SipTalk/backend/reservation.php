<?php
/**
 * Reservation API Endpoint
 * Handles table reservations
 */

// Start session
session_start();

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

// Handle GET request - Get user's reservations
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if user is logged in
    if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
        send_json_response(false, 'Please login to view reservations');
    }
    
    $user_id = $_SESSION['user_id'];
    
    $sql = "SELECT id, name, email, phone, reservation_date, reservation_time, guests, status, created_at 
            FROM reservations 
            WHERE user_id = ? 
            ORDER BY reservation_date DESC, reservation_time DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $reservations = [];
    while ($row = $result->fetch_assoc()) {
        $reservations[] = $row;
    }
    
    send_json_response(true, 'Reservations retrieved successfully', [
        'reservations' => $reservations
    ]);
    
    $stmt->close();
    $conn->close();
    exit;
}

// Handle POST request - Create new reservation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if user is logged in (optional - can allow non-logged in users)
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    // Get form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
    $date = isset($_POST['date']) ? sanitize_input($_POST['date']) : '';
    $time = isset($_POST['time']) ? sanitize_input($_POST['time']) : '';
    $guests = isset($_POST['guests']) ? (int)$_POST['guests'] : 1;
    
    // Validate input
    if (empty($name) || empty($email) || empty($phone) || empty($date) || empty($time)) {
        send_json_response(false, 'All fields are required');
    }
    
    if (!is_valid_email($email)) {
        send_json_response(false, 'Invalid email format');
    }
    
    if ($guests < 1 || $guests > 20) {
        send_json_response(false, 'Number of guests must be between 1 and 20');
    }
    
    // Validate date is not in the past
    $reservation_date = new DateTime($date);
    $today = new DateTime('today');
    
    if ($reservation_date < $today) {
        send_json_response(false, 'Cannot book reservation in the past');
    }
    
    // Insert reservation
    $sql = "INSERT INTO reservations (user_id, name, email, phone, reservation_date, reservation_time, guests) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isssssi", $user_id, $name, $email, $phone, $date, $time, $guests);
    
    if ($stmt->execute()) {
        $reservation_id = $stmt->insert_id;
        
        send_json_response(true, 'Reservation successful! See you on ' . $date . ' at ' . $time, [
            'reservation_id' => $reservation_id,
            'reservation_date' => $date,
            'reservation_time' => $time
        ]);
    } else {
        send_json_response(false, 'Failed to create reservation. Please try again.');
    }
    
    $stmt->close();
    $conn->close();
}
?>

