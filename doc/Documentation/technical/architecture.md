## System Architecture Overview

### Production Architecture
<img src="../../Image/Diagrams/ArchitectureDiagram_CD.png" style="width:90%;"/><br>
Figure 1 - Deployment Architecture Diagram<br>

- The production stack leverages managed Cloud/SaaS solutions for high availability and performance:
  - **Frontend**: Vercel
  - **Backend**: AWS Lambda + ECR
  - **Storage**: Amazon S3
  - **Database**: MongoDB Atlas
  - **Automation**: EventBridge Scheduler



### Development Architecture
<img src="../../Image/Diagrams/ArchitectureDiagram_Development.png" style="width:90%;"/><br>
Figure 2 - Development Architecture Diagram<br>

**Development Infrastructure**
- **Environment Parity**
  - Docker Compose is used to replicate the application stack in a local development environment
  - This reduces "works on my machine" issues by ensuring consistent containerized services and configurations across development environments

- **Network Isolation**
  - Frontend, backend, and database services communicate through an isolated Docker network
  - MongoDB is not directly exposed to external clients and can only be accessed through the backend service

- **Persistence & Configuration Management**
  - Docker Volumes provide persistent database storage across container restarts
  - Environment-specific configurations are managed through separate .env files, enabling secure and flexible deployment settings

- **Continuous Integration**
  - GitHub Actions is integrated as the CI/CD pipeline for automated build and testing processes
  - Quality assurance checks are executed before code changes are integrated into the codebase

          


### Backend Architecture
<img src="../../Image/Diagrams/ProcessFlowDiagram.png" style="width:90%;"/><br>
Figure 3 - Backend Process Flow Diagram<br>

| Layer            | Responsibility	             |
| ---------------- | ----------------------------|
| Router           | equest Routing              |
| Middleware       | Validation & Authentication |
| Controller       | Request Coordination        |
| Service          | Business Logic              |
| Model (DB)       | Data Persistence            |

- The backend adopts a layered architecture consisting of Router, Middleware, Controller, Service and Model layers

- This structure separates request handling, validation, business logic and data access responsibilities<br>
  (Which reduce coupling between components and improving maintainability)

- Complex operations such as TF-IDF recommendations, image processing and query generation are delegated to dedicated services<br>
  (While MongoDB persistence is managed through Mongoose models)

<hr>

### Architectural Characteristics
- Serverless architecture based on AWS Lambda
- Stateless services with application state externalised to MongoDB Atlas and Amazon S3
- JWT-based authentication and platform-managed secret storage
- Horizontal scalability through managed cloud services

<hr>

### Key Engineering Decisions & Trade-offs
- **JWT Authentication**
  - Stateless authentication was chosen over server-side sessions to better support serverless deployments and horizontal scaling

- **Serverless Deployment**
  - AWS Lambda was selected over traditional server hosting to minimise infrastructure management overhead while providing cost-efficient scaling

- **Google Books Integration**
  - External book metadata is retrieved through Google Books API to avoid maintaining a large internal catalogue during the MVP stage

- **Layered Backend Architecture**
  - Router, Middleware, Controller, Service and Model layers were adopted to improve separation of concerns and maintainability

- **Pragmatic Hybrid Pattern**
  - Certain straightforward business logic remains within controllers during the MVP stage to prioritise development velocity and reduce unnecessary abstraction