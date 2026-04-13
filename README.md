# MERN Library Management System
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)
<br>
This Information Technology Project (ITP) is a library management system engineered to implement industry-standard software engineering best practices, transforming academic requirements into a scalable, production-grade cloud-native application


## Live Demo
### URL (Vercel)
[Explore the Library System (Vercel)](https://ts-mern-lms.vercel.app)

### Test Credentials
| Role              | Email               | Password  | Key Feature To Test                                                                                          |
| ----------------- | ------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| User              | IamTester@gmail.com | IamTester | Book Search, Book Favourite, Self Record (Loan History + favourite list)                                     |
| Admin (Librarian) | test@gmail.com      | test123   | Loan Book, Book Recommendation, User Suspension, CRUD operations (User, Book, Contact data, Definition Data) |


- For a structured walkthrough, please refer to: `./doc/DemonstrationMaterial/*` (Includes sample data and test scenarios)
- First load may take 10-15s due to free tier hosting (Railway)

### Feature Showcase: Real-time Discovery & Management
#### For User

Explore how the system enhances your reading journey with intuitive discovery tools

1. Book Favourite (Personal Collection)
    - Navigate to Management > Book Management
    - Select any book and click the Favourite Book button
    - Click the sidebar icon and navigate to Records
    - Select the Favourite Book Record tab
        - **Observe**: The favourited book is listed with full details, including Cover Image, Title, Genre, Language, and Author

2. Advanced Book Filtering
    - Navigate to View > Books
    - Set Status to OnShelf
    - Expand the filter (Down arrow), set Genre to Novel
    - Click Search
        - **Observe**: Results are narrowed down to Available Novels only
    - Click Reset Filter
        - **Observe**: The filter clears, restoring the full book list instantly

3. Rich Metadata Modal (Main Page)
    - Click on "Harry Potter and the Half-Blood Prince" on the home page
    - Click the Expand button near the description
        - **Observe**: The full book synopsis is revealed
    - Switch to the Google Books tab
        - **Observe**: Real-time metadata fetched via Google Books API, including ISBN, Average Rating, Rating Count, List Price, and Retail Price
    - Click Exit or click outside the modal to close
  
- Remarks:
    - Do not logout, keep this browser open for the Administrative Loan demo later
    - The metadata fetching logic includes error handling for HTTP 429 (Too Many Requests)<br>
      (In the event of a quota exhaustion, the UI gracefully falls back to displaying local database metadata to ensure an uninterrupted User Experience)<br>
 
#### For Admin (Librarian)

Demonstrating administrative transparency and data-driven intelligence (Login as Librarian required)

1. TF-IDF Recommendation Engine (Real-time Personalisation)
    - Navigate to Management > Book Management
    - Select an OnShelf book (Best with Non-Novel/Academic Textbook) and click Loan Book
    - Choose Self Loan and confirm
    - Return to the Library (Home) page
        - **Observe**: The "Recommended for You" section updates instantly, prioritising new books based on the TF-IDF Engine's analysis of your latest loan

2. Asset Lifecycle Tracking (Book History)
    - Navigate to Management > Book Management.
    - Select any OnLoan book and click View Loan Book History
        - **Observe**: Automatically redirects to the Loan History tab, displaying the book's full history, including Loaned Date, Return Date, Borrower, and Record Status

3. Administrative Loan (Requires 2 Browsers)
    - (Librarian Browser): Navigate to Management > Book Management
    - (Librarian Browser): Select an OnShelf book and click Loan Book
    - (Librarian Browser): Choose User Loaned, then input/scan the QR Code data (From [Demo Material](doc/DemonstrationMaterial/DemonStrationData.txt)) and confirm
        - **Observe**: The book status instantly changes to OnLoan
    - (User Browser): Switch to the User's browser window
    - (User Browser): Navigate to Records > Loan Book Record
        - **Observe**: The newly loaned book appears at the bottom of the list, confirming the record has been successfully appended in real-time

4. Administrative Book Return
    - (Librarian Browser): Navigate to Management > Book Management
    - (Librarian Browser): Select **the book used in the previous step** and click View Loan Book History
    - (Librarian Browser): Select the latest loan record (bottom of the list) and click Return Book
    - (Librarian Browser): Confirm the return
        - **Observe**: The status instantly reverts to OnShelf (Book Data Tab) and updates to Return (Loan Record Tab)
    - (User Browser): Switch to the User's browser window
    - (User Browser): Navigate to Records > Loan Book Record.
        - **Observe**: The loan record status for the specific book has been instantly updated to "Return", confirming seamless end-to-end synchronisation
    

## Video for presentation and demonstration
### SpeedRun version
- **[Features Speedrun Video](https://youtu.be/GU08EtdHS4I) (12 min):** A quick showcase of the system's core features for fast-paced viewing

### Detailed version
- **[Presentation Video](https://youtu.be/QuyYn-r9Nr4) (12 min):** An overview of the project concept, goals, and the inspiration behind it 
    
- **Demonstration Video (Total: 33 min):** A walkthrough of the project's features and live functionalities for each role<br>
    - [For Non-Librarian (Guest User and Authenticate User)](https://youtu.be/CtT22CMBoSo) - 15 min<br>
    - [For Librarian](https://youtu.be/ae6o5S0cZn0) - 18 min<br>

## Table of Contents
- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Technical Documentation](#technical-documentation)
- [Core Business Logic Overview](#core-business-logic-overview)
- [Product Evolution And Roadmap](#product-evolution-and-roadmap)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)



## Introduction

### The Original Goal
Developed as an Information Technology Project (ITP) to modernise traditional library operations. The initial focus was on functional implementation: CRUD operations, QR Code integration, and a TF-IDF recommendation engine using the MERN stack

### The Engineering Evolution
After graduation, I refactored the entire system to align with industry-standard engineering principles, focusing on Decoupling, Resilience, and Cloud-Native scalability:

- Architectural Overhaul: **Layered Decoupling**
    - Transitioned from a monolithic script to a Layered Architecture (Router-Middleware-Controller-Service-Model)
    
    - **Impact**
        - Isolated business logic from transport and persistence layers<br>
          (Enable independent scaling of services and reducing regression risks during feature iterations)

- Logic Refactoring: **Backend-Driven Computation**
    - Offloaded heavy business logic (such as the TF-IDF Recommendation Engine, from the client-side to the Backend Service Layer)

    - **Benefit**
        - **Resource Decoupling**
            - Prevented client-side browser freesing during high-intensity vector computations, ensuring a responsive interface regardless of the library's data volume

        - **Centralised Computation** 
            - Guaranteed a single source of truth for recommendation logic
              (Ensure consistent results across all user sessions and facilitating future algorithmic updates without client-side redeployment)


- DevOps Integration: **Environment Parity & CD Readiness**
    - Orchestrated a Dockerized environment integrated with GitHub Actions to enforce a rigorous CI pipeline (Linting, Integration Testing)

    - **Implementation**
        - Specifically engineered the Dockerfile to be compatible with AWS Lambda Web Adapter (e.g., configuring port mapping and extension layers)

    - **Impact**
        - Achieved high-fidelity environment parity between local development and AWS Serverless runtime
        - Effectively eliminating "it works on my machine" issues during the migration from PaaS to AWS



### Technical Learns 
- System Architecture - **Layered Design (Router-Middleware-Controller-Service-Model)**
    - Designed a modular Express.js backend to achieve a clean Separation of Concerns

    - **Benefit**
        - Facilitates high code maintainability and allows independent testing of business logic and data access layers
  
- Data Integrity & Consistency Management - **Reliable Image Persistence (Multer & fs/promises)**
    - Developed a custom workflow utilising memoryStorage to simulate atomicity<br>
      (Ensured that file system mutations (e.g. HandleDeleteImage) only execute after verifying primary database operations)

    - **Action**
        - **Coordinated Deletion & Logical Rollback**
            - Leveraged Promise.allSettled to manage multi-document cleanup (Loans, Favourites, Book records)<br>
              (Ensure the physical image is only purged if the core record is successfully removed)

        - **Redundancy Control**
            - Implemented Regex sanitisation and strict execution order to prevent "orphaned" files and redundant filename timestamps during consecutive edits

  
- Type-Safe Development - **End-to-End TypeScript Integration**
    - Leveraged TypeScript across the full stack to enforce rigorous data structures and interface contracts

    - **Result**
        - Significantly reduced runtime TypeErrors and improved developer productivity through IDE intelligent code completion
  
- Security Logic - **Multi-Party Authorisation (MPA) Framework**
    - Engineered a synchronised JWT handshake protocol to enforce Multi-Factor Authorisation for high-risk loaning operations

    - **Impact**
        - Ensures critical state transitions are only executed when cryptographically verified by both the Borrower and Librarian simultaneously
        - Effectively mitigating unauthorised access and insider threats
  
- State Orchestration - **Performance-Oriented Frontend Architecture**
    - Optimised React performance by centralising global state with Context API and encapsulated logic within Custom Hooks

    - **Benefit**
        - Minimised unnecessary component re-renders and established a predictable, one-way data flow
      
- Cloud-Native DevOps & Infrastructure - **Scaling from PaaS to Serverless**
    - Orchestrated a strategic migration from PaaS (Railway) to an AWS-based Serverless environment using Docker (ECR) and AWS Lambda

    - **Infrastructure Automation**
        - **Environment-Agnostic Task Execution**
            - Integrated Amazon EventBridge Scheduler to bypass Lambda’s stateless freezing<br>
              (Enabling precise daily business logic execution (Fines/Loans))
            - Decoupled Trigger Logic: Designed the backend to be "trigger-agnostic"<br>
              (Allowing the same maintenance services to be invoked by Local Cron Jobs during development or Cloud Events in production)

        - **CI/CD Reliability**
            - Engineered a GitHub Actions pipeline that enforces strict linting and Jest/Supertest integration testing
            - Automated ECR image builds to guarantee that the exact same container images verified in CI are deployed to production
              (Effectively eliminating environment-specific bugs)

        - **Benefit**
            - Achieved Zero-Downtime Deployments and optimized operational costs through Serverless scaling
            - Established a Hybrid Execution Model that seamlessly handles both persistent REST API traffic and scheduled background tasks across any environment


### Disclaimer
All contact information provided in this file is fictitious and used solely for demonstration purposes



## Quick Start
### 1. Copy example environment variables and edit
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
- Edit backend/.env: set at minimum: MONGO_URI, JWT_SECRET, PORT, ORIGIN_URI, GOOGLE_BOOKS_API_KEY, GOOGLE_BOOKS_BASE_URL, BACKEND_BASE_URL, STORAGE_TYPE
- Edit frontend/.env: set at minimum: REACT_APP_API_URL, REACT_APP_MAIN_PAGE

**Notes about ports and hostnames** 
- If you run the project with **Docker Compose**, use the Docker examples in `.env.example` (e.g. `MONGO_URI=mongodb://mongo:27017/...`). Docker Compose maps container ports to the host automatically
- If you run services locally (not via Docker), replace container hostnames with `localhost` and ensure `PORT` matches the port you start the backend on (e.g. `3000`)
- Always include protocol and port for URLs: `ORIGIN_URI=http://localhost:5000`, `REACT_APP_API_URL=http://localhost:5000/api`, `REACT_APP_MAIN_PAGE=http://localhost:3000`, `BACKEND_BASE_URL=http://localhost:5000`, `STORAGE_TYPE=LOCAL`

### 2. Launch with Docker Compose
```bash
docker-compose -f compose.yaml up --build -d
```


## Technology Stack
- **Frontend** 
    - React
    - Material-UI for styling (Leveraging CSS3 Standard)
    - React-router-dom for SPA (Single Page Application) navigation

- **Backend** 
    - Node.js
    - Express.js

- **Database** 
    - MongoDB with Mongoose (With Nodemon for development)

- **Image Data Handling** 
    - Multer for file uploads
    - FS for local image handling
    - aws-sdk/client-s3 for s3 bucket image handling

- **Data security** 
    - JWT(JSON web token) for Authentication
    - Bcrypt for password hashing

- **Environment Configuration** 
    - dotenv for managing environment variables

- **Algorithms** 
    - TF‑IDF for book recommendation engine

- **CI/CD & Code quality**
    - GitHub Actions for CI/CD
    - Jest for testing
    - ESLint for linting

- **Cloud Infrastructure (AWS)** 
    - Amazon S3 (Bucket Scalable object storage) for persistent handling of user-uploaded images
    - AWS Lambda (Serverless computing platform) for executing backend logic with auto-scaling capabilities
    - Amazon ECR (Container registry) for storing and managing production-ready Docker images
    - IAM (Identity and Access Management) for secure cross-service communication (Implementing the principle of least privilege (PoLP))
    - Amazon API Gateway for handling RESTful API requests and enforcing CORS security policies
    - EventBridge Scheduler (Serverless cron job orchestrator) triggering periodic business logic (e.g. daily fine calculations)

- **Other**
    - RESTful APIs with modular design
    - Docker for containerisation and environment consistency



## Features 
- **Intelligent Recommendation**
    - Developed a custom TF-IDF engine to provide data-driven book recommendations based on user history, enhancing personalised content discovery
      
- **External Data Enrichment**
    - Integrated Google Books API on the client side to fetch and display extended metadata, providing a rich user experience without bloating the backend database
      
- **Automated Loan Tracking**
    - Built an automated tracking system for loaned books and return statuses, ensuring real-time data consistency and operational visibility
      
- **QR-based Operations**
    - Streamlined book loaning via QR Code integration, implementing a multi-token exchange protocol to facilitate identity verification and transaction authorization between the borrower and the librarian
      
- **Security Architecture**
    - Implemented JWT-based Authentication with Bcrypt hashing, utilising Frontend Route Guards and Role-aware UI rendering for access control



## Technical Documentation
For a detailed look at the system's engineering standards and design patterns, please refer to:
- [Architecture](./doc/Documentation/technical/architecture.md)
    - System diagrams, database schema, and design patterns
- [UI Layout](./doc/Documentation/technical/ui-design.md)
    - Component architecture and Role-Based UI rendering
- [API Endpoints](./doc/Documentation/technical/api.md)
    - Full RESTful API documentation and endpoint details
- [Testing Strategy](./doc/Documentation/technical/testing.md)
    - Unit/Integration test strategy and coverage reports
- [CI/CD Workflow](./doc/Documentation/technical/ci-cd.md)
    - Automation pipeline for testing and deployment



## Core Business Logic Overview
This document outlines the implementation of the system's background automation, focusing on task scheduling and asynchronous execution stability
- [Automated Logic](./doc/Documentation/businessLogic/automated-logic.md)
    - Managed background tasks using setTimeout, setInterval, and Promise.allSettled to ensure resilient, non-blocking process execution
- [TF-IDF Logic](./doc/Documentation/businessLogic/tf-idf-logic.md)
    - Implemented a custom text-mining algorithm to calculate term weights for an intelligent book recommendation system
- [External Metadata Integration](./doc/Documentation/businessLogic/external-metadata.md)
    - Integrated Google Books API to automate book data retrieval and synchronize high-quality catalog metadata
- [QR Code Handling (Frontend Only)](./doc/Documentation/businessLogic/qr-code-handling.md)
    - Implemented entirely on the frontend using a JSON-encoded object (username, userID) to facilitate real-time loan verification via interactive modals, eliminating unnecessary backend API overhead



## Product Evolution And Roadmap
This project focuses on high-standard engineering practices. Key highlights include:
- [Improvements](./doc/Documentation/product/improvements.md)
    - Optimised system performance and deployment efficiency through I/O Concurrency (Promise.allSettled), Multi-stage Dockerisation, and an Automated Serverless CI/CD Pipeline (GitHub Actions + AWS ECR/Lambda)
- [Product Limitation](./doc/Documentation/product/limitations.md)
    - Strategic Limitations: A transparent analysis of current architectural trade-offs (3NF vs Performance), security considerations (XSS/JWT), and the future engineering roadmap



## Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/TomWai821/TS_MERN_LMS
    cd TS_MERN_LMS

2. **Set up environment variable:**
    - `.example` templates are included [Frontend .env example](./frontend/.env.example) and [Backend .env example](./backend/.env.example)
    - Copy the appropriate file, fill required values, then remove the `.example` suffix to run.
    ### Frontend
    1. Copy template:
       ```bash
       cp frontend/.env.example frontend/.env
      REACT_APP_API_URL
      
    2. Required variables (fill with real values):
       - REACT_APP_API_URL               —> Backend API endpoint, e.g. http://localhost:5000/api
       - REACT_APP_MAIN_PAGE             —> Frontend URL, e.g. http://localhost:3000
      
    ### Backend
    1. Copy template:
       ```bash
       cp backend/.env.example backend/.env
       ```
      
    2. Required variables (fill with real values):
       - PORT       —> backend port (default 5000)
       - MONGO_URI  —> MongoDB connection string
           - Docker: mongodb://mongo:27017
           - Local:  mongodb://localhost:27017
           - If connection issues, append /test (e.g. mongodb://localhost:27017/test)
       - JWT_SECRET —> secret for JWT authentication
       - ORIGIN_URI —> frontend URL, e.g. http://localhost:3000
       - GOOGLE_BOOKS_API_KEY  —> Google Books API key
       - GOOGLE_BOOKS_BASE_URL —> e.g. https://www.googleapis.com/books/v1/volumes
       - BACKEND_BASE_URL -> the backend base url for image, e.g. http://localhost:5000
       - STORAGE_TYPE -> the location of the image storage (S3 or LOCAL) 

    
3. **Import data into MongoDB (Local only):**
    - Open MongoDB Compass and import the JSON file located in the MongoDBSchema folder
    - This JSON file contains the complete data schema required for the application
  
4. **Run the application:**
    ### Using Docker
    ```bash
    # Start the project (use --detach to run in background)
    docker compose -f compose.yaml up --build --detach

    # If you need to reset the demo database and re-run initialisation scripts, stop containers and remove volumes
    # WARNING: this will permanently delete all persisted DB data
    docker compose down -v
    docker compose up --build --detach
    ```

    **Remarks**
    - The `./backend/MongoDBSchema` folder is mounted to `/docker-entrypoint-initdb.d` in the MongoDB container

    - These initialisation scripts run **only when the `db-data` volume is created for the first time**<br>
      (If the `db-data` volume already contains data, the scripts will be skipped)

    - To re-run initialization and restore the demo data, remove the volume and restart the stack:
      1. `docker compose -f compose.yaml down -v`  # WARNING: permanently deletes all persisted DB data
      2. `docker compose -f compose.yaml up --build`

    - The backend requires this demo data for proper functionality
      (If you run MongoDB locally instead of via Docker, import the Schema [JSON files](./backend/MongoDBSchema) (e.g. via MongoDB Compass))

    - Changing `JWT_SECRET` will invalidate existing JWTs and require users to re-login

    - `STORAGE_TYPE` will affect the logic on image handling and it is require in the .env

    - Modify build `target` and backend `NODE_ENV` to development before build the docker compose


    ### Using local environment
    #### Backend
    ```bash
    cd backend
    npm install
    nodemon backend/src/server.ts  
    ```
    #### Frontend
    ```bash
    cd frontend
    npm install
    npm start
    ```

6. **Expected URLs:**
    - Backend API → http://localhost:5000/api
    - Frontend    → http://localhost:3000
  
### Notes
- Express backend default port: 5000. React frontend default port: 3000
- MongoDB default DB: test
    - If DB init scripts are used in Docker, they run only when the volume is created for the first time
    - To re-run init scripts, remove the volume and restart
- [Demo Data](doc\DemonstrationMaterial\DemonStrationData.txt) (if needed)



## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b ${branchname}`).
3. Commit your changes (`git commit -m "comment"`).
4. Push the branch (`git push origin`).
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
