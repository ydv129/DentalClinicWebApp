# DentalCare Clinic - Modern Dental Experience

A modern PWA dental clinic management system with appointment booking, doctor management, and patient portal.

## Features

- 📱 PWA Installable on all devices
- 👨‍⚕️ Doctor & Patient Management
- 📅 Appointment Booking System
- 🔐 JWT Authentication with Refresh Tokens
- 🎨 Modern UI with Glass Morphism
- 🌙 Responsive Design (Mobile to Desktop)

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT
- **PWA**: Vite Plugin PWA

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Variables

Create `.env` files from the examples:

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
```

```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dentalclinic
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Run Development

```bash
# Frontend
cd frontend
npm run dev

# Backend (new terminal)
cd backend
npm run dev
```

### Build for Production

```bash
cd frontend
npm run build
```

## Default Accounts

- **Admin**: doctor@dentalclinic.com / doctor@123
- **Patient**: Register via the app

## Project Structure

```
dental-clinic/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/   # API services
│   │   └── store/      # Zustand stores
│   └── public/
│       ├── background/   # Background images
│       └── hero/         # Hero images
└── backend/           # Express backend
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        └── middleware/
```

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### Appointments
- GET /api/appointments
- POST /api/appointments
- PUT /api/appointments/:id
- DELETE /api/appointments/:id

### Doctors
- GET /api/doctors
- PUT /api/doctors/verify/:id

### Patients
- GET /api/patients

## Deploy on Vercel

Connect your repo to Vercel and create **two projects**:

### 1. Backend Project
- Name: `dental-clinic-backend`
- Root: `backend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `MONGODB_URI` = your MongoDB Atlas connection string
  - `JWT_SECRET` = any random string
  - `JWT_REFRESH_SECRET` = any random string
  - `CORS_ORIGIN` = your frontend domain
  - `PORT` = 5000

### 2. Frontend Project
- Name: `dental-clinic-frontend`
- Root: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL` = your backend URL (e.g., https://dental-clinic-backend.vercel.app/api)

## License

MIT