# User API Documentation

User endpoints are mounted under `/api/user`.

This module manages the authenticated user's profile. All endpoints require an `accessToken` cookie or a valid `refreshToken` cookie. Successful responses use the project `ApiResponse` format. Error responses are produced by the global error handler and return only `status` and `message`.

## Response Contracts

Successful response shape:

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Operation successful",
  "success": true
}
```

Error response shape:

```json
{
  "status": 401,
  "message": "Sign in required"
}
```

## Authentication Behavior

Protected user routes automatically try to refresh the session when the access token is missing or expired. Refresh succeeds only when the `refreshToken` cookie is present, valid, matches the stored user refresh token, and has not expired.

When refresh succeeds, the API sets a new `accessToken` cookie and continues the original request.

## Get Current User

Returns the authenticated user's profile.

```http
GET /api/user/info
```

### Success

```http
200 OK
```

```json
{
  "statusCode": 200,
  "data": {
    "id": "3e16e58e-8a3a-4db4-8b67-dc4b8576c111",
    "fullName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "+9779800000000",
    "gender": "male",
    "isVerified": true,
    "address": "Kathmandu, Nepal",
    "profilePicture": null,
    "role": "patient",
    "createdAt": "2026-05-25T00:00:00.000Z",
    "updatedAt": "2026-05-25T00:00:00.000Z"
  },
  "message": "User information fecthed successfully",
  "success": true
}
```

### Error Outcomes

Missing authentication:

```http
401 Unauthorized
```

```json
{
  "status": 401,
  "message": "Sign in required"
}
```

Expired refresh token:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Session expired, please login again"
}
```

Invalid stored session:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Invalid or expired session"
}
```

User no longer exists:

```http
404 Not Found
```

```json
{
  "statusCode": 404,
  "message": "User information fecthed successfully",
  "success": false
}
```

This response is produced by the controller's normal `ApiResponse` path because `GET /api/user/info` only throws for internal response DTO validation failures.

Response serialization failure:

```http
500 Internal Server Error
```

```json
{
  "status": 500,
  "message": "Internal Server Error"
}
```

## Update Current User

Updates fields on the authenticated user's profile.

```http
PATCH /api/user
```

### Request Body

All fields are optional. Unknown fields are rejected.

```json
{
  "fullName": "Aarav R. Sharma",
  "address": "Lalitpur, Nepal"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `fullName` | string | No | 3-50 characters |
| `email` | string | No | Valid email |
| `phone` | string | No | 10-15 digits, optional leading `+` |
| `address` | string | No | 3-255 characters |
| `gender` | string | No | `male`, `female`, or `other` |

### Success

```http
200 OK
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User information updated successfully",
  "success": true
}
```

### Error Outcomes

Validation failure example:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "Phone must be valid"
}
```

Unknown field example:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "property unknownField should not exist"
}
```

Missing authentication:

```http
401 Unauthorized
```

```json
{
  "status": 401,
  "message": "Sign in required"
}
```

User no longer exists:

```http
404 Not Found
```

```json
{
  "status": 404,
  "message": "User not found"
}
```

Invalid or expired session:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Invalid or expired session"
}
```

## Delete Current User

Deletes the authenticated user account.

```http
DELETE /api/user
```

### Success

```http
200 OK
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User deleted successfully",
  "success": true
}
```

### Error Outcomes

Missing authentication:

```http
401 Unauthorized
```

```json
{
  "status": 401,
  "message": "Sign in required"
}
```

User no longer exists:

```http
404 Not Found
```

```json
{
  "status": 404,
  "message": "User not found"
}
```

Invalid or expired session:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Invalid or expired session"
}
```
