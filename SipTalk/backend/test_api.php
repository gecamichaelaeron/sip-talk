<?php
/**
 * API Test Page
 * Use this to verify your backend setup
 */

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=utf-8");

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sip & Talk - API Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #667eea;
            text-align: center;
            margin-bottom: 10px;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .test-section {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .test-section h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .status {
            padding: 10px 15px;
            border-radius: 5px;
            margin: 10px 0;
            font-weight: bold;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .file-list {
            list-style: none;
            margin: 10px 0;
        }
        .file-list li {
            padding: 8px;
            margin: 5px 0;
            background: white;
            border-radius: 5px;
        }
        .file-list li:before {
            content: "✓ ";
            color: #28a745;
            font-weight: bold;
        }
        .file-list li.missing:before {
            content: "✗ ";
            color: #dc3545;
        }
        code {
            background: #333;
            color: #0f0;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px 0 0;
        }
        .btn:hover {
            background: #764ba2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>☕ Sip & Talk - API Test</h1>
        <p class="subtitle">Backend Configuration Check</p>

        <!-- Database Connection Test -->
        <div class="test-section">
            <h2>1️⃣ Database Connection</h2>
            <?php
            try {
                require_once 'db.php';
                echo '<div class="status success">✓ Database connected successfully!</div>';
                echo '<div class="info">Database: <code>' . DB_NAME . '</code></div>';
                echo '<div class="info">Server: <code>' . DB_SERVER . '</code></div>';
                
                // Check tables
                $tables = ['users', 'reservations', 'contacts', 'feedback'];
                echo '<p style="margin-top: 15px;"><strong>Tables:</strong></p>';
                echo '<ul class="file-list">';
                foreach ($tables as $table) {
                    $result = $conn->query("SHOW TABLES LIKE '$table'");
                    if ($result && $result->num_rows > 0) {
                        echo "<li>$table</li>";
                    } else {
                        echo "<li class='missing'>$table (not found)</li>";
                    }
                }
                echo '</ul>';
                
            } catch (Exception $e) {
                echo '<div class="status error">✗ Database connection failed!</div>';
                echo '<div class="error">' . $e->getMessage() . '</div>';
            }
            ?>
        </div>

        <!-- PHP Files Check -->
        <div class="test-section">
            <h2>2️⃣ Backend Files</h2>
            <?php
            $required_files = [
                'db.php' => 'Database connection',
                'login.php' => 'Login endpoint',
                'register.php' => 'Registration endpoint',
                'logout.php' => 'Logout endpoint',
                'reservation.php' => 'Reservation endpoint',
                'contact.php' => 'Contact endpoint',
                'feedback.php' => 'Feedback endpoint'
            ];
            
            $all_exist = true;
            echo '<ul class="file-list">';
            foreach ($required_files as $file => $description) {
                if (file_exists($file)) {
                    echo "<li>$file <small>($description)</small></li>";
                } else {
                    echo "<li class='missing'>$file <small>($description)</small></li>";
                    $all_exist = false;
                }
            }
            echo '</ul>';
            
            if ($all_exist) {
                echo '<div class="status success">✓ All required files present!</div>';
            } else {
                echo '<div class="status error">✗ Some files are missing!</div>';
            }
            ?>
        </div>

        <!-- PHP Configuration -->
        <div class="test-section">
            <h2>3️⃣ PHP Configuration</h2>
            <div class="info">PHP Version: <code><?php echo phpversion(); ?></code></div>
            <div class="info">Max Upload Size: <code><?php echo ini_get('upload_max_filesize'); ?></code></div>
            <div class="info">Post Max Size: <code><?php echo ini_get('post_max_size'); ?></code></div>
            <div class="info">Session Save Path: <code><?php echo session_save_path(); ?></code></div>
        </div>

        <!-- Test Data -->
        <div class="test-section">
            <h2>4️⃣ Sample Data</h2>
            <?php
            if (isset($conn)) {
                // Count users
                $user_count = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
                echo '<div class="info">Users: <code>' . $user_count . '</code></div>';
                
                // Count reservations
                $reservation_count = $conn->query("SELECT COUNT(*) as count FROM reservations")->fetch_assoc()['count'];
                echo '<div class="info">Reservations: <code>' . $reservation_count . '</code></div>';
                
                // Sample users
                $users = $conn->query("SELECT fullname, email FROM users LIMIT 3");
                if ($users && $users->num_rows > 0) {
                    echo '<p style="margin-top: 15px;"><strong>Test Accounts:</strong></p>';
                    echo '<ul class="file-list">';
                    while ($user = $users->fetch_assoc()) {
                        echo '<li>' . htmlspecialchars($user['fullname']) . ' (' . htmlspecialchars($user['email']) . ')</li>';
                    }
                    echo '</ul>';
                    echo '<div class="info">Password for all test accounts: <code>password123</code></div>';
                }
            }
            ?>
        </div>

        <!-- Quick Links -->
        <div class="test-section">
            <h2>🔗 Quick Links</h2>
            <a href="http://localhost/phpmyadmin" class="btn" target="_blank">phpMyAdmin</a>
            <a href="http://localhost:5174" class="btn" target="_blank">React App</a>
            <a href="login.php" class="btn" target="_blank">Test Login API</a>
            <a href="check_session.php" class="btn" target="_blank">Check Session</a>
        </div>

        <!-- Next Steps -->
        <div class="test-section">
            <h2>📋 Next Steps</h2>
            <ol style="margin-left: 20px; line-height: 2;">
                <li>Ensure all tests above are passing (✓)</li>
                <li>Update React components to use backend API</li>
                <li>Set <code>USE_BACKEND_API = true</code> in components</li>
                <li>Run <code>npm run dev</code> in SipTalk folder</li>
                <li>Test login with: <code>john@example.com</code> / <code>password123</code></li>
            </ol>
        </div>
    </div>
</body>
</html>

