# CareerForge

CareerForge is a career-guidance and skill-tracking platform for engineering students to choose a career domain, follow a structured roadmap, track progress, complete phase-wise assessments, earn badges, and interact with an AI career agent.

## Folder Structure

```
CareerForge/
├── frontend/             # React + Vite + Tailwind Frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page level components
│   │   ├── App.jsx       # Main App component with Routing
│   │   ├── main.jsx      # Vite entry point
│   │   └── index.css     # Global styles & Tailwind config
│   ├── package.json
│   └── vite.config.js
└── backend/              # Node.js + Express + MongoDB Backend
    ├── config/           # Database config
    ├── controllers/      # Route controllers
    ├── middleware/       # Auth & Admin middleware
    ├── models/           # Mongoose schemas (User, Domain, Phase, Topic, Assessment, Badge)
    ├── routes/           # API routes
    ├── server.js         # Entry point
    ├── seed.js           # Database seeder with 14 Domains
    └── package.json
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Environment Variables:
   Copy `.env.example` to `.env` and adjust the values (like MongoDB URI, JWT Secret).
4. Seed the Database:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Credentials

- **Admin User**: admin@careerforge.com / admin123
- **Student User**: student@careerforge.com / student123

## Tech Stack

- **Frontend**: React.js, Tailwind CSS v4, Vite, React Router, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs

## Features

- Role-based access (Admin, Student, Mentor).
- Complete roadmaps for 14 different career domains.
- Progress tracking with persistent database states.
- AI Agent integration (can be plugged into OpenAI API).
- Rich dynamic UI with responsive design.
