# 🚌 University Bus Tracker

A real-time bus tracking system for university transportation with secure authentication, admin management, notifications, feedback, and contact features.

## ✨ Features

### 🔐 **Authentication & User Management:**
- **Secure Login & Signup** with password hashing and JWT-based authentication
- **Role-based Access:** Student, Driver, and Admin roles with different dashboards and permissions
- **Admin Approval Flow:**
  - New users (drivers/admins) require admin approval before access
  - Pending users see a waiting-for-approval page
  - Admins can approve or reject users with notes
- **Session Management:** Automatic logout on token expiry
- **Password Show/Hide:** Eye icon to toggle password visibility on login and signup
- **Browser Autofill:** Forms support browser password managers and autofill

### 🧑‍🎓 **For Students/Users:**
- 🔍 **Search Buses** by vehicle number, route number, or source/destination
- 📍 **Real-time Location Tracking** with interactive maps
- 🕐 **Arrival Time & Status** (On Time/Delayed)
- 📬 **Contact Form:** Submit queries or issues to admin
- 💬 **Feedback Submission:** Send feedback to admin
- 🛎️ **Notifications:**
  - Receive bus status updates
  - Get notified when admin replies to contact submissions
  - See admin announcements
- **Responsive Design** for mobile and desktop

### 🧑‍💼 **For Admins:**
- 🛠️ **Admin Dashboard** with comprehensive bus management
- ➕ **Add, Edit, or Delete Buses** with detailed route information
- 📍 **Update Bus Locations** in real-time
- 🔄 **Manage Bus Status** (On Time/Delayed)
- 🗺️ **Interactive Maps** for each bus
- 👥 **User Management:**
  - View, approve, or reject pending users
  - Delete users
- 📨 **Contact Submissions:**
  - View all user contact messages
  - Reply to users (triggers notification)
  - Delete replies (removes related notifications)
- 💬 **Feedback Management:**
  - View all feedback from users
  - Delete feedback (removes related notifications)
- 🛎️ **Send Notifications:**
  - Create and delete bus or general notifications

### 🛡️ **Security & Quality:**
- **JWT Authentication** for secure API access
- **Password Hashing** using bcryptjs
- **Role-based Access Control** (Admin/Student/Driver)
- **Protected Routes** for sensitive operations
- **Automatic Redirect** to login for unauthenticated users
- **Session Management** with token validation
- **Input Validation** and error handling

## 🛠️ Tech Stack

### Frontend:
- **React.js** - User interface
- **React Router** - Navigation with protected routes
- **Axios** - HTTP client
- **Leaflet** - Interactive maps
- **CSS3** - Styling

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BUS-TRACKER
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/bus-tracker
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start backend server (in backend directory)
   npm start
   # or for development
   npm run dev

   # Start frontend (in frontend directory)
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Authentication Flow

### **User Journey:**
1. **Login Page** - Users must login first (redirects to login if not authenticated)
2. **Dashboard** - After successful login, users see their personalized dashboard
3. **Track Bus** - Click "Track UR Bus" button to access search functionality
4. **Search Results** - View bus details and real-time location tracking
5. **Navigation** - Easy navigation between dashboard, search, and results

### **Route Protection:**
- `/` → Redirects to `/dashboard` if authenticated, otherwise `/login`
- `/login` → Login page (redirects to dashboard if already authenticated)
- `/dashboard` → Protected dashboard (redirects to login if not authenticated)
- `/search` → Protected search page (redirects to login if not authenticated)
- `/results` → Protected results page (redirects to login if not authenticated)

## 📋 Sample Login Credentials

After running the seed script, you can use these credentials:

### Admin Access:
- **Email:** admin@university.edu
- **Password:** admin123

### Student Access:
- **Email:** student@university.edu
- **Password:** student123

## 🗂️ Project Structure

```
BUS TRACKER/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── busController.js
│   │   ├── contactController.js
│   │   └── feedbackController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── authorizeRole.js
│   ├── models/
│   │   ├── Bus.js
│   │   ├── Contact.js
│   │   ├── Feedback.js
│   │   ├── Notification.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── busRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── protectedRoutes.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/
│   │   │   └── bus-marker.png
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── AdminUpdateLocation.jsx
│   │   │   ├── BusMap.jsx
│   │   │   ├── DriverNavbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── (other shared components)
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── AddBus.css
│   │   │   ├── AddBus.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminFeedback.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── ContactSubmissions.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Help.jsx
│   │   │   ├── Home.css
│   │   │   ├── Home.jsx
│   │   │   ├── ManageRoutes.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── UserNotifications.jsx
│   │   │   └── WaitForApproval.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── main.css
│   │   ├── reportWebVitals.js
│   │   ├── responsive.css
│   │   └── setupTests.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── package.json
├── package-lock.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Bus Management (Admin Only)
- `GET /api/buses/all` - Get all buses
- `POST /api/buses/add-bus` - Add new bus
- `PUT /api/buses/update-location` - Update bus location
- `PUT /api/buses/update/:busNumber` - Update bus details
- `DELETE /api/buses/delete/:busNumber` - Delete bus

### Public Bus Search
- `GET /api/buses/search/vehicle` - Search by vehicle number
- `GET /api/buses/search/route` - Search by route number
- `GET /api/buses/search/source-destination` - Search by source/destination

### Protected Routes
- `GET /api/protected/dashboard-data` - Get user dashboard data
- `GET /api/protected/admin-only` - Admin-only route

## 🎯 Usage Guide

### **For Students:**
1. **Login** - Use student credentials to access the system
2. **Dashboard** - View welcome message and available actions
3. **Track Bus** - Click "Track UR Bus" button to access search functionality
4. **Search** - Use any search method to find buses
5. **View Results** - See detailed bus information with real-time location
6. **Navigate** - Use navigation buttons to move between pages

### **For Admins:**
1. **Login** - Use admin credentials to access the system
2. **Dashboard** - View welcome message and admin-specific actions
3. **Admin Panel** - Click "Admin Panel" to access bus management
4. **Manage Buses** - View all active buses and their current status
5. **Add Buses** - Use the "Add New Bus" feature to add buses to the system
6. **Update Locations** - Click "Update Location" to simulate real-time GPS updates

## 🔒 Security Features

- **JWT Authentication** for secure API access
- **Password Hashing** using bcryptjs
- **Role-based Access Control** (Admin/Student)
- **Protected Routes** for sensitive operations
- **Automatic Redirect** to login for unauthenticated users
- **Session Management** with token validation
- **Input Validation** and error handling

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel):
1. Build the project: `npm run build`
2. Deploy the `build` folder

### Backend Deployment (Heroku/Railway):
1. Set environment variables
2. Deploy the backend directory
3. Update frontend API URLs to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.

---

**Happy Tracking! 🚌✨** 