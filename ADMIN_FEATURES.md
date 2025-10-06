# Admin Panel Features - Complete Guide

## ✅ Completed Features

### 1. **Authentication System**
- User registration and login
- Admin role management
- Session-based authentication with NextAuth.js
- MongoDB integration for user data

### 2. **Admin Panel** (`/admin`)
- Dashboard with three main sections:
  - **Destinations Management**
  - **Users Management**
  - **Bookings Management**

### 3. **Destination Management** (`/admin/destinations`)
**Features:**
- ✅ Add new destinations
- ✅ Edit existing destinations
- ✅ Delete destinations
- ✅ View all destinations
- ✅ Upload destination details:
  - Name, Location, Image URL
  - Description, Date, Duration
  - Tags (for filtering)
  - Price, Difficulty level

**Public View:**
- Destinations page (`/page/destination`) shows all destinations
- Dynamic filters based on location and activity tags
- Automatic filter generation from database

### 4. **User Management** (`/admin/users`)
**Features:**
- ✅ View all registered users
- ✅ Change user roles (User ↔ Admin)
- ✅ Delete users
- ✅ Filter users by role
- ✅ View user statistics:
  - Total users count
  - Admin count
  - Regular user count
- ✅ Display user details:
  - Name, Email, Role
  - Join date

### 5. **Booking Management** (`/admin/bookings`)
**Features:**
- ✅ View all bookings
- ✅ Update booking status:
  - Pending → Confirmed → Completed
  - Can mark as Cancelled
- ✅ Update payment status:
  - Pending → Paid → Refunded
- ✅ Delete bookings
- ✅ Filter bookings by status
- ✅ View booking details:
  - Customer info (name, email, phone)
  - Destination details
  - Trek date, number of people
  - Total amount
  - Special requests

### 6. **User Booking System**

**Book Destination** (`/book/[id]`):
- Users can book any destination
- Form includes:
  - Name, Phone number
  - Number of people
  - Preferred trek date
  - Special requests
- Automatic price calculation
- Shows destination details

**My Bookings** (`/my-bookings`):
- Users can view their own bookings
- Shows booking status and payment status
- Displays all booking details
- Color-coded status indicators

### 7. **Navigation Updates**
- Admin button in navbar (only for admins)
- "My Bookings" link (only for logged-in users)
- "Book Now" button on destination cards

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "user" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Destination Model
```javascript
{
  name: String,
  location: String,
  image: String (URL),
  description: String,
  date: String,
  tags: [String],
  price: Number,
  duration: String,
  difficulty: "Easy" | "Moderate" | "Challenging" | "Difficult",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  user: ObjectId (ref: User),
  destination: ObjectId (ref: Destination),
  userName: String,
  userEmail: String,
  userPhone: String,
  numberOfPeople: Number,
  totalAmount: Number,
  bookingDate: Date,
  trekDate: String,
  status: "pending" | "confirmed" | "cancelled" | "completed",
  paymentStatus: "pending" | "paid" | "refunded",
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Access Control

### Admin Access:
- `/admin` - Admin dashboard
- `/admin/destinations` - Manage destinations
- `/admin/users` - Manage users
- `/admin/bookings` - Manage all bookings

### User Access:
- `/page/destination` - View destinations
- `/book/[id]` - Book a destination
- `/my-bookings` - View own bookings

### Public Access:
- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/create-admin` - Create admin (should be deleted after use)

## 🚀 How to Use

### For Admin:
1. **Login** with admin credentials
2. Click **"Admin"** button in navbar
3. **Manage Destinations:**
   - Add new treks
   - Edit existing ones
   - Delete unwanted destinations
4. **Manage Users:**
   - View all users
   - Promote users to admin
   - Remove users if needed
5. **Manage Bookings:**
   - View all customer bookings
   - Update booking status
   - Update payment status
   - Contact customers using their details

### For Users:
1. **Signup/Login** to the platform
2. **Browse Destinations** at `/page/destination`
3. **Use Filters** to find perfect trek
4. **Click "Book Now"** on any destination
5. **Fill Booking Form** with details
6. **View Bookings** at "My Bookings"
7. **Track Status** of bookings

## 📱 Features Summary

✅ **Authentication** - Login, Signup, Logout  
✅ **Role Management** - User & Admin roles  
✅ **Destination CRUD** - Full management  
✅ **Dynamic Filters** - Auto-generated from data  
✅ **User Management** - View, Edit, Delete  
✅ **Booking System** - Complete booking flow  
✅ **Booking Management** - Status & payment tracking  
✅ **Responsive Design** - Works on all devices  
✅ **MongoDB Integration** - Persistent data storage  

## 🔧 API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Create destination
- `GET /api/destinations/[id]` - Get single destination
- `PUT /api/destinations/[id]` - Update destination
- `DELETE /api/destinations/[id]` - Delete destination

### Bookings
- `GET /api/bookings` - Get bookings (all for admin, own for users)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get single booking
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

### Users
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Auth
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/register` - User registration
- `POST /api/register-admin` - Admin registration

## 🎯 Next Steps (Optional Enhancements)

- Add image upload functionality
- Add payment gateway integration
- Add email notifications
- Add booking confirmation emails
- Add reviews and ratings
- Add dashboard analytics
- Add export bookings to CSV
- Add search functionality
- Add booking calendar view
