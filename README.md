# Digital Document Vault

A secure document management platform built using the MERN Stack with Docker-based containerization and CI/CD automation. The application allows users to securely upload, organize, manage, search, and share documents through a clean and responsive interface.

## Key Features

* JWT-based User Authentication and Authorization
* Secure Document Upload and Management
* Folder Creation and Organization
* Document Search Functionality
* Public Shareable Document Links
* MongoDB Atlas Cloud Database Integration
* Docker Containerization for Frontend and Backend
* Multi-Container Management using Docker Compose
* Automated Build Validation using GitHub Actions CI Pipeline

## Tech Stack

### Frontend

* React.js
* React Router
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JWT (JSON Web Token)
* bcryptjs

### DevOps & Cloud

* Docker
* Docker Compose
* GitHub Actions
* MongoDB Atlas

## DevOps Highlights

This project demonstrates practical DevOps concepts including:

* Containerization using Docker
* Multi-service orchestration using Docker Compose
* Version control using Git and GitHub
* Continuous Integration (CI) using GitHub Actions
* Automated dependency installation and build validation
* Environment variable management
* Cloud-hosted database integration using MongoDB Atlas

## Project Structure

```text
digital-document-vault/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── Dockerfile
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.js
│
├── docker-compose.yml
└── .github/workflows/build.yml
```

## Getting Started

### Clone Repository

```bash
git clone https://github.com/YashKharalkar/digital-document-vault.git
cd digital-document-vault
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Docker Setup

Run the complete application using Docker Compose:

```bash
docker compose up --build
```

This command:

* Builds Docker images
* Creates containers
* Configures networking
* Starts frontend and backend services

## CI/CD Pipeline

GitHub Actions automatically executes on every push to the main branch.

### Pipeline Workflow

```text
Code Push
    ↓
GitHub Actions
    ↓
Install Backend Dependencies
    ↓
Install Frontend Dependencies
    ↓
Build Frontend
    ↓
Build Validation Success / Failure
```

## Skills Demonstrated

* Linux & Command Line Basics
* Networking Fundamentals
* Git & GitHub
* Docker
* Docker Compose
* CI/CD Concepts
* GitHub Actions
* REST API Development
* Authentication & Authorization
* Cloud Database Integration

## Future Improvements

* AWS Deployment
* Nginx Reverse Proxy
* Automated Docker Image Publishing
* Monitoring & Logging
* Infrastructure Automation

## Author

**Yash Kharalkar**

GitHub: https://github.com/YashKharalkar
