<p align="center">
  <img src="public/logo.png" alt="RSVPly Logo" width="180" />
</p>

<h1 align="center">RSVPly</h1>

<p align="center">
  A React and Firebase web app for creating events, sharing RSVP links, collecting guest responses, and tracking attendance in real time.
</p>

## Live Demo

[View RSVPly](https://rsvply-5f88d.web.app/)

## Overview

RSVPly was created to simplify the process of managing event attendance. Instead of manually collecting guest responses through messages or spreadsheets, hosts can create an event, share a unique RSVP link, and monitor responses from a central dashboard.

The application supports authenticated event hosts and public guest RSVP access. Guests do not need an account to RSVP.

## Features

- Google authentication for event hosts
- Create, edit, view, and delete events
- Generate unique public RSVP links
- Public guest RSVP page
- Duplicate RSVP checking by email
- Real-time guest tracking
- Mark guests as attended
- Remove guests from an event
- Dashboard with event statistics
- Responsive design for desktop and mobile
- Cookie consent popup
- Google Analytics integration
- Privacy policy page

## Tech Stack

- React
- Vite
- Firebase Authentication
- Cloud Firestore
- Firebase Hosting
- Google Analytics
- React Router
- CSS / Inline styling

## Main Pages

### Home Page

The home page introduces the app and gives users a quick entry point to create or manage events.

### Events Page

The events page allows authenticated users to create, view, edit, share, and delete events.

### RSVP Page

The RSVP page is public and allows guests to register for an event using a unique RSVP link.

Example RSVP route:

http://localhost:9000/rsvp/:shortCode

### Dashboard Page

The dashboard displays event statistics, guest responses, attendance tracking, and analytics charts.

### Profile Page

The profile page shows user information, event statistics, recent events, and account actions such as logout and account deletion.

### Privacy Policy Page

The privacy policy explains how user data, cookies, browser storage, and analytics are handled.

### Project Responsibilities
## Thabani

Responsible for:

Event creation flow
Guest RSVP page
Dashboard page
Guest management
Attendance tracking
Responsive interface improvements

## Ofentse

Responsible for:

Database design
Firebase authentication
Analytics integration
Data structure planning
Firebase setup support


### Firestore Collections

##  The app mainly uses two Firestore collections:

# events

Stores event information created by hosts.

Example fields:

{
  name,
  type,
  date,
  time,
  location,
  description,
  theme,
  guestCount,
  image,
  hostId,
  hostName,
  hostEmail,
  shortCode,
  createdAt,
  updatedAt
}

# guests

Stores guest RSVP records linked to events.

Example fields:

{
  eventId,
  name,
  email,
  attended,
  registeredAt
}

The relationship is created using:

event.id === guest.eventId


### Authentication

RSVPly uses Firebase Authentication with Google Sign-In. Authenticated users can create and manage events, while guests can RSVP without creating an account.

### Routing

The app uses React Router for navigation.

Main routes include:

/
 /events
 /dashboard
 /profile
 /privacy
 /login
 /rsvp/:shortCode

 
### Analytics and Cookies

The app includes Google Analytics to track app usage and user interactions. Analytics only runs after the user accepts analytics cookies through the cookie consent popup.

Cookie choices are stored in localStorage.

### Installation and Setup

Clone the repository:

git clone PASTE-YOUR-REPOSITORY-LINK-HERE

Navigate into the project:

cd rsvply

Install dependencies:

npm install

Create a .env file in the root folder and add your Firebase configuration:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

Run the development server:

npm run dev

Build the project:

npm run build

Deploy to Firebase Hosting:

firebase deploy --only hosting


### Firebase Hosting Rewrite

Because RSVPly uses React Router, Firebase Hosting should redirect all routes to index.html.

Example firebase.json:

{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}


### Lessons Learned

This project helped us practice:

Building a full React web app
Working with Firebase Authentication
Structuring Firestore collections
Creating protected and public routes
Managing real-time data with Firestore
Handling responsive UI challenges
Implementing cookie consent and analytics
Deploying a production-ready app with Firebase Hosting
Future Improvements

Possible future improvements include:

Email confirmations for guests
QR code RSVP links
Event reminder notifications
Custom event themes
Role-based access control
Improved analytics dashboard
Custom domain setup


## Contributors

| Contributor | Responsibilities |
|---|---|
| [Thabani Ndlozi](https://github.com/Thabani-Ndlozi) | Event creation, RSVP page, dashboard, guest management |
| [Ofentse Vilakazi](https://github.com/Ofentse-Vilakazi) | Database design, authentication, analytics |
