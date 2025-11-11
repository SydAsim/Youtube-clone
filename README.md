# YouTube Clone - Full Stack Application

A full-featured YouTube clone built with **React.js** frontend and **Node.js/Express** backend. This project demonstrates modern web development practices, API integration, authentication, and state management.

![YouTube Clone](https://img.shields.io/badge/YouTube-Clone-red?style=for-the-badge&logo=youtube)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Frontend Architecture](#-frontend-architecture)
- [Learning Notes](#-learning-notes)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication
- User registration with avatar and cover image upload
- Secure login/logout with JWT tokens
- Automatic token refresh
- Protected routes

### 🎥 Video Management
- Upload videos with thumbnails
- Edit video details
- Delete videos
- Toggle publish status (public/private)
- Video player with controls
- View count tracking

### 👤 User Features
- User profiles/channels
- Channel customization (avatar, cover image)
- Watch history
- Liked videos
- Subscriptions management
- Account settings

### 💬 Social Features
- Video comments (create, edit, delete)
- Like videos, comments, and tweets
- Community posts/tweets
- Playlist management
- Subscribe to channels

### 🎨 UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark theme (YouTube-style)
- Smooth animations
- Loading states
- Error handling

---

## 🛠️ Tech Stack

### Frontend
- **React.js 19.2.0** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **js-cookie** - Cookie management
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage
- **Multer** - File uploads

---

## 📁 Project Structure

```
Youtube clone/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Auth, upload, etc.
│   │   ├── utils/             # Helper functions
│   │   ├── db/                # Database connection
│   │   ├── app.js             # Express app setup
│   │   └── index.js           # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── VideoCard.jsx
    │   │   ├── CommentSection.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Layout.jsx
    │   │
    │   ├── pages/             # Page components
    │   │   ├── Home.jsx
    │   │   ├── Watch.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Channel.jsx
    │   │   ├── UploadVideo.jsx
    │   │   ├── Settings.jsx
    │   │   ├── History.jsx
    │   │   ├── LikedVideos.jsx
    │   │   ├── Subscriptions.jsx
    │   │   ├── Playlists.jsx
    │   │   ├── Tweets.jsx
    │   │   └── MyVideos.jsx
    │   │
    │   ├── services/          # API service layer
    │   │   ├── api.js         # Axios instance with interceptors
    │   │   ├── userService.js
    │   │   ├── videoService.js
    │   │   ├── commentService.js
    │   │   ├── likeService.js
    │   │   ├── subscriptionService.js
    │   │   ├── playlistService.js
    │   │   ├── tweetService.js
    │   │   └── dashboardService.js
    │   │
    │   ├── context/           # React Context
    │   │   └── AuthContext.jsx
    │   │
    │   ├── App.jsx            # Main app with routing
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    │
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind configuration
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for media storage)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in backend root:**
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend is ready for production with PM2 or similar
```

---

## 🔌 API Endpoints

### Authentication (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |
| POST | `/accessrefreshtoken` | Refresh access token | No |
| POST | `/changepassword` | Change password | Yes |
| GET | `/getCurrentUser` | Get current user | Yes |
| PATCH | `/updateAccountDetails` | Update user details | Yes |
| PATCH | `/updateUserAvatar` | Update avatar | Yes |
| PATCH | `/updateUsercoverImage` | Update cover image | Yes |
| GET | `/c/:username` | Get channel profile | Yes |
| GET | `/history` | Get watch history | Yes |

### Videos (`/api/v1/videos`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all videos | Yes |
| POST | `/` | Upload video | Yes |
| GET | `/:videoId` | Get video by ID | Yes |
| PATCH | `/:videoId` | Update video | Yes |
| DELETE | `/:videoId` | Delete video | Yes |
| PATCH | `/toggle/publish/:videoId` | Toggle publish status | Yes |

### Comments (`/api/v1/comments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:videoId` | Get video comments | Yes |
| POST | `/:videoId` | Add comment | Yes |
| PATCH | `/c/:commentId` | Update comment | Yes |
| DELETE | `/c/:commentId` | Delete comment | Yes |

### Likes (`/api/v1/likes`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/toggle/v/:videoId` | Toggle video like | Yes |
| POST | `/toggle/c/:commentId` | Toggle comment like | Yes |
| POST | `/toggle/t/:tweetId` | Toggle tweet like | Yes |
| GET | `/videos` | Get liked videos | Yes |

### Subscriptions (`/api/v1/subscriptions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/c/:channelId` | Toggle subscription | Yes |
| GET | `/subscribed/:subscriberId` | Get subscribed channels | Yes |
| GET | `/u/:channelId` | Get channel subscribers | Yes |

### Playlists (`/api/v1/playlist`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create playlist | Yes |
| GET | `/:playlistId` | Get playlist by ID | Yes |
| PATCH | `/:playlistId` | Update playlist | Yes |
| DELETE | `/:playlistId` | Delete playlist | Yes |
| PATCH | `/add/:videoId/:playlistId` | Add video to playlist | Yes |
| PATCH | `/remove/:videoId/:playlistId` | Remove video from playlist | Yes |
| GET | `/user/:userId` | Get user playlists | Yes |

### Tweets (`/api/v1/tweets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create tweet | Yes |
| GET | `/user/:userId` | Get user tweets | Yes |
| PATCH | `/:tweetId` | Update tweet | Yes |
| DELETE | `/:tweetId` | Delete tweet | Yes |

### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/home` | Get home feed | No |
| GET | `/status` | Get channel stats | Yes |
| GET | `/video` | Get channel videos | Yes |

### Health Check (`/api/v1/healthcheck`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Check API status | No |

---

## 🏗️ Frontend Architecture

### State Management

**React Context API** is used for global state management:

- **AuthContext**: Manages user authentication state
  - User data
  - Login/logout functions
  - Token management
  - Authentication status

### API Layer

Centralized API service with Axios interceptors:

```javascript
// Automatic token attachment
// Automatic token refresh on 401
// Error handling
```

### Routing

React Router v6 with protected routes:

```javascript
// Public routes: Home, Login, Register, Watch, Channel
// Protected routes: Upload, Settings, History, etc.
```

### Component Architecture

- **Layout Components**: Navbar, Sidebar, Layout wrapper
- **UI Components**: VideoCard, LoadingSpinner, etc.
- **Page Components**: One component per route
- **Protected Components**: Wrapped with ProtectedRoute

---

## 📚 Learning Notes

This project includes extensive learning notes in the code. Key concepts covered:

### React Fundamentals
- **Components**: Functional components with hooks
- **Props**: Passing data between components
- **State**: useState for local state management
- **Effects**: useEffect for side effects
- **Context**: Global state management
- **Routing**: Client-side routing with React Router

### Advanced React
- **Custom Hooks**: useAuth hook for authentication
- **Protected Routes**: Route guards for authentication
- **Form Handling**: Controlled components and validation
- **File Uploads**: Handling images and videos
- **Conditional Rendering**: Dynamic UI based on state

### API Integration
- **Axios**: HTTP client setup
- **Interceptors**: Request/response middleware
- **Error Handling**: Try-catch and error states
- **Loading States**: UX during async operations
- **CORS**: Cross-Origin Resource Sharing with proxy

### Best Practices
- **Code Organization**: Modular file structure
- **Separation of Concerns**: Services, components, pages
- **DRY Principle**: Reusable components
- **Error Handling**: Graceful error messages
- **Loading States**: User feedback during operations

---

## 🎓 Key Learning Points

### 1. **Authentication Flow**
```
User Register → Server creates user → Returns tokens
User Login → Server validates → Returns tokens
Tokens stored in cookies → Sent with each request
Token expires → Interceptor refreshes → Request continues
```

### 2. **File Upload Flow**
```
User selects file → FormData created → Multer processes
File uploaded to Cloudinary → URL returned → Stored in DB
Frontend displays uploaded media
```

### 3. **API Communication**
```
Frontend → Axios → Vite Proxy → Backend API
Response → Axios Interceptor → Component State → UI Update
```

### 4. **State Management**
```
Global State (Auth) → Context API
Local State (Forms) → useState
Server State (API Data) → useEffect + useState
```

---

## 🔧 Development Tips

### Running Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Testing APIs

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- Browser DevTools Network tab

### Common Issues

1. **CORS Errors**: Check `CORS_ORIGIN` in backend `.env`
2. **Proxy Not Working**: Ensure Vite proxy is configured correctly
3. **Token Issues**: Clear cookies and login again
4. **File Upload Fails**: Check Cloudinary credentials

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret_here
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues
- Suggest improvements

---

## 📄 License

ISC License - Feel free to use for learning purposes

---

## 👨‍💻 Author

**Asim**

---

## 🙏 Acknowledgments

- React.js documentation
- Express.js documentation
- MongoDB documentation
- TailwindCSS
- Cloudinary

---

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Happy Learning! 🚀**

*This project is designed to teach full-stack web development concepts. Every component includes detailed comments explaining the code and concepts.*
