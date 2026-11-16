# MERN Library Management System
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
<br>
This Information Technology Project (ITP) is a library management system engineered to implement industry-standard software engineering best practices, transforming academic requirements into a scalable, cloud-native application inspired by modern software engineering practices



## Architecture Highlights
- React + TypeScript frontend with reusable hooks and role-aware UI rendering
- Express.js backend following a layered architecture (Router → Middleware → Controller → Service → Model)
- MongoDB Atlas persistence with Mongoose-based data access
- AWS Lambda serverless deployment with Amazon ECR container images
- GitHub Actions CI/CD pipeline with automated testing and immutable deployments
- JWT authentication with frontend route guards and bcrypt password hashing



## Live Demo
### URL (Vercel)
[Explore the Library System (Vercel)](https://ts-mern-lms.vercel.app)

### Test Credentials
| Role              | Email               | Password  |
| ----------------- | ------------------- | --------- |
| Admin (Librarian) | test@gmail.com      | test123   |


### Feature Showcase: Core Business Workflows
- To quickly evaluate the platform's core business functionality, focus on the following features:
    - Dashboard & Analytics
    - Book Recommendation
    - Book Filtering & Discovery
    - Book Details Modal
    - Self-Service Loan & Return
    - Loan History & Favourite Books
    - Book Management

- Notes
    - Administrative CRUD features (Users, Authors, Publishers, Genres, Languages, and Suspension Management) are available but are not the primary focus of this showcase
    - Initial request may experience a 3–5s delay due to AWS Lambda cold start (dormant environment)

- For a detailed walkthrough and recommended evaluation flow, see:
    - [Live Demo Guide](/doc/Documentation/guide/livedemo-guide.md)


## Video for demonstration
- **[Features Speedrun Video](https://youtu.be/P8W-779EQ3k) (17 min):** A fast-paced showcase of the system's core features across different roles
    - 00:00 Librarian
    - 13:55 User
    - 15:52 Guest

- Key features demonstrated:
    - Dashboard & Analytics
    - Book Recommendation Service
    - Book Management
    - User Loan History & Filtering


## Table of Contents
- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Core Features](#core-features)
- [Core Business Workflows](#core-business-workflows)
- [Technical Documentation](#technical-documentation)
- [Engineering Journey](#engineering-journey)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)



## Introduction

### Project Background
- This project was originally developed as an Information Technology Project (ITP) aimed at modernising traditional library operations

- The initial implementation focused on delivering core functionality, including catalog management, loan processing, QR-code-assisted workflows, and a TF-IDF-based recommendation engine using the MERN stack

- Following graduation, the project evolved beyond its academic scope and became a platform for exploring production-oriented architecture, cloud deployment, security design, and engineering best practices



### Disclaimer
All contact information provided in this file is fictitious and used solely for demonstration purposes



## Quick Start
### 1. Copy example environment variables and edit
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Launch with Docker Compose
```bash
docker-compose -f compose.yaml up --build -d
```


## Technology Stack
- **Frontend** 
    - Next.js(React), Typescript, Material-UI, Chart.js

- **Backend** 
    - Node.js, Express.js, WebSocket

- **Database** 
    - MongoDB, Mongoose

- **Cloud & DevOps**
    - AWS (Lambda, ECR, S3, IAM, EventBridge, DynamoDB)

- **Testing & Quality**
    -  GitHub Actions, Jest, ESLint

- **Security** 
    - JWT(JSON web token), Bcrypt

- **Algorithm**
    - TF-IDF Recommendation Service



## Core Features
- **Book Discovery & Recommendation**
    - Provides personalised book recommendations using a TF-IDF–based recommendation engine

- **External Metadata Integration**
    - Integrates Google Books metadata to enrich catalogue information and improve content discovery

- **Loan & Return Management**
    - Tracks borrowing activities, due dates, and return status throughout the loan lifecycle

- **QR-assisted Borrowing Workflow**
    - Supports member identification during borrowing operations through QR-code-based workflows

- **Role-aware Access Control**
    - Provides authentication and role-specific interfaces for members and librarians



## Core Business Workflows
Documentation covering the key business processes and service behaviours within the system

- [Automated Logic](./doc/Documentation/businessLogic/automated-logic.md)
    - Background task execution using setTimeout, setInterval and Promise.allSettled
    
- [Recommendation Service](./doc/Documentation/businessLogic/recommendation-service.md)
    - TF-IDF-based recommendation engine for similarity scoring and book discovery

- [External Metadata Integration](./doc/Documentation/businessLogic/external-metadata.md)
    - Google Books API integration for metadata enrichment and catalogue enhancement

- [QR Code Handling](./doc/Documentation/businessLogic/qr-code-handling.md)
    - QR-based member identification workflow for borrowing operations



## Technical Documentation
For a detailed look at the system's engineering standards and design patterns, please refer to:
- [Architecture](./doc/Documentation/technical/architecture.md)
    - Development, backend and production architecture with key design decisions

- [System Design](./doc/Documentation/technical/system-design.md)
    - Authentication workflows, external integrations and feature-level sequence diagrams

- [Database Design](./doc/Documentation/technical/database-design.md)
    - Entity relationships and core MongoDB collection design

- [UI Layout](./doc/Documentation/technical/ui-design.md)
    - Role-based UI rendering and component organisation

- [API Endpoints](./doc/Documentation/technical/api.md)
    - REST API domains, endpoint categories and response conventions

- [Testing Strategy](./doc/Documentation/technical/testing.md)
    - Unit testing, integration testing and CI-based validation

- [CI/CD Workflow](./doc/Documentation/technical/ci-cd.md)
    - Automated build, testing and deployment workflow



## Engineering Journey
This section highlights the architectural evolution, engineering decisions, and future direction of the project

- **Key highlights include**
    - [Engineering Evolution](/doc/Documentation/technicalLearns/engineering-evolution.md)
        - Lessons learned and major architectural refactoring decisions made after the initial release

    - [Technical Trade-offs & Architecture Decisions](/doc/Documentation/technicalLearns/technical-tradeoff.md)
        - Evaluation of WebSocket vs CRUD Fetch, Lambda vs EC2, and other engineering decisions made throughout the project

    - [Completed Improvements](./doc/Documentation/product/completed-improvements.md)
        - Key enhancements across frontend architecture, backend services, infrastructure, and deployment workflows

    - [Current Limitations](./doc/Documentation/product/limitations.md)
        - Known technical and operational constraints, together with their associated trade-offs

    - [Future Enhancements](./doc/Documentation/product/future-enhancements.md)
        - Planned improvements focused on security, scalability, testing, and operational resilience



## Installation
- [Installation Guide](./doc/Documentation/guide/installation-guide.md)



## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b ${branchname}`)
3. Commit your changes (`git commit -m "comment"`)
4. Push the branch (`git push origin`)
5. Open a Pull Request.



## License

MIT License

Copyright (c) 2025 TomWai821

Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.
