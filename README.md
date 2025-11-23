# IST Procurement System

A Full Stack "Procure-to-Pay" system built with Django (Backend) and React (Frontend).

## 🚀 Live Demo

- **Frontend (Dashboard): https://ist-frontend.onrender.com

- **Backend (API): https://ist-backend-05op.onrender.com

- **API Documentation (Swagger):** 

https://ist-backend-05op.onrender.com/swagger/

## 🛠 Tech Stack

- **Backend:** Django 5, Django REST Framework, PostgreSQL
- **Frontend:** React (Vite), Axios, CSS Modules
- **Infrastructure:** Docker, Render (Cloud Deployment)

## ✨ Features

- **User Roles:** Role-based access (Staff, Manager, Finance).
- **Purchase Requests:** Create, View, and Track status of requests.
- **Approval Workflow:** Backend logic for Multi-level approvals.
- **Modern UI:** Clean, responsive dashboard with real-time statistics.
- **API Documentation:** Fully interactive Swagger UI.

## 📦 Local Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Node.js (v18+)

### 1. Run with Docker (Recommended)

```bash
git clone https://github.com/MFabrice001/ist_procurement.git
cd ist_procurement
docker-compose up --build

## A link to my Repository:

https://github.com/MFabrice001/ist_procurement


Access the App:

Frontend: http://localhost:5173

Backend API: http://localhost:8000/swagger/

Login Credentials (Demo):

Username: admin

Password: 123
(Or create a new superuser via docker-compose exec backend python manage.py createsuperuser)

API Endpoints

POST /api/requests/ - Create Request (Supports file upload)

GET /api/requests/ - List Requests

PATCH /api/requests/{id}/approve/ - Approve Request

GET /api/users/me/ - Get Current User Profile