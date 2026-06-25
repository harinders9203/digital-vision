# Digital Vision - Setup & Running Guide

## Overview
Digital Vision is a web application with an admin dashboard that requires authentication. The admin panel uses JWT-based session management with bcrypt password hashing for security.

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- Windows, macOS, or Linux

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
The `.env` file has already been created with the following credentials:

```
ADMIN_USER=admin
ADMIN_PASS=$2a$12$k.Dgd9Q7IMj/VC3yJETTxOjGRh9gUeyZL9LGXJTK8A//iJZJmhPPK (password: DigitalVision@2026!)
JWT_SECRET=DigitalVision_SecureKey_2026_EnhancedSecurity
JWT_EXPIRES_IN_SECONDS=7200
```

**⚠️ Important:** Keep the `.env` file secure and never commit it to version control. It contains sensitive information.

### 3. Running the Application

#### Option A: Using HTTP Server (Recommended for Development)
```bash
npx http-server -p 3000 -c-1
```

The application will be available at: **http://127.0.0.1:3000**

#### Option B: Using Node.js HTTP Module
```bash
npm start
```
(If you have a start script configured in package.json)

### 4. Accessing the Admin Dashboard

1. Open your browser and navigate to: **http://127.0.0.1:3000/admin.html**
2. Login with the following credentials:
   - **Username:** `admin`
   - **Password:** `DigitalVision@2026!`
3. After successful authentication, you'll be redirected to the admin dashboard at `/admin`

## Project Structure

```
digital-vision/
├── index.html                 # Homepage
├── admin.html                 # Admin login page
├── admin.css                  # Admin styling
├── admin-login.js             # Login form handler (frontend)
├── admin-editor.js            # Admin editor functionality
├── api/
│   ├── admin.js               # Admin dashboard API endpoint
│   ├── auth/
│   │   ├── login.js           # Login endpoint
│   │   ├── logout.js          # Logout endpoint
│   │   └── me.js              # Get current session info
│   └── _lib/
│       ├── auth.js            # Authentication utilities
│       ├── config.js          # Configuration handler
│       ├── http.js            # HTTP utilities
│       └── rate-limit.js      # Rate limiting
├── img/                       # Images and assets
├── package.json               # Project dependencies
├── vercel.json                # Vercel deployment config
├── .env                       # Environment variables (keep secret!)
└── .env.example               # Example environment template
```

## Authentication Flow

1. **User Login** → User submits username/password on `/admin.html`
2. **Backend Validation** → Server validates against bcrypt hash in `/api/auth/login`
3. **JWT Token Creation** → On success, JWT token is created
4. **Session Cookie** → Token stored in secure HTTP-only cookie
5. **Dashboard Access** → User redirected to `/admin` with authenticated session
6. **Logout** → User can clear session via `/api/auth/logout`
7. **Session Verification** → `/api/auth/me` endpoint returns current user info

## Security Features

✅ **Bcrypt Password Hashing** - Passwords hashed with bcrypt (not stored in plaintext)
✅ **JWT Token Authentication** - Session tokens use JWT for stateless auth
✅ **Rate Limiting** - Login attempts are rate-limited to prevent brute force attacks
✅ **Secure Cookies** - Session cookies are HTTP-only and same-origin
✅ **Content Security Policy** - CSP headers configured for admin pages
✅ **CSRF Protection** - Same-origin request requirements

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current authenticated user info

### Admin
- `GET /api/admin` - Get admin dashboard data (requires authentication)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `ADMIN_USER` | Admin username | `admin` |
| `ADMIN_PASS` | Bcrypt hash of admin password | `$2a$12$...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN_SECONDS` | JWT token expiration time | `7200` (2 hours) |

## Changing Credentials

### To Change the Admin Password:

1. Generate a new bcrypt hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-new-password', 12))"
```

2. Replace the `ADMIN_PASS` value in `.env` with the new hash

3. Restart the server

### To Change the Username:
1. Update `ADMIN_USER` value in `.env`
2. Restart the server

## Troubleshooting

### Login page won't load
- Ensure the server is running on port 3000
- Check that `/admin.html` exists in the project root
- Clear browser cache (Ctrl+Shift+Delete)

### Login fails with "Invalid credentials"
- Verify username matches `ADMIN_USER` in `.env`
- Verify password matches the original password used to generate the bcrypt hash
- Check that `.env` file exists and has correct values
- Restart the server after `.env` changes

### Session expires too quickly
- Check `JWT_EXPIRES_IN_SECONDS` in `.env` (default is 7200 = 2 hours)
- Increase the value if needed (in seconds)

### Rate limiting blocks login attempts
- The system limits login attempts to prevent brute force attacks
- Wait a few moments before retrying
- Rate limits are reset per IP and username combination

## Stopping the Server

Press **`Ctrl+C`** in the terminal where the server is running.

## Next Steps

1. ✅ Dependencies installed
2. ✅ Environment variables configured
3. ✅ Server running on port 3000
4. ✅ Admin credentials set up
5. 📝 Build additional features or deploy to Vercel

## Deployment

This project is configured for Vercel deployment:
```bash
vercel deploy
```

Refer to [Vercel documentation](https://vercel.com/docs) for detailed deployment instructions.

## Support

For issues or questions, refer to the API files in the `/api` directory or the main `README.md` file.
