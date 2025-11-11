# React.js Learning Guide for YouTube Clone

This document explains all React concepts used in this project, perfect for learning and reference.

---

## 📚 Table of Contents

1. [React Basics](#1-react-basics)
2. [Components](#2-components)
3. [JSX](#3-jsx)
4. [Props](#4-props)
5. [State (useState)](#5-state-usestate)
6. [Effects (useEffect)](#6-effects-useeffect)
7. [Context API](#7-context-api)
8. [React Router](#8-react-router)
9. [Forms](#9-forms)
10. [API Integration](#10-api-integration)
11. [Best Practices](#11-best-practices)

---

## 1. React Basics

### What is React?

React is a JavaScript library for building user interfaces. It lets you create reusable components and manage complex UIs efficiently.

**Key Features:**
- **Component-Based**: Build encapsulated components
- **Declarative**: Describe what UI should look like
- **Virtual DOM**: Efficient updates
- **One-Way Data Flow**: Predictable data flow

### Example from Project:

```jsx
// Simple functional component
function App() {
  return <div>Hello World</div>;
}
```

---

## 2. Components

Components are the building blocks of React applications. Think of them as custom HTML elements.

### Types of Components

#### Functional Components (Used in this project)
```jsx
// components/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md' }) => {
  return <div className="spinner">Loading...</div>;
};

export default LoadingSpinner;
```

### Component Features:
- ✅ Accept inputs (props)
- ✅ Return JSX (what to render)
- ✅ Can have local state
- ✅ Can have side effects

### Real Example from Project:

See `components/VideoCard.jsx`:
```jsx
const VideoCard = ({ video, layout = 'grid' }) => {
  // Component receives video data as prop
  // Returns JSX to display the video card
  return (
    <div className="video-card">
      <img src={video.thumbnail} alt={video.title} />
      <h3>{video.title}</h3>
    </div>
  );
};
```

---

## 3. JSX

JSX is a syntax extension that looks like HTML but is actually JavaScript.

### JSX Rules:

1. **Must return a single parent element**
   ```jsx
   // ❌ Wrong - multiple root elements
   return (
     <div>First</div>
     <div>Second</div>
   );

   // ✅ Correct - single parent
   return (
     <div>
       <div>First</div>
       <div>Second</div>
     </div>
   );
   ```

2. **Use className instead of class**
   ```jsx
   <div className="container">Content</div>
   ```

3. **JavaScript expressions in curly braces**
   ```jsx
   const name = "John";
   return <h1>Hello {name}</h1>;  // Hello John
   ```

4. **Self-closing tags**
   ```jsx
   <img src="photo.jpg" />
   <input type="text" />
   ```

### Example from VideoCard:
```jsx
<h3 className="text-sm font-medium line-clamp-2">
  {video.title}  {/* JavaScript expression */}
</h3>
```

---

## 4. Props

Props (properties) are how you pass data from parent to child components.

### Basic Props:

```jsx
// Parent component
<VideoCard video={videoData} layout="grid" />

// Child component receives props
const VideoCard = ({ video, layout }) => {
  return <div>{video.title}</div>;
};
```

### Props Features:
- **Read-only**: Cannot modify props in child
- **Any type**: Strings, numbers, objects, functions, etc.
- **Default values**: Can specify defaults

### Example with Default Props:

```jsx
// From LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md' }) => {
  // If no size prop provided, defaults to 'md'
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return <div className={sizeClasses[size]} />;
};
```

### Passing Functions as Props:

```jsx
// Parent
const handleDelete = (id) => {
  console.log('Delete', id);
};

<CommentSection onDelete={handleDelete} />

// Child
const CommentSection = ({ onDelete }) => {
  return <button onClick={() => onDelete(commentId)}>Delete</button>;
};
```

---

## 5. State (useState)

State is data that changes over time. When state changes, React re-renders the component.

### Basic useState:

```jsx
import { useState } from 'react';

const Counter = () => {
  // [currentValue, functionToUpdateIt] = useState(initialValue)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
```

### Multiple State Variables:

```jsx
// From Login.jsx
const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update state
  const handleChange = (e) => {
    setFormData({
      ...formData,  // Keep other fields
      [e.target.name]: e.target.value,  // Update changed field
    });
  };
};
```

### Important Rules:
1. **Never mutate state directly**
   ```jsx
   // ❌ Wrong
   user.name = "John";
   
   // ✅ Correct
   setUser({ ...user, name: "John" });
   ```

2. **State updates are asynchronous**
   ```jsx
   setCount(count + 1);
   console.log(count);  // Still old value!
   ```

3. **Use functional updates for dependent state**
   ```jsx
   // ✅ Correct
   setCount(prevCount => prevCount + 1);
   ```

---

## 6. Effects (useEffect)

useEffect runs side effects after render (API calls, subscriptions, etc.)

### Basic useEffect:

```jsx
import { useEffect, useState } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  // Runs after every render
  useEffect(() => {
    console.log('Component rendered');
  });

  // Runs only once (on mount)
  useEffect(() => {
    fetchUser();
  }, []); // Empty dependency array

  // Runs when userId changes
  useEffect(() => {
    fetchUser(userId);
  }, [userId]); // Dependency array
};
```

### Example from Home.jsx:

```jsx
const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // This runs once when component mounts
    fetchVideos();
  }, []); // Empty array = run once

  const fetchVideos = async () => {
    const response = await getHomeFeed();
    setVideos(response.data);
  };

  return (
    <div>
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};
```

### Cleanup Function:

```jsx
useEffect(() => {
  // Setup
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup (runs before unmount)
  return () => {
    clearInterval(timer);
  };
}, []);
```

### Common Use Cases:
- ✅ Fetching data
- ✅ Setting up subscriptions
- ✅ Manually changing the DOM
- ✅ Logging

---

## 7. Context API

Context provides a way to share data across components without passing props through every level.

### Creating Context:

```jsx
// context/AuthContext.jsx

// 1. Create Context
const AuthContext = createContext(null);

// 2. Create Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = async (credentials) => {
    // Login logic
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Using Context:

```jsx
// App.jsx - Wrap app with provider
<AuthProvider>
  <App />
</AuthProvider>

// Any component - Use the context
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};
```

---

## 8. React Router

React Router enables navigation without page reloads.

### Basic Setup:

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation:

```jsx
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Declarative navigation */}
      <Link to="/about">About</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  );
};
```

### URL Parameters:

```jsx
// Route definition
<Route path="/watch/:videoId" element={<Watch />} />

// Watch component
import { useParams } from 'react-router-dom';

const Watch = () => {
  const { videoId } = useParams();
  
  useEffect(() => {
    fetchVideo(videoId);
  }, [videoId]);
};
```

### Protected Routes:

```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage in App.jsx
<Route 
  path="/upload" 
  element={
    <ProtectedRoute>
      <UploadVideo />
    </ProtectedRoute>
  } 
/>
```

---

## 9. Forms

Handling forms in React with controlled components.

### Controlled Components:

Input value is controlled by React state:

```jsx
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page reload
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### Form with Object State:

```jsx
// From Register.jsx
const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,  // Computed property name
    });
  };

  return (
    <form>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
    </form>
  );
};
```

### File Uploads:

```jsx
const [file, setFile] = useState(null);
const [preview, setPreview] = useState('');

const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);

  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result);
  };
  reader.readAsDataURL(selectedFile);
};

return (
  <div>
    <input
      type="file"
      onChange={handleFileChange}
      accept="image/*"
    />
    {preview && <img src={preview} alt="Preview" />}
  </div>
);
```

---

## 10. API Integration

### Axios Setup:

```jsx
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Request interceptor - Add token
api.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
    return Promise.reject(error);
  }
);

export default api;
```

### API Service Functions:

```jsx
// services/videoService.js
import api from './api';

export const getAllVideos = async (params = {}) => {
  const response = await api.get('/videos', { params });
  return response.data;
};

export const getVideoById = async (videoId) => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};
```

### Using in Components:

```jsx
const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await getAllVideos();
      setVideos(response.data);
    } catch (err) {
      setError('Failed to load videos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {videos.map(video => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};
```

---

## 11. Best Practices

### 1. Component Organization

```
✅ One component per file
✅ Descriptive names (PascalCase)
✅ Keep components small and focused
✅ Extract reusable logic
```

### 2. State Management

```jsx
✅ Keep state as local as possible
✅ Lift state up when needed
✅ Use Context for global state
✅ Don't duplicate state
```

### 3. Performance

```jsx
// ✅ Use keys in lists
{videos.map(video => (
  <VideoCard key={video._id} video={video} />
))}

// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 4. Error Handling

```jsx
✅ Try-catch for async operations
✅ Error boundaries for component errors
✅ Show user-friendly error messages
✅ Log errors for debugging
```

### 5. Code Style

```jsx
✅ Use meaningful variable names
✅ Add comments for complex logic
✅ Keep functions small
✅ Use destructuring
✅ Consistent formatting
```

---

## 🎯 Key Takeaways

1. **Components** are the building blocks
2. **Props** pass data down
3. **State** manages changing data
4. **useEffect** handles side effects
5. **Context** shares global data
6. **Router** enables navigation
7. **Forms** use controlled components
8. **APIs** integrate with backend

---

## 📖 Next Steps

1. Build your own features
2. Experiment with different state management
3. Add more pages
4. Improve error handling
5. Add tests

---

**Happy Learning! 🚀**

*Every concept in this guide is used in the YouTube Clone project. Explore the code to see real-world examples!*
