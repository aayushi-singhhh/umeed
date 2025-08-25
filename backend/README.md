# Umeed Backend API

A comprehensive MERN stack backend for the Umeed learning disabilities support platform.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for children, parents, teachers, and admins
- **Exercise System**: Create, assign, and track educational exercises
- **Progress Tracking**: Detailed analytics and progress monitoring
- **Community Forum**: Safe space for parents, teachers, and admins to collaborate
- **Notifications**: Real-time notifications for important events
- **Security**: Rate limiting, input validation, and secure password hashing

## User Roles & Permissions

### Child
- Access assigned exercises
- Submit exercise responses
- View personal progress dashboard
- Read-only access to community (filtered content)

### Parent
- Create and manage child accounts
- View children's progress and analytics
- Participate in community discussions
- Receive notifications about child progress

### Teacher
- Create and assign exercises
- View student progress across all assigned children
- Participate in community discussions
- Manage classroom assignments

### Admin
- Full system access
- User management capabilities
- Content moderation in community
- System analytics and monitoring

## Database Schema

### Collections

1. **users** - User accounts (all roles)
2. **children_profiles** - Extended profiles for child users
3. **exercises** - Educational exercises and activities
4. **child_exercise_progress** - Progress tracking for assignments
5. **community_posts** - Forum posts and discussions
6. **notifications** - User notifications

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user (parent/teacher/admin)
- `POST /login` - User login
- `POST /create-child` - Create child account
- `GET /me` - Get current user info
- `PUT /change-password` - Update password

### Users (`/api/users`)
- `GET /children` - Get linked children
- `GET /child/:childId` - Get specific child details
- `PUT /child/:childId` - Update child profile
- `POST /link-child` - Link child to parent/teacher
- `DELETE /unlink-child/:childId` - Unlink child

### Exercises (`/api/exercises`)
- `GET /` - Get exercises (with filtering)
- `GET /:id` - Get specific exercise
- `POST /` - Create exercise (teacher/admin)
- `PUT /:id` - Update exercise
- `DELETE /:id` - Deactivate exercise
- `POST /assign` - Assign exercise to child

### Progress (`/api/progress`)
- `GET /child/:childId` - Get child's progress
- `GET /:progressId` - Get specific progress record
- `POST /:progressId/start` - Start exercise
- `POST /:progressId/submit` - Submit exercise responses
- `GET /analytics/child/:childId` - Get detailed analytics

### Community (`/api/community`)
- `GET /posts` - Get community posts
- `GET /posts/:id` - Get specific post with replies
- `POST /posts` - Create new post
- `POST /posts/:id/reply` - Reply to post
- `POST /posts/:id/like` - Like/unlike post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Moderate post (admin)

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `GET /unread-count` - Get unread count
- `PUT /:id/read` - Mark as read
- `PUT /mark-all-read` - Mark all as read
- `DELETE /:id` - Delete notification

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/umeed
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:5174
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

### Production Deployment

1. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-secret
   FRONTEND_URL=your-production-frontend-url
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Prevents abuse and DoS attacks
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Role-based Access Control**: Fine-grained permissions

## Data Protection

- **Child Safety**: Children cannot create accounts independently
- **Access Control**: Strict permissions for child data access
- **Content Moderation**: Admin tools for community management
- **Privacy**: Minimal data collection with clear purposes

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling and validation
3. Include appropriate middleware for authentication/authorization
4. Write clear commit messages
5. Test all endpoints before submitting

## API Testing

You can test the API using tools like:
- Postman
- Insomnia
- curl
- VS Code REST Client

Example request:
```bash
# Register a new parent
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "parent"
  }'
```

## License

MIT License - see LICENSE file for details
