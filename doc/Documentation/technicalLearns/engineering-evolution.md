## The Engineering Evolution
After graduation, I refactored the entire system to align with industry-standard engineering principles, focusing on Decoupling, Resilience, and Cloud-Native scalability:

### Architecture Overhaul
- **Problem**
    - The original implementation concentrated request handling and business logic within controllers, making the codebase harder to maintain as features expanded

- **Solution**
    - Refactored the backend into a layered architecture:
        - Router → Middleware → Controller → Service → Model

- **Key Lesson**
    - Separation of concerns improves maintainability, testing, and long-term scalability by isolating business logic from transport and persistence layers


### External API Integration Refactoring
- **Problem**
    - Google Books API requests were originally performed directly from the frontend to improve iteration speed during early development

- **Challenge**
    - Client-side API integration exposed implementation details and made sensitive configuration difficult to protect<br>
      (Since frontend environment variables are ultimately bundled and delivered to the browser)

- **Solution**
    - Moved Google Books integration to the backend service layer and exposed a controlled internal API for frontend consumption

- **Key Lesson**
    - External service integrations should be mediated through backend services whenever security, request validation, response transformation, or future extensibility are required


### DevOps & Deployment Evolution
- **Problem**
    - Local development, testing, and deployment environments frequently drifted apart

- **Solution**
    - Introduced Docker-based environment parity and GitHub Actions CI/CD pipelines

- **Key Lesson**
    - Automated validation and consistent runtime environments significantly reduce environment-specific failures


### Security Evolution
- **Challenge**
    - Certain loan operations required validation from multiple parties

- **Solution**
    - Implemented dual-token authorisation requiring both librarian and borrower authentication

- **Key Lesson**
    - Security requirements should be reflected directly in business workflows rather than treated as a separate concern


### Frontend Standardisation
- **Problem**
    - Administration pages contained duplicated state management and UI configuration logic

- **Solution**
    - Introduced metadata-driven UI configuration and reusable custom hooks

- **Key Lesson**
    - Configuration-driven design reduces duplication and improves long-term maintainability


### Background Job Evolution
- **Problem**
    - AWS Lambda cannot maintain continuously running background schedulers due to its stateless execution model

- **Solution** 
    - Introduced Amazon EventBridge Scheduler to trigger maintenance jobs such as overdue loan processing

- **Key Lesson**
    - Serverless architectures require event-driven scheduling patterns rather than long-running background services