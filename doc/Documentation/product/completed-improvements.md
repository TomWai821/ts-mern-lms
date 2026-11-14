## Completed Improvements

### Frontend Side
- **Application Architecture**
    - Migrated page-level business logic into reusable custom hooks to improve separation of concerns and code reuse
    - Refactored Context providers to use reducer-based state management for more predictable state transitions
    - Introduced a layered architecture that separates shared state, service operations, and mutation workflows


- **Performance & State Management**
    - Implemented route-based lazy loading to reduce initial bundle size
    - Added WebSocket-driven state synchronisation to reduce unnecessary data refetching after Create, Update, and Delete operations


- **References**
    - **Application Architecture**
        - [Book context](../../../frontend/src/Context/Book/BookContext.tsx)
        - [Book content service](../../../frontend/src/services/contents/bookService.ts)
        - [Book action hook](../../../frontend/src/hooks/actionhook/useBookAction.ts)

    - **Performance & State Management**
        - [Mutation feedback and sync](../../../frontend/src/hooks/customhook/useMutation.ts)
        - [WebSocket hook](../../../frontend/src/hooks/customhook/WebSocketts)
        - [WebSocket event maps](../../../frontend/src/services/ws/config/WSConfig.ts)
      
<hr>

### Backend Side
- **API Architecture**
    - Refactored backend routes into modular controllers and middleware-based request pipelines
    - Centralised authentication and validation logic to improve maintainability and enforce DRY principles

- **Domain Automation**
    - Implemented scheduled jobs for automated library operations such as expired loan processing and fine calculations

- **Infrastructure Abstraction**
    - Added support for both local file storage and Amazon S3 through a configurable storage abstraction layer

- **API Architecture**
    - **Domain Automation**
        - [AuthMiddleware.ts](../../../backend/src/middleware/USer/authMiddleware.ts)
        - [ContactValidationMiddleware.ts](../../../backend/src/middleware/Contact/ContactValidationMiddleware.ts)
        - [DefinitionValidationMiddleware.ts](../../../backend/src/middleware/Definition/DefinitionValidationMiddleware.ts)
    
    - **Infrastructure Abstraction**
        - [Image Service Directory](../../../backend/src/service/image/)

<hr>

### Infrastructure & DevOps
- **Containerisation**
    - Introduced Docker-based development and deployment environments to improve consistency across environments

- **CI/CD**
    - Implemented automated testing and linting through GitHub Actions
    - Added path-based workflow filtering to avoid unnecessary CI executions

- **Security**
    - Moved sensitive configuration into environment variables and GitHub Secrets