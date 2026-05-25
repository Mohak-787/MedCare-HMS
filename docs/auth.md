# Auth API Documentation

Auth endpoints are mounted under `/api/auth`.

This module manages account registration, sign-in, password changes, password reset, and logout. Successful responses use the project `ApiResponse` format. Error responses are produced by the global error handler and return only `status` and `message`.

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
  "status": 400,
  "message": "Validation failed"
}
```

## Authentication Cookies

| Cookie | Purpose | Lifetime |
| --- | --- | --- |
| `accessToken` | Authenticates protected routes. | 5 minutes |
| `refreshToken` | Refreshes access sessions on protected routes. | 7 days |
| `tempToken` | Authorizes password reset after forgot-password OTP verification. | 3 minutes |

Cookies are `httpOnly`, `sameSite=strict`, scoped to `/`, and marked `secure` in production.

## Shared Validation Rules

Password values must be 6-100 characters and include at least one letter, one number, and one special character.

Valid genders:

```text
male
female
other
```

Valid roles:

```text
admin
doctor
nurse
pharmacist
lab_tech
patient
```

Signup accepts a `role` field during validation, but the backend currently stores all new signups as `patient`.

## Sign Up

Creates a patient account and sends a signup OTP to the submitted email address.

```http
POST /api/auth/signup
```

### Request Body

```json
{
  "fullName": "Aarav Sharma",
  "email": "aarav.sharma@example.com",
  "phone": "+9779800000000",
  "address": "Kathmandu, Nepal",
  "gender": "male",
  "password": "Secure@123",
  "confirmPassword": "Secure@123"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `fullName` | string | Yes | 3-50 characters |
| `email` | string | Yes | Valid email |
| `phone` | string | Yes | 10-15 digits, optional leading `+` |
| `address` | string | Yes | 3-255 characters |
| `gender` | string | Yes | `male`, `female`, or `other` |
| `role` | string | No | Valid role value, but ignored during creation |
| `password` | string | Yes | Must satisfy password rules |
| `confirmPassword` | string | Yes | Must match `password` |

### Success

```http
201 Created
```

```json
{
  "statusCode": 201,
  "data": null,
  "message": "Signup successful",
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
  "message": "Email is required"
}
```

Duplicate email or phone:

```http
409 Conflict
```

```json
{
  "status": 409,
  "message": "User already exists"
}
```

## Sign In

Authenticates a verified user by email or phone. On success, the backend sets `accessToken` and `refreshToken` cookies.

```http
POST /api/auth/signin
```

### Request Body

```json
{
  "credential": "aarav.sharma@example.com",
  "password": "Secure@123"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `credential` | string | Yes | Email or phone, max 100 characters |
| `password` | string | Yes | 6-100 characters |

### Success

```http
200 OK
Set-Cookie: accessToken=...
Set-Cookie: refreshToken=...
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Signin successful",
  "success": true
}
```

### Error Outcomes

Missing credential:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "Email or Phone is required"
}
```

Unverified email:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "Email verification required"
}
```

Invalid credential or password:

```http
401 Unauthorized
```

```json
{
  "status": 401,
  "message": "Invalid credentials"
}
```

## Change Password

Changes the authenticated user's password. The backend clears auth cookies and revokes the stored refresh token after a successful password change.

```http
PATCH /api/auth/change-password
```

Requires `accessToken` or a valid `refreshToken` cookie.

### Request Body

```json
{
  "oldPassword": "Secure@123",
  "newPassword": "NewSecure@456",
  "confirmPassword": "NewSecure@456"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `oldPassword` | string | Yes | Existing password, max 100 characters |
| `newPassword` | string | Yes | Must satisfy password rules |
| `confirmPassword` | string | Yes | Must match `newPassword` |

### Success

```http
200 OK
Set-Cookie: accessToken=; Max-Age=0
Set-Cookie: refreshToken=; Max-Age=0
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Password changed successfully",
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

Expired or invalid refresh session:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Invalid or expired session"
}
```

Invalid old password:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "Incorrect old password"
}
```

Validation failure example:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "New password must include at least one letter, one number, and one special character."
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

## Forgot Password

Sends a password reset OTP to the user's email address.

```http
POST /api/auth/forgot-password
```

### Request Body

```json
{
  "email": "aarav.sharma@example.com"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `email` | string | Yes | Valid email |

### Success

```http
200 OK
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "OTP sent successfully",
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
  "message": "Email is requrired"
}
```

Unknown email:

```http
404 Not Found
```

```json
{
  "status": 404,
  "message": "User not found"
}
```

## Reset Password

Resets the password after forgot-password OTP verification. This endpoint requires the `tempToken` cookie created by `POST /api/otp/verify`.

```http
PATCH /api/auth/reset-password
```

Requires `tempToken` cookie.

### Request Body

```json
{
  "newPassword": "ResetSecure@789",
  "confirmPassword": "ResetSecure@789"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `newPassword` | string | Yes | Must satisfy password rules |
| `confirmPassword` | string | Yes | Must match `newPassword` |

### Success

```http
200 OK
Set-Cookie: tempToken=; Max-Age=0
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "Password reset sucessfully",
  "success": true
}
```

### Error Outcomes

Missing temporary token:

```http
401 Unauthorized
```

```json
{
  "status": 401,
  "message": "OTP verification required"
}
```

Invalid or expired temporary token:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Invalid or expired session"
}
```

Validation failure example:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "Passwords donot match"
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

## Logout

Logs out the current user, clears auth cookies, and revokes the stored refresh token.

```http
POST /api/auth/logout
```

Requires `accessToken` or a valid `refreshToken` cookie.

### Success

```http
200 OK
Set-Cookie: accessToken=; Max-Age=0
Set-Cookie: refreshToken=; Max-Age=0
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully",
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

Expired session:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Session expired, please login again"
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

## Logout All Devices

Revokes the user's stored refresh token and clears auth cookies. The current implementation stores one refresh token per user, so this has the same persistence effect as logout.

```http
POST /api/auth/logout-all-device
```

Requires `accessToken` or a valid `refreshToken` cookie.

### Success

```http
200 OK
Set-Cookie: accessToken=; Max-Age=0
Set-Cookie: refreshToken=; Max-Age=0
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User logged out from all device successfully",
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

Expired session:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "Session expired, please login again"
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
