# OTP API Documentation

OTP endpoints are mounted under `/api/otp`.

This module verifies and resends one-time passwords for signup verification and forgot-password flows. Successful responses use the project `ApiResponse` format. Error responses are produced by the global error handler and return only `status` and `message`.

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

## OTP Rules

- OTP values are 6 numeric digits.
- OTP values expire after 2 minutes.
- Signup OTP verification marks the user as verified.
- Forgot-password OTP verification sets a short-lived `tempToken` cookie.
- `POST /api/otp/resend` requires an active OTP purpose already stored for the user.

## Verify OTP

Verifies a submitted OTP for an email address.

```http
POST /api/otp/verify
```

### Request Body

```json
{
  "email": "aarav.sharma@example.com",
  "otp": "123456"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `email` | string | Yes | Valid email |
| `otp` | string | Yes | Exactly 6 numeric digits |

### Success: Signup OTP

When the active OTP purpose is signup, the user is marked as verified.

```http
200 OK
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User verification successful",
  "success": true
}
```

### Success: Forgot-Password OTP

When the active OTP purpose is forgot password, the API returns the same JSON body and sets a `tempToken` cookie for password reset.

```http
200 OK
Set-Cookie: tempToken=...
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "User verification successful",
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
  "message": "OTP must be 6 digits"
}
```

Incorrect OTP:

```http
400 Bad Request
```

```json
{
  "statusCode": 400,
  "data": null,
  "message": "User verification successful",
  "success": false
}
```

This response is produced by the controller's normal `ApiResponse` path because the current controller does not throw an error for an incorrect OTP result.

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

Expired or missing active OTP:

```http
419 Session Expired
```

```json
{
  "status": 419,
  "message": "OTP expired"
}
```

Unsupported OTP purpose or server failure:

```http
500 Internal Server Error
```

```json
{
  "status": 500,
  "message": "Internal Server Error"
}
```

## Resend OTP

Sends a new OTP for the user's current active OTP purpose.

```http
POST /api/otp/resend
```

### Request Body

```json
{
  "email": "aarav.sharma@example.com"
}
```

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `email` | string | Yes | Expected to be a registered email |

### Success

```http
200 OK
```

```json
{
  "statusCode": 200,
  "data": null,
  "message": "OTP resent successfully",
  "success": true
}
```

### Error Outcomes

No active OTP purpose:

```http
400 Bad Request
```

```json
{
  "status": 400,
  "message": "Invalid request, Try again later"
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

Email send or server failure:

```http
500 Internal Server Error
```

```json
{
  "status": 500,
  "message": "Internal Server Error"
}
```
