# 🏆 Full-Stack Leaderboard Application

A modern, production-ready full-stack leaderboard application built with React, Node.js, Express, and MongoDB Atlas. Features real-time point claiming, user management, and a responsive dark-themed UI.

## 🚀 Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons, Vite
- **Backend**: Node.js, Express.js, Mongoose ODM
- **Database**: MongoDB Atlas
- **Development**: Concurrently, Nodemon
- **Security**: Helmet, CORS, Compression, Input Validation

## ✨ Features

### Core Functionality
- 🎯 **Point Claiming System**: Users can claim 1-10 random points with atomic transactions
- 📊 **Real-time Leaderboard**: Automatically updates after each claim with proper ranking
- 👥 **User Management**: Add new users with validation and duplicate prevention
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Dark theme with glass-morphism effects and smooth animations

### Technical Features
- 🔄 **RESTful API**: Clean endpoint structure with proper HTTP status codes
- 🛡️ **Error Handling**: Comprehensive validation, error messages, and transaction safety
- 📦 **Modular Architecture**: MVC pattern with controllers, models, and routes
- 🎭 **Loading States**: Smooth loading animations and user feedback
- 🔍 **Data Validation**: MongoDB schema validation and Mongoose middleware
- 💾 **Transaction Safety**: Atomic operations for point claiming with rollback support

## 🏗️ Project Structure

```
leaderboard-app/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── UserSelector.jsx     # User selection and addition
│   │   ├── ClaimSection.jsx     # Point claiming interface
│   │   └── Leaderboard.jsx      # Leaderboard display
│   ├── hooks/                   # Custom React hooks
│   │   ├── useUsers.js          # User management logic
│   │   └── useLeaderboard.js    # Leaderboard state management
│   ├── services/                # API service layer
│   │   └── api.js               # API client with error handling
│   └── App.tsx                  # Main application component
├── server/                      # Backend Node.js application
│   ├── config/                  # Configuration files
│   │   └── database.js          # MongoDB connection setup
│   ├── controllers/             # Business logic controllers
│   │   ├── userController.js    # User CRUD operations
│   │   ├── leaderboardController.js # Leaderboard logic
│   │   └── claimController.js   # Point claiming with transactions
│   ├── models/                  # Mongoose data models
│   │   ├── User.js              # User schema and validation
│   │   └── ClaimHistory.js      # Claim history schema
│   ├── routes/                  # API route handlers
│   │   ├── users.js             # User endpoints
│   │   ├── leaderboard.js       # Leaderboard endpoints
│   │   └── claim.js             # Claim endpoints
│   ├── utils/                   # Utility functions
│   │   └── seedDatabase.js      # Database seeding
│   └── index.js                 # Server entry point
├── .env                         # Environment variables
└── package.json                 # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account and cluster
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leaderboard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB Atlas**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leaderboard?retryWrites=true&w=majority
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Frontend Configuration
   VITE_API_URL=http://localhost:3001
   ```

   **Replace the MongoDB URI with your actual credentials:**
   - `username`: Your MongoDB Atlas username
   - `password`: Your MongoDB Atlas password
   - `cluster`: Your cluster name (e.g., cluster0.abc123.mongodb.net)

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Production Build

```bash
npm run build
npm run preview
```

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account and cluster

2. **Database Access**
   - Create a database user with read/write permissions
   - Note the username and password

3. **Network Access**
   - Add your IP address to the whitelist
   - For development, you can use `0.0.0.0/0` (not recommended for production)

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string and replace `<password>` with your actual password

### Database Collections

The application automatically creates two collections:

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, unique, 1-50 chars),
  totalPoints: Number (default: 0, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

#### ClaimHistory Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  points: Number (1-10),
  timestamp: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Users
- `GET /api/users` - Get all users sorted by points
- `POST /api/users` - Create new user
  ```json
  { "name": "John Doe" }
  ```
- `GET /api/users/:id` - Get user by ID

### Leaderboard
- `GET /api/leaderboard` - Get sorted leaderboard with ranks

### Claims
- `POST /api/claim` - Claim points for user
  ```json
  { "userId": "507f1f77bcf86cd799439011" }
  ```
- `GET /api/claim/history/:userId` - Get claim history for specific user
- `GET /api/claim/history?page=1&limit=20` - Get all claim history (paginated)

### System
- `GET /api/health` - Health check endpoint
- `GET /api/status` - Database connection status

## 📱 Responsive Design

The application uses a mobile-first approach with the following breakpoints:

- **Mobile**: < 768px - Stacked cards layout
- **Tablet**: 768px - 1024px - Hybrid layout  
- **Desktop**: > 1024px - Full grid layout

### UI Components Adaptation:
- **Leaderboard**: Table view on desktop, card view on mobile
- **User Selection**: Responsive grid (1-3 columns based on screen size)
- **Navigation**: Collapsible elements on smaller screens

## 🛡️ Security Features

### Backend Security
- **Helmet**: Security headers and XSS protection
- **CORS**: Configured for specific origins
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Sanitized error messages
- **Rate Limiting**: Built-in Express rate limiting
- **Transaction Safety**: Atomic operations with rollback

### Data Validation
- **User Names**: 1-50 characters, unique, trimmed
- **Points**: 1-10 range validation
- **MongoDB ObjectId**: Proper format validation
- **Duplicate Prevention**: Case-insensitive name checking

## 🔧 Development Features

### Custom Hooks
- `useUsers`: Manages user state and operations
- `useLeaderboard`: Handles leaderboard data and updates

### API Service
- Centralized API client with error handling
- Automatic JSON parsing and error transformation
- Environment-based URL configuration

### Database Features
- **Automatic Seeding**: 10 initial users on first run
- **Indexes**: Optimized queries for leaderboard sorting
- **Transactions**: ACID compliance for point claiming
- **Connection Pooling**: Efficient database connections

## 🚀 Deployment Guide

### Environment Variables

For production deployment, set these environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leaderboard?retryWrites=true&w=majority
PORT=3001
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com
```

### Local Development
1. Start both frontend and backend: `npm run dev`
2. Frontend available at: http://localhost:5173
3. Backend API at: http://localhost:3001

### Production Deployment

#### Backend (Node.js)
1. Deploy to platforms like Heroku, Railway, or DigitalOcean
2. Set environment variables in your hosting platform
3. Ensure MongoDB Atlas allows connections from your server IPs

#### Frontend (React)
1. Build the frontend: `npm run build`
2. Deploy to Netlify, Vercel, or serve through Express
3. Update `VITE_API_URL` to point to your production API

### MongoDB Atlas Production Setup
1. **Security**: Remove `0.0.0.0/0` from IP whitelist
2. **Add Production IPs**: Whitelist your server's IP addresses
3. **Database User**: Use strong passwords and minimal permissions
4. **Monitoring**: Enable MongoDB Atlas monitoring and alerts

## 🎯 Production-Ready Features

This application demonstrates:

- **Full-stack proficiency**: React + Node.js + MongoDB
- **Production database**: MongoDB Atlas with proper schemas
- **Modern development practices**: MVC architecture, custom hooks
- **Responsive design**: Mobile-first approach with breakpoints
- **Professional UI/UX**: Modern, clean interface with animations
- **Code quality**: Well-organized, documented, modular code
- **Error handling**: Comprehensive validation and user feedback
- **API design**: RESTful endpoints with proper status codes
- **Security**: Input validation, CORS, helmet, transactions
- **Scalability**: Indexed queries, connection pooling, pagination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add new feature'`
5. Push to the branch: `git push origin feature/new-feature`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🔗 MongoDB Atlas Connection

**For reviewers**: The MongoDB Atlas connection URI should be provided separately for security reasons. The application will automatically:

1. Connect to MongoDB Atlas using the provided URI
2. Create the required collections (Users, ClaimHistory)
3. Seed the database with 10 initial users
4. Start accepting API requests

**Database Collections Created**:
- `users` - Stores user information and total points
- `claimhistories` - Stores all point claiming transactions

**Sample Data**: The application seeds 10 users (Rahul, Kamal, Sanak, Priya, Arjun, Meera, Vikram, Ananya, Rohan, Kavya) with random initial points.