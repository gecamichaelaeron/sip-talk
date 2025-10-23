# Database Setup Guide - Sip & Talk Coffee Shop

This guide will help you set up the MySQL database and PHP backend for the SipTalk application.

---

## 📋 Prerequisites

1. **XAMPP Installed** (includes Apache, MySQL, PHP)
2. **React App** (already set up in `SipTalk/` folder)
3. **Basic knowledge** of MySQL and PHP

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Start XAMPP

1. Open **XAMPP Control Panel**
2. Start **Apache** server
3. Start **MySQL** server

### Step 2: Create Database

**Option A: Using phpMyAdmin (Recommended)**
1. Open browser → `http://localhost/phpmyadmin`
2. Click "New" to create database
3. Database name: `sip_talk_db`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"
6. Click "Import" tab
7. Choose file: `SipTalk/database/sip_talk_db.sql`
8. Click "Go"
9. ✅ Database created with all tables!

**Option B: Using MySQL Command Line**
```bash
# Open MySQL
mysql -u root -p

# Run the SQL file
source C:/xampp/htdocs/AeronCoffeeShop/SipTalk/database/sip_talk_db.sql

# Verify database
SHOW DATABASES;
USE sip_talk_db;
SHOW TABLES;
```

### Step 3: Copy Backend Files

Copy the PHP backend files to your XAMPP htdocs:

```
From: C:\xampp\htdocs\AeronCoffeeShop\SipTalk\backend\
To:   C:\xampp\htdocs\AeronCoffeeShop\

Files to copy:
- db.php
- login.php
- register.php
- logout.php
- reservation.php
- contact.php
- feedback.php
```

**Using PowerShell:**
```powershell
cd C:\xampp\htdocs\AeronCoffeeShop
Copy-Item SipTalk\backend\* .
```

**Or manually:** Just copy all `.php` files from `SipTalk/backend/` to `C:\xampp\htdocs\AeronCoffeeShop\`

---

## 🔧 Configuration

### Update React App to Use Backend

Edit these files in your React app:

**1. Login Component**
```typescript
// src/components/Login.tsx
const USE_BACKEND_API = true; // Change from false to true
const API_ENDPOINT = 'http://localhost/AeronCoffeeShop/login.php';
```

**2. Register Component**
```typescript
// src/components/Register.tsx
const USE_BACKEND_API = true;
const API_ENDPOINT = 'http://localhost/AeronCoffeeShop/register.php';
```

**3. Reservation Component**
```typescript
// src/components/Reservation.tsx
const USE_BACKEND_API = true;
const API_ENDPOINT = 'http://localhost/AeronCoffeeShop/reservation.php';
```

**Or use the centralized config:**
```typescript
// src/config/api.ts
export const API_CONFIG = {
  USE_BACKEND: true,
  BASE_URL: 'http://localhost/AeronCoffeeShop',
  // ...
};
```

---

## 📊 Database Schema

### Tables Created

1. **users** - User accounts
   - id, fullname, email, password, created_at
   
2. **reservations** - Table reservations
   - id, user_id, name, email, phone, reservation_date, reservation_time, guests, status
   
3. **contacts** - Contact form messages
   - id, name, email, message, status, created_at
   
4. **feedback** - Customer feedback
   - id, name, email, rating, message, created_at
   
5. **menu_items** (optional) - Menu items
   - id, name, category, description, price, image_url
   
6. **orders** (optional) - Customer orders
7. **order_items** (optional) - Order details

### Sample Data

The database includes sample data:
- 3 test users (password: "password123")
- Sample menu items for all categories
- Sample reservations

**Test Accounts:**
| Email | Password | Name |
|-------|----------|------|
| john@example.com | password123 | John Doe |
| jane@example.com | password123 | Jane Smith |
| admin@siptalk.com | password123 | Admin User |

---

## 🧪 Testing the Backend

### Test Database Connection

Create `test_db.php` in `C:\xampp\htdocs\AeronCoffeeShop\`:

```php
<?php
require_once 'db.php';
echo json_encode([
    'success' => true,
    'message' => 'Database connected successfully!',
    'database' => DB_NAME
]);
?>
```

Visit: `http://localhost/AeronCoffeeShop/test_db.php`

Expected output:
```json
{
  "success": true,
  "message": "Database connected successfully!",
  "database": "sip_talk_db"
}
```

### Test API Endpoints

**1. Test Registration:**
```bash
curl -X POST http://localhost/AeronCoffeeShop/register.php \
  -d "fullname=Test User&email=test@example.com&password=testpass123"
```

**2. Test Login:**
```bash
curl -X POST http://localhost/AeronCoffeeShop/login.php \
  -d "email=test@example.com&password=testpass123"
```

**3. Test Contact:**
```bash
curl -X POST http://localhost/AeronCoffeeShop/contact.php \
  -d "name=Test&email=test@example.com&message=Hello from API test"
```

---

## 🔐 Security Considerations

### For Development (Current Setup)
✅ CORS enabled for localhost:5174  
✅ Passwords hashed with bcrypt  
✅ SQL injection prevention (prepared statements)  
✅ Input sanitization  

### For Production (Before Deployment)

1. **Update CORS settings:**
```php
// Change from:
header("Access-Control-Allow-Origin: http://localhost:5174");

// To your production domain:
header("Access-Control-Allow-Origin: https://yourdomain.com");
```

2. **Disable error display:**
```php
// In db.php, change:
error_reporting(0);
ini_set('display_errors', 0);
```

3. **Use environment variables:**
```php
// Don't hardcode credentials
define('DB_PASSWORD', getenv('DB_PASSWORD'));
```

4. **Enable HTTPS**
5. **Add rate limiting**
6. **Implement CSRF protection**

---

## 📁 File Structure

```
C:\xampp\htdocs\AeronCoffeeShop\
├── SipTalk\                    # React Frontend (Vite)
│   ├── src\
│   ├── backend\                # Backend source (copy from here)
│   │   ├── db.php
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── logout.php
│   │   ├── reservation.php
│   │   ├── contact.php
│   │   └── feedback.php
│   └── database\               # Database schema
│       └── sip_talk_db.sql
│
└── (root - PHP Backend)        # XAMPP serves from here
    ├── db.php                  # ← Copy here
    ├── login.php               # ← Copy here
    ├── register.php            # ← Copy here
    ├── logout.php              # ← Copy here
    ├── reservation.php         # ← Copy here
    ├── contact.php             # ← Copy here
    └── feedback.php            # ← Copy here
```

---

## 🐛 Troubleshooting

### Issue 1: Database Connection Failed
**Error:** "Database connection failed"

**Solution:**
1. Check XAMPP MySQL is running
2. Verify database name: `sip_talk_db`
3. Check credentials in `db.php`:
   ```php
   define('DB_USERNAME', 'root');
   define('DB_PASSWORD', '');  // Empty for XAMPP default
   ```

### Issue 2: CORS Error
**Error:** "Access-Control-Allow-Origin"

**Solution:**
Update CORS headers in PHP files to match your dev server port:
```php
header("Access-Control-Allow-Origin: http://localhost:5174");
```

### Issue 3: 404 Not Found
**Error:** API endpoints return 404

**Solution:**
1. Ensure PHP files are in `C:\xampp\htdocs\AeronCoffeeShop\`
2. Check URL: `http://localhost/AeronCoffeeShop/login.php`
3. Verify Apache is running in XAMPP

### Issue 4: Session Not Working
**Error:** User logs in but session doesn't persist

**Solution:**
1. Ensure `credentials: 'include'` in fetch requests
2. Check CORS allows credentials
3. Verify session_start() in PHP files

### Issue 5: SQL Import Fails
**Error:** Error importing SQL file

**Solution:**
1. Check SQL file for syntax errors
2. Try importing tables one at a time
3. Use MySQL command line instead of phpMyAdmin

---

## 🔄 Switching Between Modes

### Development Mode (localStorage)
```typescript
const USE_BACKEND_API = false;
```
- ✅ No PHP server needed
- ✅ Quick testing
- ❌ Data not persistent across devices
- ❌ No real authentication

### Production Mode (MySQL Backend)
```typescript
const USE_BACKEND_API = true;
const API_ENDPOINT = 'http://localhost/AeronCoffeeShop/login.php';
```
- ✅ Real database
- ✅ Persistent data
- ✅ Secure authentication
- ✅ Multi-user support

---

## 📈 Database Management

### View Data in phpMyAdmin
1. Go to `http://localhost/phpmyadmin`
2. Click `sip_talk_db`
3. Browse tables to see data

### Common Queries

**See all users:**
```sql
SELECT id, fullname, email, created_at FROM users;
```

**See all reservations:**
```sql
SELECT * FROM reservations ORDER BY reservation_date DESC;
```

**See all contacts:**
```sql
SELECT * FROM contacts ORDER BY created_at DESC;
```

**See feedback with ratings:**
```sql
SELECT name, rating, message, created_at FROM feedback ORDER BY created_at DESC;
```

**Count registrations per day:**
```sql
SELECT DATE(created_at) as date, COUNT(*) as registrations 
FROM users 
GROUP BY DATE(created_at);
```

---

## ✅ Verification Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `sip_talk_db` created
- [ ] All tables created (users, reservations, contacts, feedback)
- [ ] Sample data loaded
- [ ] PHP files copied to htdocs
- [ ] Test database connection works
- [ ] CORS headers configured
- [ ] React app updated to use backend
- [ ] Can register new user
- [ ] Can login with user
- [ ] Can create reservation
- [ ] Can submit contact form
- [ ] Can submit feedback

---

## 🎉 You're Done!

Your database is now set up and ready to use!

**Next Steps:**
1. Start your React app: `npm run dev`
2. Test registration and login
3. Try making a reservation
4. Submit contact and feedback forms
5. Check phpMyAdmin to see the data

**Access Points:**
- Frontend: `http://localhost:5174`
- Backend: `http://localhost/AeronCoffeeShop/`
- phpMyAdmin: `http://localhost/phpmyadmin`

---

## 📞 Need Help?

Check the documentation:
- `README_API_SETUP.md` - API architecture
- `ROUTING_GUIDE.md` - React Router setup
- `LAB_REQUIREMENTS_CHECKLIST.md` - Project requirements

**Common Resources:**
- PHP Documentation: https://www.php.net/docs.php
- MySQL Documentation: https://dev.mysql.com/doc/
- XAMPP FAQ: https://www.apachefriends.org/faq.html

