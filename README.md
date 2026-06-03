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

<img width="1881" height="955" alt="2026-06-03 23_13_41-Settings" src="https://github.com/user-attachments/assets/870c67bb-1dc8-45b2-8026-f7928d6726b9" />
<img width="1876" height="947" alt="2026-06-03 23_14_10-Settings" src="https://github.com/user-attachments/assets/f077d550-ac78-4104-9112-ce3442c13003" />
<img width="1874" height="952" alt="2026-06-03 23_14_31-Settings" src="https://github.com/user-attachments/assets/79bbdd44-5d3c-42fa-bb12-b8d58523bec8" />
<img width="1875" height="959" alt="2026-06-03 23_15_02-Settings" src="https://github.com/user-attachments/assets/39ba1b58-7a9e-4fe1-86e2-ddb2baefb2e8" />
<img width="1871" height="948" alt="2026-06-03 23_15_39-Settings" src="https://github.com/user-attachments/assets/6bd98c8e-aeb7-4cf2-b214-0d30774450ff" />
<img width="1882" height="954" alt="2026-06-03 23_16_12-Settings" src="https://github.com/user-attachments/assets/1c0a5392-95c6-45b6-a75a-eedaa5226606" />








