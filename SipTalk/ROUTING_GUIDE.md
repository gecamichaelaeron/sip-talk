# React Router Implementation Guide

## Overview
This document explains how React Router DOM is implemented in the SipTalk Coffee Shop application.

---

## 🔧 Installation

React Router DOM has been added to the project:

```bash
npm install react-router-dom
```

**Dependency in package.json:**
```json
{
  "dependencies": {
    "react-router-dom": "^latest"
  }
}
```

---

## 🗺️ Route Structure

### Main Routes (App.tsx)

```tsx
<BrowserRouter>
  <Routes>
    {/* Standalone routes (no navbar/footer) */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    
    {/* Routes with layout (navbar + footer) */}
    <Route path="/*" element={<LayoutWithNavbar />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/menu/:category" element={<MenuPage />} />
      
      {/* Protected Route */}
      <Route 
        path="/reservation" 
        element={
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## 📍 Route Types Explained

### 1. Public Routes
Routes accessible to everyone:

- `/` - Home page
- `/about` - About page
- `/contact` - Contact page
- `/feedback` - Feedback page
- `/menu` - Menu page
- `/login` - Login page
- `/register` - Register page

### 2. Dynamic Routes
Routes with URL parameters:

**Route Definition:**
```tsx
<Route path="/menu/:category" element={<MenuPage />} />
```

**Accessing the parameter:**
```tsx
import { useParams } from 'react-router-dom';

function MenuPage() {
  const { category } = useParams<{ category: string }>();
  
  // category will be: 'cold-coffee', 'hot-coffee', etc.
  if (category === 'cold-coffee') {
    return <ColdCoffee />;
  }
  // ...
}
```

**Example URLs:**
- `/menu/cold-coffee`
- `/menu/hot-coffee`
- `/menu/dessert`
- `/menu/snacks`

### 3. Protected Routes
Routes requiring authentication:

**ProtectedRoute Component:**
```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

**Usage:**
```tsx
<Route 
  path="/reservation" 
  element={
    <ProtectedRoute>
      <ReservationPage />
    </ProtectedRoute>
  } 
/>
```

**How it works:**
1. User tries to access `/reservation`
2. ProtectedRoute checks if user is logged in
3. If yes → Show ReservationPage
4. If no → Redirect to `/login`

### 4. Nested Routes
Routes within routes:

**Structure:**
```tsx
<Route path="/*" element={<Layout />}>
  {/* Layout wraps all child routes */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<AboutPage />} />
  {/* More routes... */}
</Route>
```

**Layout Component:**
```tsx
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Child routes render here */}
      <Footer />
    </>
  );
}
```

### 5. 404 Catch-all Route
Handle undefined routes:

```tsx
<Route path="*" element={<NotFound />} />
```

This matches any route that wasn't matched by previous routes.

---

## 🔗 Navigation Components

### NavLink (for Navigation Bar)

**Features:**
- Automatically adds 'active' class to current route
- Better for navigation menus

**Implementation:**
```tsx
import { NavLink } from 'react-router-dom';

<NavLink 
  to="/" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Home
</NavLink>
```

**CSS for active state:**
```css
nav a.active {
  color: var(--light);
  border-bottom: 2px solid var(--accent);
}
```

### Link (for Regular Links)

**Features:**
- Client-side navigation without reload
- Use for buttons and regular links

**Implementation:**
```tsx
import { Link } from 'react-router-dom';

<Link to="/menu">View Menu</Link>
```

### Programmatic Navigation

**Using useNavigate hook:**
```tsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // Navigate to home after login
    navigate('/');
  };
  
  const handleGoBack = () => {
    // Go back one page in history
    navigate(-1);
  };
  
  const handleRegister = () => {
    // Navigate to register
    navigate('/register');
  };
}
```

**Common navigate patterns:**
```tsx
navigate('/path')           // Navigate to path
navigate('/path', { replace: true })  // Replace current entry
navigate(-1)                // Go back
navigate(1)                 // Go forward
```

---

## 🎯 Practical Examples

### Example 1: Menu Category Navigation

**In Home.tsx:**
```tsx
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  const handleMenuClick = (category: string) => {
    // Dynamic route navigation
    navigate(`/menu/${category}`);
  };
  
  return <Menu onMenuClick={handleMenuClick} />;
}
```

**In MenuPage.tsx:**
```tsx
import { useParams, useNavigate } from 'react-router-dom';

function MenuPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/menu');
  };
  
  if (category === 'cold-coffee') {
    return <ColdCoffee onBack={handleBack} />;
  }
  // ...
}
```

### Example 2: Login Flow

**LoginPage.tsx:**
```tsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    // After successful login, go to home
    navigate('/');
  };
  
  const handleSwitchToRegister = () => {
    // Switch to register page
    navigate('/register');
  };
  
  return (
    <Login 
      onLoginSuccess={handleLoginSuccess}
      onSwitchToRegister={handleSwitchToRegister}
    />
  );
}
```

### Example 3: Protected Reservation

**Flow:**
1. User clicks "Reservation" in navbar
2. `<NavLink to="/reservation">Reservation</NavLink>`
3. ProtectedRoute checks authentication
4. If not logged in → Redirects to `/login`
5. User logs in → Redirects to `/`
6. User clicks "Reservation" again → Now allowed

---

## 🎨 Styling Navigation

### Active Link Styling

**Navbar.tsx:**
```tsx
<NavLink 
  to="/" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Home
</NavLink>
```

**App.css:**
```css
nav a {
  color: #c7c1bb;
  text-decoration: none;
  padding: 0.5rem 0;
}

nav a.active {
  color: var(--light);
  border-bottom: 2px solid var(--accent);
}

nav a:hover {
  color: var(--light);
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Page Reloads on Click
❌ **Wrong:**
```tsx
<a href="/about">About</a>
```

✅ **Correct:**
```tsx
<NavLink to="/about">About</NavLink>
// or
<Link to="/about">About</Link>
```

### Issue 2: Navigate Not Working
❌ **Wrong:**
```tsx
// navigate is not defined
const handleClick = () => {
  navigate('/home');
};
```

✅ **Correct:**
```tsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/home');
  };
}
```

### Issue 3: Params Not Accessible
❌ **Wrong:**
```tsx
function MenuPage(props) {
  const category = props.category; // undefined
}
```

✅ **Correct:**
```tsx
import { useParams } from 'react-router-dom';

function MenuPage() {
  const { category } = useParams();
  // category is now available
}
```

### Issue 4: Protected Route Not Redirecting
❌ **Wrong:**
```tsx
function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login'; // This reloads the page!
  }
  return children;
}
```

✅ **Correct:**
```tsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
```

---

## 📚 Key Takeaways

1. ✅ Always use `<NavLink>` or `<Link>` instead of `<a>` tags
2. ✅ Use `useNavigate()` for programmatic navigation
3. ✅ Use `useParams()` to access route parameters
4. ✅ Use `<Navigate>` component for redirects
5. ✅ Wrap protected routes with authentication checks
6. ✅ Add catch-all route (`path="*"`) for 404 pages
7. ✅ Use nested routes for layouts
8. ✅ Style active links with `className` prop function

---

## 🎓 React Router Hooks Reference

| Hook | Purpose | Example |
|------|---------|---------|
| `useNavigate()` | Navigate programmatically | `navigate('/path')` |
| `useParams()` | Get URL parameters | `const { id } = useParams()` |
| `useLocation()` | Get current location | `const location = useLocation()` |
| `useSearchParams()` | Get/set query params | `const [params] = useSearchParams()` |

---

## ✅ Verification Checklist

- [x] React Router DOM installed
- [x] BrowserRouter wraps the app
- [x] Routes defined in App.tsx
- [x] NavLink used in Navbar
- [x] Dynamic routes with useParams
- [x] Protected routes implemented
- [x] 404 page for undefined routes
- [x] Programmatic navigation with useNavigate
- [x] No page reloads on navigation
- [x] Active link styling works

---

**Your SipTalk app is now a fully functional SPA with React Router! 🚀**

