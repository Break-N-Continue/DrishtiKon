# API Documentation

This document provides comprehensive API documentation for the DrishtiKon backend.

## Base URL

- **Development**: `http://localhost:8080/api`
- **Production**: `https://your-domain.com/api`

## Authentication

DrishtiKon uses JWT-based authentication with email OTP verification.

### Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 🔐 Authentication Endpoints

### Send OTP

Send OTP to college email for verification.

```http
POST /auth/send-otp
```

**Request Body:**

```json
{
  "email": "student@aitpune.edu.in"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully",
    "email": "student@aitpune.edu.in",
    "expiresIn": 10
  }
}
```

**Error Responses:**

- `400` - Invalid email domain
- `429` - Too many OTP requests

---

### Verify OTP & Login

Verify OTP and receive JWT token.

```http
POST /auth/verify-otp
```

**Request Body:**

```json
{
  "email": "student@aitpune.edu.in",
  "otpCode": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "student@aitpune.edu.in",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_string"
  }
}
```

**Error Responses:**

- `400` - Invalid or expired OTP
- `404` - Email not found

---

### Refresh Token

Refresh expired JWT token.

```http
POST /auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## 📝 Posts Endpoints

### Get All Posts

Retrieve paginated list of posts.

```http
GET /posts?page=0&size=10&sort=createdAt&direction=desc
```

**Query Parameters:**

- `page` (optional, default: 0) - Page number
- `size` (optional, default: 10) - Page size
- `sort` (optional, default: createdAt) - Sort field (`createdAt`, `upvoteCount`)
- `direction` (optional, default: desc) - Sort direction (`asc`, `desc`)
- `search` (optional) - Search in title and description
- `authorId` (optional) - Filter by author ID

**Response:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "How to setup development environment?",
        "description": "I'm struggling with setting up the development environment for our project...",
        "author": {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@aitpune.edu.in"
        },
        "upvoteCount": 15,
        "isUpvotedByCurrentUser": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalPages": 5,
    "currentPage": 0,
    "totalElements": 45,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

### Get Post by ID

Retrieve specific post details.

```http
GET /posts/{id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "How to setup development environment?",
    "description": "I'm struggling with setting up the development environment for our project...",
    "author": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@aitpune.edu.in"
    },
    "upvoteCount": 15,
    "isUpvotedByCurrentUser": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**

- `404` - Post not found

---

### Create Post

Create a new post. Requires authentication.

```http
POST /posts
```

**Request Body:**

```json
{
  "title": "New Post Title",
  "description": "Detailed description of the post content..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "title": "New Post Title",
    "description": "Detailed description of the post content...",
    "author": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@aitpune.edu.in"
    },
    "upvoteCount": 0,
    "isUpvotedByCurrentUser": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Error Responses:**

- `400` - Validation errors (title too short, etc.)
- `401` - Unauthorized

---

### Update Post

Update existing post. Only post author can update.

```http
PUT /posts/{id}
```

**Request Body:**

```json
{
  "title": "Updated Post Title",
  "description": "Updated description content..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 10,
    "title": "Updated Post Title",
    "description": "Updated description content...",
    "author": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@aitpune.edu.in"
    },
    "upvoteCount": 5,
    "isUpvotedByCurrentUser": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  }
}
```

**Error Responses:**

- `403` - Not post owner
- `404` - Post not found

---

### Delete Post

Delete post. Only post author or admin can delete.

```http
DELETE /posts/{id}
```

**Response:**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Error Responses:**

- `403` - Not authorized to delete
- `404` - Post not found

---

## 👍 Upvote Endpoints

### Toggle Upvote

Upvote or remove upvote from post.

```http
POST /posts/{id}/upvote
```

**Response:**

```json
{
  "success": true,
  "data": {
    "upvoted": true,
    "upvoteCount": 16
  }
}
```

**Error Responses:**

- `404` - Post not found
- `401` - Unauthorized

---

### Get User's Upvotes

Get all posts upvoted by current user.

```http
GET /users/me/upvotes?page=0&size=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "How to setup development environment?",
        "description": "I'm struggling with...",
        "author": {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@aitpune.edu.in"
        },
        "upvoteCount": 15,
        "isUpvotedByCurrentUser": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "totalPages": 2,
    "currentPage": 0,
    "totalElements": 12
  }
}
```

---

## 👤 User Endpoints

### Get Current User Profile

Get authenticated user's profile.

```http
GET /users/me
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@aitpune.edu.in",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "totalPosts": 15,
    "totalUpvotesReceived": 120,
    "totalUpvotesGiven": 45
  }
}
```

---

### Get Dashboard Stats

Get user dashboard statistics.

```http
GET /users/me/dashboard
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalPosts": 15,
    "totalUpvotesReceived": 120,
    "totalUpvotesGiven": 45,
    "recentPosts": [
      {
        "id": 10,
        "title": "Latest Post",
        "upvoteCount": 5,
        "createdAt": "2024-01-15T11:00:00Z"
      }
    ],
    "recentUpvotes": [
      {
        "id": 1,
        "title": "Upvoted Post",
        "author": {
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "upvoteCount": 15,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### Update Profile

Update user profile information.

```http
PUT /users/me
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@aitpune.edu.in",
    "firstName": "John",
    "lastName": "Smith",
    "role": "USER"
  }
}
```

---

## 🛡️ Admin Endpoints

### Get All Users (Admin Only)

Get paginated list of all users.

```http
GET /admin/users?page=0&size=20
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "john@aitpune.edu.in",
        "firstName": "John",
        "lastName": "Doe",
        "role": "USER",
        "emailVerified": true,
        "createdAt": "2024-01-10T09:00:00Z"
      }
    ],
    "totalPages": 3,
    "currentPage": 0,
    "totalElements": 55
  }
}
```

---

### Delete User (Admin Only)

Delete user account.

```http
DELETE /admin/users/{userId}
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 📊 Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field1": ["Validation error message"],
    "field2": ["Another validation error"]
  },
  "timestamp": "2024-01-15T12:00:00Z",
  "path": "/api/posts"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## 📈 Rate Limiting

### OTP Requests

- **Limit**: 3 requests per email per hour
- **Response**: 429 Too Many Requests

### API Requests

- **Limit**: 100 requests per user per minute
- **Response**: 429 Too Many Requests

---

## 🔍 Search & Filtering

### Post Search

```http
GET /posts?search=development&sort=upvoteCount&direction=desc
```

### Advanced Filtering

```http
GET /posts?authorId=5&sort=createdAt&direction=asc&page=1&size=5
```

---

## 📱 Webhook Events (Future)

### Post Created

```json
{
  "event": "post.created",
  "data": {
    "postId": 10,
    "authorId": 1,
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

### Post Upvoted

```json
{
  "event": "post.upvoted",
  "data": {
    "postId": 1,
    "userId": 5,
    "newUpvoteCount": 16,
    "timestamp": "2024-01-15T11:30:00Z"
  }
}
```
