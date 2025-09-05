# PollStore API Documentation

## Overview

The PollStore API provides RESTful endpoints for managing polls, users, and analytics. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL:** `https://api.pollstore.com/v1`  
**Authentication:** Bearer Token (JWT)  
**Content-Type:** `application/json`

## Authentication

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

## Poll Management

### Get All Polls
```http
GET /api/polls
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (active, completed, draft)
- `search` (optional): Search in title and description
- `sortBy` (optional): Sort field (createdAt, totalVotes, title)
- `sortOrder` (optional): Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "polls": [
      {
        "id": "uuid",
        "title": "What's your favorite programming language?",
        "description": "Help us understand community preferences",
        "creatorId": "uuid",
        "pollType": "multiple_choice",
        "isAnonymous": true,
        "isPublic": true,
        "status": "active",
        "totalVotes": 120,
        "options": [
          {
            "id": "uuid",
            "text": "JavaScript",
            "votes": 45,
            "percentage": 37.5
          }
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "expiresAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Create Poll
```http
POST /api/polls
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "What's your favorite framework?",
  "description": "Share your experience with modern frameworks",
  "pollType": "multiple_choice",
  "isAnonymous": true,
  "isPublic": true,
  "expiresAt": "2024-12-31T23:59:59Z",
  "options": [
    "React",
    "Vue",
    "Angular",
    "Svelte"
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "poll": {
      "id": "uuid",
      "title": "What's your favorite framework?",
      "description": "Share your experience with modern frameworks",
      "creatorId": "uuid",
      "pollType": "multiple_choice",
      "isAnonymous": true,
      "isPublic": true,
      "status": "active",
      "totalVotes": 0,
      "options": [
        {
          "id": "uuid",
          "text": "React",
          "votes": 0,
          "percentage": 0
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  }
}
```

### Get Single Poll
```http
GET /api/polls/:id
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "poll": {
      "id": "uuid",
      "title": "What's your favorite programming language?",
      "description": "Help us understand community preferences",
      "creatorId": "uuid",
      "creator": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "Doe"
      },
      "pollType": "multiple_choice",
      "isAnonymous": true,
      "isPublic": true,
      "status": "active",
      "totalVotes": 120,
      "options": [
        {
          "id": "uuid",
          "text": "JavaScript",
          "votes": 45,
          "percentage": 37.5
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "expiresAt": null,
      "userVote": null
    }
  }
}
```

### Update Poll
```http
PUT /api/polls/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated poll title",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "poll": {
      // Updated poll object
    }
  }
}
```

### Delete Poll
```http
DELETE /api/polls/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Poll deleted successfully"
}
```

### Vote on Poll
```http
POST /api/polls/:id/vote
```

**Request Body:**
```json
{
  "optionId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "vote": {
      "id": "uuid",
      "pollId": "uuid",
      "optionId": "uuid",
      "userId": "uuid",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "poll": {
      // Updated poll with new vote counts
    }
  }
}
```

## User Management

### Get User Profile
```http
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatarUrl": "https://example.com/avatar.jpg",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z",
      "stats": {
        "pollsCreated": 5,
        "totalVotes": 150,
        "pollsVoted": 25
      }
    }
  }
}
```

### Update User Profile
```http
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      // Updated user object
    }
  }
}
```

### Get User's Polls
```http
GET /api/users/polls
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "polls": [
      // Array of user's polls
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Get User's Voting History
```http
GET /api/users/votes
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "votes": [
      {
        "id": "uuid",
        "pollId": "uuid",
        "optionId": "uuid",
        "poll": {
          "id": "uuid",
          "title": "Poll title",
          "status": "active"
        },
        "option": {
          "id": "uuid",
          "text": "Selected option"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

## Analytics

### Get Dashboard Analytics
```http
GET /api/analytics/dashboard
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPolls": 50,
      "activePolls": 35,
      "totalVotes": 1250,
      "avgVotesPerPoll": 25
    },
    "recentActivity": [
      {
        "type": "poll_created",
        "pollId": "uuid",
        "pollTitle": "New poll title",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "topPolls": [
      {
        "id": "uuid",
        "title": "Most popular poll",
        "totalVotes": 500,
        "createdAt": "2024-01-10T10:30:00Z"
      }
    ],
    "votingTrends": [
      {
        "date": "2024-01-15",
        "votes": 45
      }
    ]
  }
}
```

### Get Poll Analytics
```http
GET /api/analytics/polls/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "poll": {
      // Basic poll information
    },
    "analytics": {
      "totalVotes": 120,
      "votingRate": 0.75,
      "averageTimeToVote": 45,
      "demographics": {
        "ageGroups": [
          {
            "range": "18-24",
            "count": 30,
            "percentage": 25
          }
        ],
        "locations": [
          {
            "country": "US",
            "count": 50,
            "percentage": 41.7
          }
        ]
      },
      "votingPattern": [
        {
          "hour": 0,
          "votes": 5
        }
      ],
      "optionPerformance": [
        {
          "optionId": "uuid",
          "text": "JavaScript",
          "votes": 45,
          "percentage": 37.5,
          "trend": "increasing"
        }
      ]
    }
  }
}
```

### Export Poll Data
```http
GET /api/analytics/export/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `format` (required): Export format (csv, pdf, json)
- `includeAnalytics` (optional): Include analytics data (default: false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://api.pollstore.com/downloads/poll-export-uuid.csv",
    "expiresAt": "2024-01-15T11:30:00Z"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {
      // Additional error details (optional)
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400): Request validation failed
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (e.g., duplicate email)
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "fields": {
        "email": "Email is required",
        "password": "Password must be at least 8 characters"
      }
    }
  }
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute per IP
- **Poll creation**: 10 polls per hour per user
- **Voting**: 100 votes per hour per IP
- **General API**: 1000 requests per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Webhooks

PollStore supports webhooks for real-time notifications:

### Webhook Events

- `poll.created`: New poll created
- `poll.updated`: Poll updated
- `poll.deleted`: Poll deleted
- `poll.vote`: New vote received
- `poll.completed`: Poll reached completion criteria

### Webhook Payload Example

```json
{
  "event": "poll.vote",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "poll": {
      "id": "uuid",
      "title": "Poll title"
    },
    "vote": {
      "id": "uuid",
      "optionId": "uuid",
      "userId": "uuid"
    }
  }
}
```

## SDKs and Libraries

Official SDKs are available for:
- JavaScript/Node.js
- Python
- PHP
- Ruby

Example usage (JavaScript):
```javascript
import PollStore from '@pollstore/sdk'

const client = new PollStore({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.pollstore.com/v1'
})

const polls = await client.polls.list()
```

---

**API Version:** v1  
**Last Updated:** September 2025  
**Support:** api-support@pollstore.com
