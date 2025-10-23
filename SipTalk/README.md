# Sip & Talk Coffee Shop

A modern React application for a coffee shop website, converted from HTML to React with TypeScript.

## Features

- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Interactive Menu Carousel**: Showcasing different menu categories with Slick carousel
- **Contact Form**: Easy way for customers to get in touch
- **Feedback System**: Customer feedback form with rating system
- **Modal Confirmations**: Custom modal dialogs for form submissions
- **Toast Notifications**: User-friendly notifications for actions
- **Smooth Scrolling**: Navigation with smooth scroll to sections

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Slick** - Carousel component
- **CSS3** - Styling with custom properties

## Project Structure

```
Sip&Talk/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Header.tsx       # Hero section
│   │   ├── Menu.tsx         # Menu carousel
│   │   ├── Contact.tsx      # Contact form
│   │   ├── Feedback.tsx     # Feedback form
│   │   ├── About.tsx        # About section
│   │   ├── Footer.tsx       # Footer
│   │   ├── Modal.tsx        # Confirmation modal
│   │   └── Toast.tsx        # Toast notifications
│   ├── App.tsx              # Main application
│   ├── App.css              # Main styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
└── package.json             # Dependencies
```

## Getting Started

### Installation

```bash
cd "Sip&Talk"
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Components Overview

### Navbar
- Fixed navigation bar with smooth scrolling
- Links to all sections of the page

### Header
- Hero section with parallax background
- Blur effect on scroll

### Menu
- Interactive carousel displaying menu categories
- Responsive design with different slide counts based on screen size

### Contact & Feedback Forms
- Form validation
- Modal confirmation before submission
- Toast notifications for user feedback
- Automatic form reset after successful submission

### Modal & Toast
- Reusable modal component for confirmations
- Toast notifications for user actions

## Customization

### Colors

The application uses CSS custom properties defined in `App.css`:

```css
:root {
  --primary: #6f4e37;    /* Coffee brown */
  --secondary: #f3e9dc;  /* Light cream */
  --accent: #d4a373;     /* Light brown */
  --text: #3e2c1c;       /* Dark text */
  --light: #fffaf3;      /* Light background */
}
```

### Fonts

- **Playfair Display** - Headings and titles
- **Open Sans** - Body text

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2025 Sip & Talk Coffee. All rights reserved.
