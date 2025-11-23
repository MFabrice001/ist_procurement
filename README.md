IST Procurement System

A Full Stack "Procure-to-Pay" system built for the IST Africa Technical Assessment.
Includes Multi-level approvals, Role-based access, and AI-powered document processing.

Tech Stack

Backend: Django + Django REST Framework

Frontend: React + Vite (Tailwind CSS style)

Database: PostgreSQL

AI Integration: OpenAI (Mock mode enabled by default)

Infrastructure: Docker & Docker Compose

Features

Purchase Requests: Create requests with AI auto-fill from PDF/Images.

Approval Workflow: Staff -> Manager -> Finance approval flow.

Role-Based Dashboard: Different views for Staff vs Admins.

Dockerized: One-command setup.

How to Run (Docker)

Prerequisites: Docker Desktop installed and running.

Clone the repository:

git clone <https://github.com/MFabrice001/ist_procurement>
cd ist_procurement


Start the application:

docker-compose up --build


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