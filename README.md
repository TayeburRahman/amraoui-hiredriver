# Amraoui - Hire Driver Platform

Amraoui is a comprehensive SaaS platform designed for hiring and managing drivers. This monorepo contains the entire suite of applications, including the mobile app, backend API, administrative dashboard, and the marketing website.

## 🏗️ Project Structure

This monorepo is divided into four main directories, each serving a specific role in the platform:

| Directory | Description | Tech Stack |
| --- | --- | --- |
| 📱 `amraoui_app/` | The mobile application for drivers and customers. | Flutter, Dart |
| ⚙️ `amraoui-backend/` | The core RESTful API and backend services. | Node.js, Express |
| 📊 `amraoui_dashboard/` | The administrative web dashboard for managing the platform. | Next.js, React, Tailwind CSS |
| 🌐 `amraoui-website/` | The main landing page and marketing frontend. | Next.js, React, Tailwind CSS |

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

### 4. Mobile App (`amraoui_app`)
The Flutter mobile application. Make sure you have the [Flutter SDK](https://docs.flutter.dev/get-started/install) installed.
```bash
cd amraoui_app
flutter pub get
flutter run
```
*Tip: If testing on a physical Android device, ensure your backend is accessible via your local network IP (e.g., `10.10.x.x`) rather than `localhost`.*

---

## 🛠️ Development & Contribution

- **Version Control**: When creating new features, ensure that you only commit the files necessary for that feature.
- **Git Hooks**: Avoid pushing unwanted files like `.env`, `node_modules/`, or build directories. A comprehensive `.gitignore` is included at the root level to help keep the repository clean.
