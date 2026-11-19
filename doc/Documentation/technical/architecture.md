## System Architecture Overview

### Production Architecture
<img src="../../Image/Diagrams/ArchitectureDiagram_CD.png" style="width:90%;"/><br>
Figure 1 - Deployment Architecture Diagram<br>

#### Production Infrastructure
- The production environment leverages managed Cloud and SaaS services to minimise operational overhead while providing scalability, availability, and performance

- **Frontend**: Vercel (Next.js hosting and edge delivery)
- **Backend**: AWS Lambda deployed from Amazon ECR container images
- **Primary Database**: MongoDB Atlas (System of Record)
- **Cache Layer**: Amazon DynamoDB (Application-level caching)
- **Object Storage**: Amazon S3
- **External Services**
  - Google Books API (Book metadata retrieval)
  - DeepSeek API (AI-powered recommendation and analysis)
- **Automation**: Amazon EventBridge Scheduler
- **CI/CD**: GitHub Actions for automated build, testing, and deployment workflows


### Development Architecture
<img src="../../Image/Diagrams/ArchitectureDiagram_Development.png" style="width:90%;"/><br>
Figure 2 - Development Architecture Diagram<br>


#### Development Infrastructure
- **Local Environment Consistency**
  - Docker Compose is used to replicate the application's production-like architecture in a local development environment
  - Containerised services ensure consistent runtime dependencies and configurations across developer workstations
  - This approach reduces environment-specific issues and improves development reproducibility

- **Service Isolation**
  - Frontend, backend, and data services communicate through an isolated Docker network
  - Data stores are not directly accessible from client-facing components and can only be accessed through backend APIs
  - This mirrors the security boundaries used in the production environment

- **Data Persistence**
  - Persistent storage is provided through Docker Volumes to retain MongoDB and DynamoDB data across container restarts
  - Local databases can be reused between development sessions without requiring reinitialisation

- **External Service Integration**
  - Google Books API is used as the primary external source for book metadata and search results
  - DeepSeek API is integrated to support AI-driven features such as recommendation generation and content analysis
  - External services are kept outside the local container network to reflect real-world deployment dependencies

- **Continuous Integration**
  - GitHub Actions provides automated build and testing workflows
  - Quality assurance checks are executed before changes are merged, helping maintain deployment readiness and code quality

          


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