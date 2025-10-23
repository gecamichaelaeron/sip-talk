<?php
/**
 * Health Check Endpoint
 * Used by Render.com and other platforms to verify service health
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check if database connection file exists
$db_file = file_exists('db_postgres.php') ? 'db_postgres.php' : 'db.php';

try {
    // Try to connect to database
    require_once $db_file;
    
    // If using PostgreSQL (PDO)
    if (isset($conn) && $conn instanceof PDO) {
        // Test database connection with a simple query
        $stmt = $conn->query('SELECT 1');
        $db_status = $stmt !== false ? 'connected' : 'disconnected';
    } 
    // If using MySQL (mysqli)
    elseif (isset($conn) && $conn instanceof mysqli) {
        $db_status = $conn->ping() ? 'connected' : 'disconnected';
    } 
    else {
        $db_status = 'unknown';
    }
    
    $status = 'healthy';
    $code = 200;
    
} catch (Exception $e) {
    $status = 'unhealthy';
    $db_status = 'error';
    $code = 503;
    $error = $e->getMessage();
}

http_response_code($code);

echo json_encode([
    'status' => $status,
    'service' => 'SipTalk API',
    'timestamp' => date('Y-m-d H:i:s'),
    'database' => $db_status,
    'php_version' => phpversion(),
    'error' => $error ?? null
]);
?>

