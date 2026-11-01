## Completed Improvements

### Frontend Side
- **Performance Optimisation (Route-based Lazy Loading)**
    - Implemented React Lazy & Suspense for Page Component Lazy Loading, significantly reducing the initial bundle size and improving the First Contentful Paint (FCP)

- **Clean Architecture (View/Service Decoupling)**
    - Refactored Table Page components by extracting business logic into Custom Hooks<br>
      (This successfully decoupled View rendering from Service/Controller logic, enhancing testability and code reusability)<br>
      (Ref: [Frontend Service Directory](../../../frontend/src/services/))

- **Context State Management (useReducer over useState)**
    - Refactored Context Providers to adopt useReducer instead of multiple useState hooks
    - Extracted state transition logic out of Context into pure reducer functions<br>
      (This separation prevents Context from becoming bloated, while improving predictability, scalability, and testability of state management)<br>
      (Ref: [BookReducer.tsx](../../../frontend/src/Reducer/Book/BookReducer.tsx), [UserContext.tsx](../../../frontend/src/Context/Reducer/UserReducer.tsx))
  
- **State Management with WebSocket + Reducer (Client Side - Local)**
    - Eliminated redundant get API calls after every Create / Update / Delete (CUD) action
    - Leveraged WebSocket events bound to a reducer to update state directly in real time (with useWebSocket custom hook)<br>
      
<hr>

### Backend Side
- **Modularised backend routes for cleaner structure**
    - Decoupled monolithic routes into modularised controllers, implementing Middleware for centralised authentication and validation to ensure DRY (Don't Repeat Yourself) principles

- **Automated Library Compliance & Fine Processing**
    - Engineered a custom task scheduler to automate mission-critical daily operations (Expired Loans, Fines Calculation, Suspend Records) at UTC+8 midnight

- **Pipeline Filtering**
   - Engineered a multi-stage Middleware Pipeline for granular request filtering
   - Decoupled Type Validation, Data Integrity checks, and Query Sanitisation into discrete, reusable stages to enforce strict Domain Logic before reaching the controller layer<br>
     (Ref: [ContactValidationMiddleware.ts](../../../backend/src/middleware/Book/ContactValidationMiddleware.ts), [DefinitionValidationMiddleware.ts](../../../backend/src/middleware/Book/DefinitionValidationMiddleware.ts))

- **Hybrid Image Storage Engine**
    - Engineered a dual-strategy storage layer that dynamically switches between Local FS and Amazon S3 via environment toggles
    - This decouples business logic from infrastructure<br>
      (Ensure a zero-dependency local setup while optimising for the Stateless architecture of AWS Lambda)<br>
      (Ref: [Image Service Directory](../../../backend/src/service/image/))

<hr>

### Infrastructure and Security
- **Multi-Environment Containerization (Docker)**
    - Implemented Dockerization with dedicated configurations for different stages<br>
      (docker-compose.yaml for production-ready consistency and docker-compose.test.yaml for automated testing workflows)<br>

<hr>

### CI/CD
- **Automated Quality Gates** (GitHub Actions)
    - Automatically triggers Jest test suites and ESLint on every functional Push and Pull Request
    - Implemented Path-based Filtering to bypass CI/CD triggers for non-documentation changes (e.g. Markdown files, Images)<br>
      (It ensures CI resources are focused only on code-related regressions)
  
- **Security & Secret Orchestration** (OWASP Compliance)
    - Decoupled sensitive credentials (JWT Secrets, MongoDB URIs) from the source code using Platform Environment Variables and GitHub Action Secrets<br>
      (Adheres to OWASP security standards by ensuring zero-credential exposure and secure injection of production secrets at runtime)