## The Engineering Evolution
After graduation, I refactored the entire system to align with industry-standard engineering principles, focusing on Decoupling, Resilience, and Cloud-Native scalability:

### Architecture & Separation of Concerns
- **Original State**
    - Business logic, request handling, and UI concerns were tightly coupled across the application

- **Evolution**
    - Introduced layered backend architecture (Router → Middleware → Controller → Service → Model)
    - Refactored frontend pages to use reusable hooks and configuration-driven UI patterns

- **Key Learning**
    - Clear separation of concerns improves maintainability, testability, and long-term scalability

<hr>

### Service Boundary & Security Thinking
- **Original State**
    - External APIs were integrated directly from the frontend for rapid prototyping

- **Evolution**
    - Moved third-party integrations into backend services and exposed controlled internal APIs

- **Key Learning**
    - Backend services provide stronger control over validation, security, and future extensibility

<hr>

### DevOps & Cloud-Native Deployment
- **Original State**
    - Deployment, development, and execution environments were treated as separate concerns

- **Evolution**
    - Introduced Docker and GitHub Actions
    - Adapted background processing workflows to serverless constraints using EventBridge scheduling

- **Key Learning**
    - Infrastructure decisions directly influence application design, especially in cloud-native environments

<hr>

### Security as Part of Business Logic
- **Challenge**
    - Certain operations require approval from multiple actors rather than a single authenticated user

- **Evolution**
    - Introduced dual-party approval flows requiring both librarian and borrower validation

- **Key Learning**
    - Security should be embedded into business workflows rather than implemented as a separate layer
