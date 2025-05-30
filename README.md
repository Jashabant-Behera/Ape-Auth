# Ape-Auth 🦍

Ape-Auth is a full-stack authentication system built with a custom backend and modern frontend. It provides essential authentication features such as user signup, login, logout, email verification via OTP, password reset, and protected route access using JWT.

Features ✅

- User registration and login with email and password
- Email verification using OTP system
- JWT-based authentication with cookies
- Persistent login using token storage and verification
- Forgot password and reset functionality with OTP
- Middleware to protect private routes
- Basic profile access and session checking

Tech Stack 🛠️

Frontend:
- React.js
- Tailwind CSS
- Axios for API communication

Backend:
- Node.js
- Express.js
- JWT (jsonwebtoken) for secure token-based auth
- Nodemailer for sending OTP via email
- dotenv for environment variables
- bcrypt for password hashing
- cookie-parser for handling cookies

Project Structure 📁

/client
- Frontend React app with pages like Login, Signup, Dashboard, etc.
/server
- Express backend with routes, controllers, middleware, and auth logic

Installation 🚀

1. Clone the repository
   git clone https://github.com/Jashabant-Behera/Ape-Auth.git
   cd Ape-Auth

2. Install dependencies

   For client:
   cd client
   npm install
   npm run dev

   For server:
   cd server
   npm install
   node index.js

3. Setup environment variables

Create a .env file in the /server directory with the following:

PORT=your_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

Also add a .env in the /client if required:

VITE_API_URL=your_backend_url

Deployment 💻

You can deploy the frontend on Vercel or GitHub Pages and backend on Render or Railway.
If you’re testing locally, use tools like ngrok or Replit to simulate live environment.

Usage 🧪

- Register a new account
- Check your email for OTP and verify it
- Login with your credentials
- Access protected dashboard after login
- Reset password if forgotten

Security Measures 🔒

- Passwords hashed using bcrypt
- JWT tokens stored in HttpOnly cookies
- OTPs expire after 5 minutes
- Input validations and token verification middleware

Future Improvements 🌱

- Add Google and GitHub OAuth login
- Improve error handling with toast messages
- Add role-based access (admin/user)
- Add user profile picture and edit profile feature


