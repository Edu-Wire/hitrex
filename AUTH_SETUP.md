# Authentication Setup Guide

This project uses NextAuth.js with MongoDB for authentication.

## Prerequisites

1. **MongoDB Database** - You need a MongoDB database. You can use:
   - MongoDB Atlas (Free cloud database)
   - Local MongoDB installation

## Setup Steps

### 1. Get MongoDB Connection String

#### Option A: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

#### Option B: Local MongoDB

If you have MongoDB installed locally:
```
mongodb://localhost:27017/trekking-adventure
```

### 2. Create `.env.local` File

Create a file named `.env.local` in the root of your project with:

```env
MONGODB_URI=your_mongodb_connection_string_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_here
```

**To generate NEXTAUTH_SECRET:**

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use any random string generator online.

### 3. Example `.env.local`

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/trekking-adventure?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key-here
```

### 4. Start the Development Server

```bash
npm run dev
```

## Features

- ✅ User Registration (Signup)
- ✅ User Login
- ✅ User Logout
- ✅ Session Management
- ✅ Password Hashing (bcrypt)
- ✅ MongoDB Integration

## Pages

- `/login` - Login page
- `/signup` - Registration page
- Navbar shows Login/Logout based on authentication status

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Error: "Please define the MONGODB_URI environment variable"
- Make sure `.env.local` file exists in the root directory
- Check that `MONGODB_URI` is spelled correctly
- Restart the development server after creating `.env.local`

### Error: "MongoServerError: bad auth"
- Check your MongoDB username and password in the connection string
- Make sure you've whitelisted your IP address in MongoDB Atlas

### Error: "NEXTAUTH_SECRET is not defined"
- Generate a secret using `openssl rand -base64 32`
- Add it to `.env.local` file

## Security Notes

- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Use strong passwords for MongoDB
- Keep your NEXTAUTH_SECRET secure
- In production, use environment variables from your hosting platform
