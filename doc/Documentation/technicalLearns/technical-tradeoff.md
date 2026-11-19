## Technical Tradeoff

### Frontend Architecture
- **Option A: Context-centric Architecture**
    - Advantages
        - Centralises CRUD operations, state management, and synchronisation logic in a single location
        - Easier for small projects with limited business logic
        - Fewer abstractions and files to maintain

- **Option B: Layered Architecture (Context + Service + Custom Hooks)**
    - Advantages
        - Context focuses on shared state, reducer logic, and refresh operations
        - Services encapsulate CRUD and API communication logic
        - Custom hooks coordinate mutation workflows, user feedback, and synchronisation behaviour
        - Improves maintainability, testability, and code reuse as the application grows

- **Design Decision**
    - Adopted the layered architecture to separate state management, API access, and UI-side mutation handling
    - Although it introduces additional abstraction, it reduces coupling and scales more effectively for feature-rich applications

- **References**
    - **Layered CRUD Architecture (Context + Service + Custom Hooks)**
        - [Book context](../../../frontend/src/Context/Book/BookContext.tsx)
        - [Book content service](../../../frontend/src/services/contents/bookService.ts)
        - [Book action hook](../../../frontend/src/hooks/actionhook/useBookAction.ts)

    - **State Synchronisation**
        - [Mutation feedback and sync](../../../frontend/src/hooks/customhook/useMutation.ts)
        - [WebSocket hook](../../../frontend/src/hooks/customhook/WebSocket.ts)
        - [WebSocket event maps](../../../frontend/src/services/ws/config/WSConfig.ts)

<hr>


### Authentication
- **Option A: Client-managed Session Storage / Local Storage**
    - Advantages
        - User information and tokens are immediately accessible from frontend code
        - Simpler to attach authentication headers to requests
        - Reduces the number of API calls required to retrieve user state

- **Option B: Server-managed Authentication (HttpOnly Cookies)**
    - Advantages
        - Authentication tokens are inaccessible to frontend JavaScript
        - Reduces exposure to XSS-related attacks
        - Authentication state remains authoritative on the server
        - Simplifies frontend token lifecycle management

- **Design Decision**
    - Chose server-managed authentication using HttpOnly cookies
    - User-specific data is retrieved from authenticated backend APIs rather than trusted directly from client-side storage
    - This approach prioritises security and consistency over minor reductions in network requests

- **References**
    - **Frontend Authentication**
        - [Frontend auth requests](../../../frontend/src/Controller/UserController/UserPostController.ts)
        - [Next.js middleware](../../../frontend/src/middleware.ts)

    - **Backend Authentication**
        - [Auth controller](../../../backend/src/controller/authController.ts)
        - [Backend auth middleware](../../../backend/src/middleware/User/authMiddleware.ts)

<hr>

### Cloud Architecture
- **Option A: AWS Lambda (Serverless)**
    - **Advantages**
        - Automatic scaling
        - Lower operational overhead
        - Cost-effective for stateless and event-driven workloads

- **Option B: EC2**
    - **Advantages**
        - Full control over runtime and networking
        - Better support for long-lived connections
        - Suitable for continuously running services

- **Design Decision**
    - Stateless API endpoints are deployed using Lambda
    - Real-time WebSocket services are hosted on EC2 due to their persistent connection requirements
    - This balances operational efficiency with real-time communication needs

<hr>

### Recommendation Strategy
- **Option A: Collaborative Filtering**
    - **Advantages**
        - Identifies recommendations based on behavioural patterns across users
        - Can surface books outside a user's established interests

    - **Challenges**
        - Requires a large volume of user interaction data
        - More difficult to validate recommendation quality
        - Higher implementation and testing complexity

- **Option B: Content-Based Filtering**
    - **Advantages**
        - Uses existing book metadata and borrowing history
        - Easier to explain recommendation results
        - Simpler to validate through real borrowing scenarios

    - **Challenges**
        - Recommendations may be biased towards existing user interests

    - **Design Decision**
        - Chose Content-Based Filtering using TF-IDF vectorisation, Cosine Similarit and genre weighting
        - The project has a relatively limited user interaction dataset
        - Content-based recommendations provided a more predictable implementation path and allowed recommendation quality to be validated directly against borrowing history