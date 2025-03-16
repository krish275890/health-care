Healthcare Worker Clock-In/Out Application

Overview

This web application allows healthcare workers to clock in and clock out of their shifts while ensuring they are within a set location perimeter. It provides an admin panel for managers to track employee attendance and generate insights on work hours.

Features Implemented

Care Worker

Clock In: Can clock in only when inside the defined perimeter.

Clock Out: Can clock out only if they are already clocked in.

Optional Notes: Can add notes while clocking in or out.

Authentication: Uses Auth0 for login via email or Google.

Manager

Set Location Perimeter: Define a geofence for allowed clock-in/out.

View Active Workers: See a list of currently clocked-in staff.

Attendance Records: Track when and where employees clocked in and out.

Dashboard Analytics:

Average hours spent clocked in per day.

Number of employees clocking in each day.

Total hours worked per employee in the last 7 days.

Bonus Features Implemented

Progressive Web App (PWA): Works like a native app and supports offline usage.

Automatic Location Detection: Notifies workers when they enter or leave the perimeter.

Tech Stack

Frontend: Next.js with Grommet (UI Library)

Backend: GraphQL with Prisma (ORM)

Database: PostgreSQL (or any supported Prisma database)

Authentication: Auth0 (Supports email & Google login)

Analytics: Chart.js for data visualization

Setup Instructions

Prerequisites

Ensure you have Node.js and npm/yarn installed.

Installation

Clone the repository:

git clone https://github.com/krish275890/health-care.git
cd healthcare-clock

Install dependencies:

npm install

Create a .env.local file in the root directory and add:

NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_API_URL=your-backend-url

Run the development server:

npm run dev

The app will be available at http://localhost:3000

Deployment

The app has been deployed on Vercel. Access it at:
🔗 Live URL: [https://v0-healthcare-worker-app-eta.vercel.app/]

Folder Structure
├── app/                # Next.js pages
│   ├── page.tsx       # Main clock-in page
│   ├── dashboard.tsx  # Manager dashboard
├── components/        # UI components
├── hooks/             # Custom hooks (Auth, Location Tracking)
├── utils/             # Helper functions
├── styles/            # Styling files
├── public/            # Static assets
├── prisma/            # Prisma schema for database
└── README.md          # Documentation

