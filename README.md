# Vehiqqo - Premium Hire Driver & Logistics Platform

![Vehiqqo Landing Page](amraoui-website/public/assets/landing/hero-bg.png)

**Vehiqqo** is a comprehensive, end-to-end SaaS platform designed to revolutionize the driver hiring and logistics management industry. It bridges the gap between customers needing reliable vehicle transport, inspections, or daily driver services, and professional drivers equipped to handle these missions. 

This repository houses the entire monorepo ecosystem, providing full administrative oversight, seamless customer experiences, and mobile-first driver workflows.

---

## Project Overview


### Key Features by Role

#### 👥 For Customers (Website & Customer Portal)
- **Service Requests:** Customers can create detailed requests for Vehicle Transport, Technical Inspections, or Daily Driver Hire.
- **Quote Management:** Receive, review, and accept administrative quotes directly from the portal.
- **Mission Monitoring:** Real-time tracking of mission statuses, including driver check-ins, location verifications, and progress timelines.
- **Invoicing & Payments:** Secure handling of invoices and payments for completed missions and extra expenses.

#### 🚗 For Drivers (Mobile App)
- **Mission Assignments:** Drivers receive notifications for new missions and can accept or decline them.
- **Proof of Delivery:** Built-in tools for uploading damage reports, vehicle photos (pickup/delivery), and capturing digital signatures.
- **Location & Check-ins:** GPS-based location verification and daily check-ins for long-term driver hire services.
- **Profile Management:** Secure document upload (licenses, IDs) for admin verification.

#### For Administrators (Admin Dashboard)
- **Full Operational Control:** Oversee every mission, driver, and customer from a centralized dashboard.
- **Quote Desk:** Generate dynamic pricing quotes for customer requests based on distance and requirements.
- **Driver Dispatch:** Manually assign or broadcast missions to available verified drivers.
- **Financials:** Manage invoices, track paid/unpaid statuses, and review driver expense reports (e.g., fuel, tolls).

---

## 🏗️ Technical Architecture & Ecosystem

This monorepo is divided into four main projects, utilizing a modern, decoupled architecture:

| Directory | Description | Tech Stack |
| --- | --- | --- |
| 🌐 **`amraoui-website/`** | The public landing page and authenticated **Customer Portal**. | Next.js, React, Tailwind CSS |
| 📊 **`amraoui_dashboard/`** | The secure **Admin Dashboard** for operational management. | Next.js, React, Tailwind CSS |
| ⚙️ **`amraoui-backend/`** | The core **RESTful API** powering the entire platform. Handles authentication, business logic, and real-time events. | Node.js, Express, MongoDB, Socket.io |
| 📱 **`amraoui_app/`** | The cross-platform **Mobile Application** built exclusively for Drivers. | Flutter, Dart |

---

## 🚀 Getting Started Locally

Follow the instructions below to get each part of the platform running locally on your machine.

### 1. Backend API (`amraoui-backend`)
The backend must be running for the frontend applications to function correctly.
```bash
cd amraoui-backend
npm install
npm run dev
```
*Note: Make sure to set up your `.env` file with the required database and service credentials before running the server (see Environment Variables section below).*

### 2. Admin Dashboard (`amraoui_dashboard`)
The command center for administrators.
```bash
cd amraoui_dashboard
npm install
npm run dev
```
*Runs on `http://localhost:3000` (or `3001` if port is in use).*

### 3. Customer Website (`amraoui-website`)
The public-facing marketing site and customer dashboard.
```bash
cd amraoui-website
npm install
npm run dev
```
*Runs on `http://localhost:3000` (or `3002` if port is in use).*

### 4. Driver Mobile App (`amraoui_app`)
The Flutter mobile application. Make sure you have the [Flutter SDK](https://docs.flutter.dev/get-started/install) installed.
```bash
cd amraoui_app
flutter pub get
flutter run
```
*Tip: If testing on a physical Android device, ensure your backend API URL points to your computer's local network IP (e.g., `192.168.x.x`) rather than `localhost`.*

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the `amraoui-backend` directory and add the following configuration. Replace the placeholder values with your actual credentials.

```env
# Server Configuration
APP_NAME=Vehiqqo 
BASE_URL=0.0.0.0
PORT=5000
SOCKET_PORT=5001
NODE_DEV=development

# Database
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/amraoui_backend?retryWrites=true&w=majority

# Security & Authentication
BCRYPT_SALT_ROUNDS=12
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=30d
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=365d
ACTIVATION_SECRET=your_activation_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Integrations
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🛠️ Development & Contribution Guidelines

- **Clean Architecture:** Ensure logic is properly separated. Use services for database operations in the backend, and keep React components clean on the frontend.
- **Version Control:** When creating new features, commit only the files necessary for that feature with descriptive commit messages.
- **Security:** Never push sensitive tokens or passwords. A comprehensive `.gitignore` is included at the root level to prevent accidental commits of `.env` files or `node_modules/`.
- **Formatting:** Adhere to the established styling (Tailwind classes) and linting rules across all repositories to maintain code consistency.
