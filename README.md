# Vehiqqo - Hire Driver Platform

![Vehiqqo Landing Page](amraoui-website/public/assets/landing/hero-bg.png)

Vehiqqo is a comprehensive SaaS platform designed for hiring and managing drivers. It connects customers needing reliable transportation services with qualified drivers, while providing administrators with the necessary tools to monitor and control the entire ecosystem.

## 🏗️ Project Structure

This monorepo is divided into four main directories, each serving a specific role in the platform:

| Directory | Description | Tech Stack |
| --- | --- | --- |
| 📱 `Vehiqqo/` | The mobile application for drivers and customers to access the platform on the go. | Flutter, Dart |
| ⚙️ `amraoui-backend/` | The core RESTful API and backend services powering all frontend clients. | Node.js, Express |
| 📊 `amraoui_dashboard/` | The admin dashboard used by administrators to oversee and manage all missions, drivers, and operations. | Next.js, React, Tailwind CSS |
| 🌐 `amraoui-website/` | The public landing page for driver recruitment and the dedicated customer portal for web access. | Next.js, React, Tailwind CSS |

---

## 🚀 Getting Started

Follow the instructions below to get each part of the platform running locally.

### 1. Backend (`amraoui-backend`)
The backend provides the API for all other applications.
```bash
cd amraoui-backend
npm install
npm run dev
```
*Note: Make sure to set up your `.env` file with the required database and service credentials before running the server.*

### 2. Admin Dashboard (`amraoui_dashboard`)
The web-based management portal.
```bash
cd amraoui_dashboard
npm install
npm run dev
```
*Runs on `http://localhost:3000` by default.*

### 3. Website (`amraoui-website`)
The marketing website.
```bash
cd amraoui-website
npm install
npm run dev
```

### 4. Mobile App (`Vehiqqo`)
The Flutter mobile application. Make sure you have the [Flutter SDK](https://docs.flutter.dev/get-started/install) installed.
```bash
cd Vehiqqo
flutter pub get
flutter run
```
*Tip: If testing on a physical Android device, ensure your backend is accessible via your local network IP (e.g., `10.10.x.x`) rather than `localhost`.*

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the `amraoui-backend` directory and add the following configuration. Replace the empty values with your actual credentials.

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
## 🛠️ Development & Contribution

- **Version Control**: When creating new features, ensure that you only commit the files necessary for that feature.
- **Git Hooks**: Avoid pushing unwanted files like `.env`, `node_modules/`, or build directories. A comprehensive `.gitignore` is included at the root level to help keep the repository clean.
