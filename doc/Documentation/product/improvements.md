## Improvements

### Completed

#### Frontend Side
1. **Performance Optimisation (Route-based Lazy Loading)**
    - Implemented React Lazy & Suspense for Page Component Lazy Loading, significantly reducing the initial bundle size and improving the First Contentful Paint (FCP)

2. **Clean Architecture (View/Service Decoupling)**
    - Refactored Table Page components by extracting business logic into Custom Hooks<br>
      (This successfully decoupled View rendering from Service/Controller logic, enhancing testability and code reusability)<br>
      (Ref: ./frontend/src/services/*.tsx)

3. **Response-Driven API Service (frontend side)**
    - Refactored legacy API wrappers to return full HTTP Response objects, enabling granular error handling and dynamic UI state management based on status code
  
4. **I/O Concurrency & Fault Tolerance (Promise.allSettled)**
    - Implemented concurrent API fetching using Promise.allSettled to parallelise independent data requests<br>
      (This ensures UI resilience, allowing the dashboard to render partially even if individual microservices or endpoints fail)


#### Backend Side
1. **Modularised backend routes for cleaner structure**
    - Decoupled monolithic routes into modularised controllers, implementing Middleware for centralised authentication and validation to ensure DRY (Don't Repeat Yourself) principles

2. **Automated Library Compliance & Fine Processing**
    - Engineered a custom task scheduler to automate mission-critical daily operations (Expired Loans, Fines Calculation, Suspend Records) at UTC+8 midnight

3. **Performance Optimisation (Promise.all)**
    - Optimised multi-field database validations by refactoring sequential lookups into concurrent operations via Promise.all<br>
      (This significantly reduced API response latency by processing independent I/O tasks in parallel)

4. **Pipeline Filtering**
   - Engineered a multi-stage Middleware Pipeline for granular request filtering
   - Decoupled Type Validation, Data Integrity checks, and Query Sanitisation into discrete, reusable stages to enforce strict Domain Logic before reaching the controller layer<Br>
     (Ref: ./backend/src/middleware/Book/ContactValidation.ts, DefinitionValidation.ts)

5. **Hybrid Image Storage Engine**
    - Engineered a dual-strategy storage layer that dynamically switches between Local FS and Amazon S3 via environment toggles
    - This decouples business logic from infrastructure<br>
      (Ensure a zero-dependency local setup while optimising for the Stateless architecture of AWS Lambda)<br>
      (Ref: ./backend/src/service/image/*.ts)


#### Infrastructure and Security
1. **Multi-Environment Containerization (Docker)**
    - Implemented Dockerization with dedicated configurations for different stages<br>
      (docker-compose.yaml for production-ready consistency and docker-compose.test.yaml for automated testing workflows)<br>

2. **Standardised Development Lifecycle**
   - Ensures seamless parity across development, testing, and deployment, eliminating "it works on my machine" issues
    
3. **Modular Workspace & Dependency Isolation**
    - Architected a -style structure by separating Frontend and Backend into independent directories with isolated package.json and node_modules<br>
      (It improved CI/CD pipeline efficiency and prevented dependency conflicts, ensuring a cleaner and more scalable development workflow)<br>

4. **Secure Configuration Management (dotenv)**
   - Implemented Environment Variable management using dotenv to decouple sensitive configuration from the source code<br>
     (It enhanced system security by protecting API keys, Database URIs, and JWT secrets, facilitating seamless transitions between development and production environments)

5. **Scalable Cloud Migration (PaaS to AWS)** 
    - Orchestrated a strategic migration from PaaS (Railway) to a Serverless (AWS Lambda) and Containerized (ECR) environment<br>
      (This transition enhances operational control and enables auto-scaling capabilities to handle production-scale traffic efficiently)



#### CI/CD
1. **Automated Quality Gates** (GitHub Actions)
    - Automatically triggers Jest test suites and ESLint on every functional Push and Pull Request
      (Implemented Path-based Filtering to bypass CI/CD triggers for non-documentation changes (e.g., Markdown files, Images), ensuring CI resources are focused only on code-related regressions)<br>
  
2. **Resource & Cost Optimisation** (FinOps)
    - Implemented Ignored Build Steps and API-driven triggers to minimise redundant builds<br>
      (Leveraged Railway’s GraphQL API (environmentTriggersDeploy) to precisely manage deployment windows, optimising cloud credit consumption and operational costs)
  
3. **Security & Secret Orchestration** (OWASP Compliance)
    - Decoupled sensitive credentials (JWT Secrets, MongoDB URIs) from the source code using Platform Environment Variables and GitHub Action Secrets<br>
      (Adheres to OWASP security standards by ensuring zero-credential exposure and secure injection of production secrets at runtime)
  
1. **Environment Parity & Containerssation** (Docker)
    - Engineered a multi-stage Dockerfile to encapsulate the entire application environment<br>
      (Guaranteed 100% consistency between local development and cloud production (Railway/Vercel), eliminating "it works on my machine" deployment risks)



### Planned Improvements

#### Frontend Side
1. **System-wide Hook Migration**
    - Transition the remaining View components to the Custom Hook pattern to standardise state management and logic separation across the entire application<br>
      (Ref: `./frontend/src/customhook.tsx`)
    
2. **Refactor Context API into two specialised hooks**
    - One for data state and another for CRUD operations to improve maintainability and decouple view logic
  
3. **Optimised Modal Data Handling**
    - Pass index numbers instead of entire data objects to modals; use a getter function via Context to retrieve data, improving performance and readability
    
4. **Bulk Input Support**
    - Support multiple contact (Publisher/Author) inputs via JSON strings to enhance efficiency over manual field entry

5. **Unified API Transport Layer (Ajax Utils)**
    - Centralised API communication into a generic transport layer (Ref: `./frontend/src/improvement/AjaxUtils`)<br>
      (This standardises request/response formats and error-handling protocols, significantly decoupling business logic from the underlying fetch implementation)


#### Backend Side
1. **Server-side RBAC (Role-Based Access Control)**
    - Implement server-side role validation for all API requests to ensure data integrity (currently handled on the frontend for demo scope)
  
2. **Production-Grade Task Scheduling**
    - Replace basic `setInterval` + `setTimeout` with **node-cron** or cloud-based schedulers for better reliability and error handling
    
3. **Standardised Response Wrapper**
    - Implement a unified response structure (e.g., `errorCode`, `errorMessage`, `totalCount`) to improve API usability (Ref: `./backend/src/improvement/`)
    
4. **Generic CRUD Factory (OOP & Factory Pattern)**
    - Implemented a Generic CRUD Factory to encapsulate redundant DB operations across collections (Ref: `./backend/src/improvement/CRUDFactory.ts`)

5. **ACID Transactions (Multi-collection Consistency)**
    - Transitioning complex Write/Delete operations from **Promise.all** to **MongoDB Transactions** to ensure strict atomicity across related collections (e.g., cascading deletes) in production replica-set environments


#### Infrastructure and Security
1. **Container Granularity**
   - Migrating from a unified container to a fully decoupled micro-service architecture, separating Frontend (Nginx), Backend (Node.js), and Database (MongoDB) into isolated, dedicated containers

2. **Scalability & Networking**
   - Implementing a private Docker network for secure inter-service communication, allowing independent scaling of the API and Web layers to optimise resource allocation
     
3. **Hardware Integration**
    - Add direct **HID (Human Interface Device)** support for seamless scanner gun synchronisation
      
4. **Secure QR Code via Redis & UUID**
    - Map sessions to short-lived UUIDs in **Redis** with **TTL** to prevent `authToken` exposure and token reuse
    
5. **HttpOnly Server-side Cookies**
    - Migrate `authToken` storage to **HttpOnly Cookies** to mitigate **XSS (Cross-Site Scripting)** risks by preventing client-side script access

#### CI/CD
1. **Comprehensive Test Coverage (Jest)**
    - Expanding the testing suite to include Edge Case Validation and Boundary Testing across all API endpoints<br>
      (It aims to achieve 80%+ code coverage, ensuring high system resilience against unexpected user inputs and invalid payloads)

2. **Automated System Testing (E2E)**
    - Implementing End-to-End (E2E) / System Testing to simulate real-world user journeys from Frontend to Database<br>
      (It provides a higher dimension of verification beyond isolated units, ensuring the entire integrated stack functions correctly as a single system)