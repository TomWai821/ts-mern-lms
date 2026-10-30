### Planned Improvements

#### Frontend Side
1. **System-wide Hook Migration**
    - Transition the remaining View components to the Custom Hook pattern to standardise state management and logic separation across the entire application<br>
      (Ref: [customhook Directory](../../../frontend/src/customhook))
    

2. **Unified API Transport Layer (Ajax Utils)**
    - Centralised API communication into a generic transport layer (Ref: [AjaxUtils.ts](../../../frontend/src/improvement/AjaxUtils.ts))<br>
      (This standardises request/response formats and error-handling protocols, significantly decoupling business logic from the underlying fetch implementation)



#### Backend Side
1. **Server-side RBAC (Role-Based Access Control)**
    - Implement server-side role validation for all API requests to ensure data integrity (currently handled on the frontend for demo scope)
    
2. **Generic Repository + Factory Pattern (TypeScript OOP Architecture)**
    - Developed a Generic Repository to eliminate repetitive CRUD source code across collections (Ref: [GenericRepository.ts](../../../backend/src/Improvement/GenericRepository.ts))<br>
      (It Improve maintainability and consistency)

    - Integrated a Repository Factory for centralised management and type-safe instantiation (Ref: [RepositoryFactory.ts](../../../backend/src/Improvement/RepositoryFactory.ts))<br>
      (It reduce input errors and simplifying future extension)

3. **ACID Transactions (Multi-collection Consistency)**
    - Transitioning complex Write/Delete operations from **Promise.all** to **MongoDB Transactions**<br>
      (Ensure strict atomicity across related collections (e.g. cascading deletes) in production replica-set environments)



#### Infrastructure and Security
1. **Secure QR Code via Redis & UUID**
    - Map sessions to short-lived UUIDs in **Redis** with **TTL** to prevent `authToken` exposure and token reuse
    
2. **HttpOnly Server-side Cookies**
    - Migrate `authToken` storage to **HttpOnly Cookies** to mitigate **XSS (Cross-Site Scripting)** risks by preventing client-side script access



#### CI/CD
1. **Automated System Testing (E2E)**
    - Implementing End-to-End (E2E) / System Testing to simulate real-world user journeys from Frontend to Database<br>
      (It provides a higher dimension of verification beyond isolated units, ensuring the entire integrated stack functions correctly as a single system)