# 🚀 Quick Start Guide - Database Setup

## Super Fast Setup (5 Minutes)

### 1️⃣ Start XAMPP
- Open XAMPP Control Panel
- Click "Start" for **Apache**
- Click "Start" for **MySQL**

### 2️⃣ Create Database
1. Open browser → `http://localhost/phpmyadmin`
2. Click **"New"** → Database name: `sip_talk_db`
3. Click **"Import"** tab
4. Choose file: `SipTalk/database/sip_talk_db.sql`
5. Click **"Go"**
6. ✅ Done!

### 3️⃣ Copy Backend Files

**Windows PowerShell:**
```powershell
cd C:\xampp\htdocs\AeronCoffeeShop
Copy-Item SipTalk\backend\* . -Force
```

**Or manually copy** all `.php` files from:
- FROM: `C:\xampp\htdocs\AeronCoffeeShop\SipTalk\backend\`
- TO: `C:\xampp\htdocs\AeronCoffeeShop\`

### 4️⃣ Test It

Open in browser: `http://localhost/AeronCoffeeShop/login.php`

You should NOT see errors.

### 5️⃣ Start React App
```bash
cd SipTalk
npm run dev
```

Open `http://localhost:5174`

---

## ✅ Quick Test

### Test Login (with sample data)
1. Go to Login page
2. Email: `john@example.com`
3. Password: `password123`
4. Click Login
5. ✅ Should work!

### Test Registration
1. Go to Register page
2. Fill in your details
3. Click Register
4. ✅ Should create account!

---

## 🎯 Using Backend vs localStorage

### Option 1: Use Backend (Database)
In each component, set:
```typescript
const USE_BACKEND_API = true;
```

Files to update:
- `src/components/Login.tsx`
- `src/components/Register.tsx`
- `src/components/Reservation.tsx`

### Option 2: Use localStorage (No Database)
In each component, set:
```typescript
const USE_BACKEND_API = false;
```

Good for testing without PHP!

---

## 📊 View Your Data

**phpMyAdmin:** `http://localhost/phpmyadmin`

Click `sip_talk_db` → Click table name to see data:
- **users** - All registered users
- **reservations** - All reservations
- **contacts** - Contact messages
- **feedback** - Customer feedback

---

## 🐛 Problems?

### Database connection failed
- ✅ Check MySQL is running in XAMPP
- ✅ Database name is `sip_talk_db`

### 404 Not Found
- ✅ PHP files are in `C:\xampp\htdocs\AeronCoffeeShop\`
- ✅ Apache is running

### CORS Error
- ✅ Update port in PHP files if needed
- ✅ Check CORS headers match your React dev server port

---

## 📁 File Locations

```
Project Structure:
C:\xampp\htdocs\AeronCoffeeShop\
├── SipTalk\               React App (npm run dev)
│   ├── backend\           PHP source files
│   └── database\          SQL file
│
└── *.php                  PHP backend (copy here)
```

---

## 🎉 That's It!

Your database is ready!

**See full documentation:**
- `DATABASE_SETUP.md` - Detailed setup guide
- `README_API_SETUP.md` - API architecture

