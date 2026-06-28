# Visitor Pass Management System — Frontend

A React-based single-page application for the Visitor Pass Management System. It provides role-specific dashboards for Admin, Employee, Security, and Visitor roles with features including appointment management, QR code pass generation, PDF badge download, and QR-based check-in/check-out.

---

## Tech Stack

- **Framework**: React 19
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios (with request interceptor for auto token injection)
- **QR Code Scanner**: html5-qrcode
- **PDF Generation**: jsPDF
- **Build Tool**: Vite

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state with localStorage persistence
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Role-based route protection
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── admin/
│   │   │   └── Dashboard.jsx     # Full CRUD + search/filter for all collections
│   │   ├── employee/
│   │   │   └── Dashboard.jsx     # Create appointments, view visitors
│   │   ├── security/
│   │   │   ├── Dashboard.jsx     # Approve appointments, create passes, view logs
│   │   │   └── CheckIn.jsx       # QR code scanner for check-in/check-out
│   │   └── visitor/
│   │       └── Dashboard.jsx     # View pass, download PDF badge
│   ├── services/
│   │   └── api.js                # Axios instance + all API functions
│   └── App.jsx                   # Routes with ProtectedRoute wrappers
├── index.html
└── vite.config.js
```

---

## Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> **Never commit your `.env` file to GitHub.**

---

## Installation

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install
```

---

## Running the App

```bash
# Development server
npm run dev
```

The app runs on `http://localhost:5173` by default.

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## User Roles & Access

| Role | Access |
|------|--------|
| **Admin** | Full CRUD on all collections — Users, Visitors, Appointments, Passes, Check Logs |
| **Employee** | Create appointments for visitors, view and update appointment status |
| **Security** | View approved appointments, create visitor passes, scan QR for check-in/check-out |
| **Visitor** | View their own pass, download PDF badge with QR code |

---

## Key Features

### Authentication
- JWT-based login with role-based redirection
- Auth state persisted in localStorage — stays logged in on page refresh
- Axios interceptor automatically attaches token to every request

### Register
- Single form for all roles
- Extra visitor fields (phone, address, photo, purpose) appear conditionally when Visitor role is selected
- Photo uploaded as base64 string

### Admin Dashboard
- Tabbed interface with color-coded tabs (pink, sage, peach, lavender, mint)
- Search by name/email/role for Users
- Search + status filter for Visitors and Appointments
- Status filter for Passes
- Inline edit and delete for all collections
- Status badges with color coding

### Employee Dashboard
- Create appointment form with visitor dropdown
- View and update own appointments filtered by host ID

### Security Dashboard
- Shows only approved appointments
- One-click "Create Pass" button per appointment
- Auto-switches to Passes tab after pass creation
- QR Scanner button links to CheckIn page

### CheckIn Page
- Uses html5-qrcode to scan visitor pass QR codes via camera or image upload
- First scan creates check log with check-in time
- Second scan updates check log with check-out time
- Color-coded feedback messages (green = check-in, blue = check-out)

### Visitor Dashboard
- Displays pass details with QR code image
- Download PDF badge with visitor info and QR code via jsPDF

---

## Application Flow

```
Visitor registers → Employee creates appointment → Admin approves →
Email sent to visitor + host → Security creates pass →
Visitor downloads PDF badge → Security scans QR → Check-in logged →
Security scans again → Check-out logged
```
