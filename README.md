# Tech-Ro Events Web Application

## Overview

Tech-Ro Events Web Application is designed to manage and facilitate the booking of tickets for technology training seminars organized by the Tech-Ro Foundation. Users can read about, register for, and book tickets to various seminars. Administrators can manage users, events, and bookings to ensure a smooth operation.

## Features

![User Authentication](https://img.shields.io/badge/User%20Authentication-✔-green)
![Event Booking](https://img.shields.io/badge/Event%20Booking-✔-green)
![Admin Panel](https://img.shields.io/badge/Admin%20Panel-✔-green)
![Responsive Design](https://img.shields.io/badge/Responsive%20Design-✔-green)
![Dark Mode](https://img.shields.io/badge/Dark%20Mode-✔-green)

## Technologies Used

**Frontend:** ![HTML5](https://img.shields.io/badge/HTML5-✔-orange) ![CSS3](https://img.shields.io/badge/CSS3-✔-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-✔-yellow) ![AngularJS](https://img.shields.io/badge/AngularJS-✔-red) ![Bootstrap](https://img.shields.io/badge/Bootstrap-✔-purple)

**Backend:** ![Node.js](https://img.shields.io/badge/Node.js-✔-green) ![Express.js](https://img.shields.io/badge/Express.js-✔-black)

**Database:** ![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-✔-green)

## Folder Structure

- **`public/`**: Contains static files like CSS and JavaScript.
- **`views/`**: HTML templates for rendering pages.
- **`routes/`**: Application routes for different functionalities.
- **`models/`**: MongoDB models for data handling.
- **`server.js`**: Main application file.

## Installation

### Prerequisites

![Node.js 14+](https://img.shields.io/badge/Node.js-14+-green) ![MongoDB Atlas account](https://img.shields.io/badge/MongoDB%20Atlas-account-green)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/pkourr/Tech-Ro-events-Web-Application.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Tech-Ro-events-Web-Application
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure MongoDB Atlas:
    - Create a MongoDB Atlas account and set up a cluster.
    - Obtain the connection string and update it in `config.js`.

5. Start the application:
   ```bash
   node server.js
   ```

6. Access the application:
    - Open your web browser and navigate to `http://localhost:3000`.

## Usage

- **User Registration:** Sign up and manage personal profiles.
- **Event Booking:** Browse and book tickets for upcoming seminars.
- **Admin Panel:** Manage users and events, view booking statistics.

## Database Schema

- **`users` Collection:**
    - `_id`
    - `name`
    - `username`
    - `password`
    - `email`
    - `city`
    - `country`
    - `address`
- **`events` Collection:**
    - `_id`
    - `name`
    - `date`
    - `location`
    - `description`
    - `availableSeats`
- **`bookings` Collection:**
    - `_id`
    - `userId`
    - `eventId`
    - `seatsBooked`
    - `bookingDate`

## Admin Instructions

1. **Login as Admin:**
    - Default credentials: `username: admin`, `password: admin`.
2. **Manage Users and Events:**
    - View, edit, and delete users and events from the admin panel.
    - Track booking statistics and manage event capacities.


## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Note:** Ensure you have the necessary permissions and configurations on your server to avoid any issues during setup.
