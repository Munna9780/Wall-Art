# Luxury Wall Arts Gallery

A premium website for showcasing and selling luxury wall art through affiliate links.

## Features

- Beautiful, responsive luxury-themed design
- Gallery of premium wall art products
- Size options and Amazon affiliate links for each product
- Admin panel for managing products (adding/removing wall arts)
- Admin authentication system for secure access
- Local storage for persistent data

## Getting Started

### Direct File Access (May have limitations)

You can directly open the `index.html` file in your browser, but you may encounter issues with:
- Cross-Origin Resource Sharing (CORS) errors
- LocalStorage access restrictions
- Admin functionality limitations

### Recommended: Using the Local Server

For the best experience, especially when using the admin panel, use the included Node.js server:

1. **Prerequisites**:
   - Make sure you have [Node.js](https://nodejs.org/) installed on your system.

2. **Starting the server**:
   - Open a terminal or command prompt
   - Navigate to the project directory
   - Run the following command:
     ```
     node server.js
     ```
   - The server will start on port 3000
   - You should see a message: `Server running at http://localhost:3000/`

3. **Access the website**:
   - Open your browser and go to: `http://localhost:3000/`
   - For the admin page: `http://localhost:3000/admin.html`

## Admin Access

- **URL**: `http://localhost:3000/admin.html`
- **Username**: `admin`
- **Password**: `password123`

## Folder Structure

- `index.html` - Main website
- `admin.html` - Admin panel
- `styles.css` - Stylesheet
- `script.js` - JavaScript for main functionality
- `server.js` - Simple Node.js server for local development
- `404.html` - Custom 404 error page
- `admin-redirect.html` - Helper page for admin access

## Notes

- All product data is stored in the browser's localStorage
- The admin credentials are hard-coded for demonstration purposes only
- In a production environment, consider:
  - Using proper authentication with backend storage
  - Implementing HTTPS for secure data transmission
  - Using a more robust server solution 