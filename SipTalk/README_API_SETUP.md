# API Setup Guide - Connecting React to PHP Backend

## Architecture Overview

```
┌─────────────────┐          HTTP Requests          ┌──────────────────┐
│                 │  ───────────────────────────>   │                  │
│  React Frontend │                                  │   PHP Backend    │
│  (Browser)      │  <───────────────────────────   │   (XAMPP)        │
│                 │          JSON/HTML Response      │                  │
└─────────────────┘                                  └──────────────────┘
                                                              │
                                                              ├── db.php
                                                              ├── login.php
                                                              ├── register.php
                                                              └── reservation.php
                                                              │
                                                              ▼
                                                     ┌──────────────────┐
                                                     │  MySQL Database  │
                                                     │  sip_talk_db     │
                                                     └──────────────────┘
```

## Important Notes

1. **db.php stays on the PHP server** - It cannot be converted to React
2. React runs in the browser and cannot directly access MySQL
3. Communication happens through HTTP requests (fetch API)

## Setup Instructions

### 1. Keep Your PHP Backend (XAMPP)

Your PHP files remain in: `C:\xampp\htdocs\Aeron Coffee Shop\`

Files needed:
- `db.php` - Database connection
- `login.php` - Login endpoint
- `register.php` - Registration endpoint
- `reservation.php` - Reservation endpoint

### 2. Configure React Frontend

**Option A: Development Mode (localStorage)**
- Set `USE_BACKEND_API = false` in each component
- Uses localStorage for testing without PHP

**Option B: Connect to PHP Backend**
- Set `USE_BACKEND_API = true` in components
- Update `API_CONFIG.BASE_URL` in `src/config/api.ts`

### 3. Enable CORS in PHP (if needed)

Add this to the top of your PHP files:

```php
<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Vite dev server
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
?>
```

### 4. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE sip_talk_db;

USE sip_talk_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## How It Works

### Login Example

**React Component:**
```typescript
const loginWithBackend = async () => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const response = await fetch('/login.php', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  
  // Handle response...
};
```

**PHP Backend (login.php):**
```php
<?php
session_start();
include "db.php"; // Connects to MySQL

// Authenticate user
// Set session variables
// Return response
?>
```

### Data Flow

1. User submits login form in React
2. React sends HTTP POST to `login.php`
3. PHP connects to MySQL via `db.php`
4. PHP validates credentials
5. PHP creates session
6. PHP sends response to React
7. React stores user info and updates UI

## Switching Between Modes

### Development (No PHP Server)
```typescript
// In Login.tsx, Register.tsx, Reservation.tsx
const USE_BACKEND_API = false;
```
Uses localStorage - good for testing UI

### Production (With PHP Server)
```typescript
const USE_BACKEND_API = true;
const API_ENDPOINT = '/login.php'; // Points to XAMPP
```
Connects to real MySQL database

## File Structure

```
Aeron Coffee Shop/
├── Sip&Talk/                 # React Frontend
│   ├── src/
│   │   ├── config/
│   │   │   └── api.ts        # API configuration
│   │   ├── components/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Reservation.tsx
│   │   └── utils/
│   │       └── auth.ts       # Auth utilities
│   └── package.json
│
└── (root)/                   # PHP Backend (XAMPP)
    ├── db.php                # Database connection
    ├── login.php             # Login endpoint
    ├── register.php          # Register endpoint
    └── reservation.php       # Reservation endpoint
```

## Testing

1. **Test with localStorage** (no PHP needed):
   - Set `USE_BACKEND_API = false`
   - Run: `npm run dev`
   - Everything works in browser

2. **Test with PHP backend**:
   - Start XAMPP (Apache + MySQL)
   - Set `USE_BACKEND_API = true`
   - Update `API_ENDPOINT` paths
   - Run: `npm run dev`
   - React talks to PHP

## Common Issues

### CORS Errors
Add CORS headers to PHP files (see step 3)

### Session Not Working
Ensure `credentials: 'include'` in fetch requests

### Connection Refused
Check XAMPP is running and paths are correct

## Summary

- ✅ **db.php stays on server** - handles MySQL connection
- ✅ **React uses fetch API** - makes HTTP requests to PHP
- ✅ **PHP processes requests** - queries database, returns data
- ✅ **Two modes**: localStorage (dev) or PHP backend (production)

