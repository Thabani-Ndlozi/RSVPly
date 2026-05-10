# Firestore Collections & Indexes Guide

This document describes every Firestore collection RSVPly uses, the fields
each document contains, and the composite indexes you must create in the
Firebase console before the app works correctly.

---

## Collections

### `events`

One document per event created by a host.

| Field         | Type        | Description                                            |
|---------------|-------------|--------------------------------------------------------|
| `hostId`      | string      | UID of the Google user who created the event           |
| `hostName`    | string      | Display name of the host                               |
| `hostEmail`   | string      | Email of the host                                      |
| `name`        | string      | Event name (e.g. "Sarah's Baby Shower")                |
| `type`        | string      | Event type (e.g. "Wedding", "Birthday Party")          |
| `date`        | string      | ISO date — "YYYY-MM-DD"                                |
| `time`        | string      | Optional — "HH:MM" 24-hour format                      |
| `location`    | string      | Venue or address                                       |
| `description` | string      | Optional event description                             |
| `theme`       | string      | Optional dress code / theme                            |
| `guestCount`  | number      | Expected number of guests (host estimate)              |
| `image`       | string      | Unsplash URL of the chosen cover image                 |
| `shortCode`   | string      | 7-char unique alphanumeric code for RSVP link          |
| `createdAt`   | timestamp   | Server timestamp — set on creation                     |
| `updatedAt`   | timestamp   | Server timestamp — updated on every edit               |

---

### `guests`

One document per guest RSVP. Guests are linked to events via `eventId`.

| Field          | Type      | Description                                         |
|----------------|-----------|-----------------------------------------------------|
| `eventId`      | string    | Document ID of the parent `events` document         |
| `name`         | string    | Guest's full name                                   |
| `email`        | string    | Guest's email — stored lowercase for deduplication  |
| `attended`     | boolean   | Host marks `true` on event day. Default: `false`    |
| `registeredAt` | timestamp | Server timestamp — set when guest submits RSVP      |

---

## Required Firestore Indexes

Create these in **Firebase Console → Firestore → Indexes → Composite**.

### `events` collection

| Fields                                     | Order          | Purpose                                      |
|--------------------------------------------|----------------|----------------------------------------------|
| `hostId` ASC  +  `createdAt` DESC          | Composite      | Load host's events sorted by newest first    |
| `shortCode` ASC                            | Single-field   | RSVP page lookup by short code               |

### `guests` collection

| Fields                                       | Order        | Purpose                                        |
|----------------------------------------------|--------------|------------------------------------------------|
| `eventId` ASC  +  `registeredAt` DESC        | Composite    | Load guest list sorted by newest registration  |
| `eventId` ASC  +  `email` ASC                | Composite    | Duplicate-email check on RSVP submission       |

---

## Security Rules (recommended starter)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Events: any authenticated user can create; only the host can edit/delete
    match /events/{eventId} {
      allow read:   if true;           // public (needed for RSVP page)
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.hostId;
    }

    // Guests: public can create (RSVP); only the event host can update/delete
    match /guests/{guestId} {
      allow read:   if request.auth != null;
      allow create: if true;           // unauthenticated guests submit RSVPs
      allow update, delete: if request.auth != null;
    }
  }
}
```

> **Note**: Tighten the guest `update/delete` rule to check the host UID via
> a Firestore `get()` call once you're comfortable with rules syntax.
