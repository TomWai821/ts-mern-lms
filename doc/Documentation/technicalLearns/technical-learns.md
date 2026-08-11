### Technical Learns 
1. System Architecture - **Layered Design (Router-Middleware-Controller-Service-Model)**
    - Designed a modular Express.js backend to achieve a clean Separation of Concerns

    - **Benefit**
        - Facilitates high code maintainability and allows independent testing of business logic and data access layers
  

2. Data Integrity & Consistency Management - **Reliable Image Persistence (Multer & fs/promises)**
    - Developed a custom workflow utilising memoryStorage to simulate atomicity<br>
      (Ensured that file system mutations (e.g. HandleDeleteImage) only execute after verifying primary database operations)

    - **Action**
        - **Coordinated Deletion & Logical Rollback**
            - Engineered a core-first deletion service via decoupled Service Layers, isolating master records from non-blocking background cleanups

        - **Redundancy Control**
            - Implemented Regex sanitisation and strict execution order to prevent "orphaned" files and redundant filename timestamps during consecutive edits

  
3. Type-Safe Development - **End-to-End TypeScript Integration**
    - Leveraged TypeScript across the full stack to enforce rigorous data structures and interface contracts

    - **Result**
        - Significantly reduced runtime TypeErrors
        - Improved developer productivity through IDE intelligent code completion
  

4. Security Logic - **Dual‑Token Authorisation for High‑Risk Loan Operations**
    - The loan workflow enforces dual‑token authorisation
      (A loan request proceeds only when both the borrower and librarian JWTs are present and validated)

    - **Benefit**
        - Prevents either party from performing high‑risk state changes alone
          (Reduce the risk of accidental operations or abuse of privileges)
          
        - Significantly raising the cost of the attack
          (Even if a single credential is compromised, an attacker still needs the other party’s authorisation to complete a loan)
  

5. State Orchestration - **Performance-Oriented Frontend Architecture**
    - Optimised React performance by centralising global state with Context API and encapsulated logic within Custom Hooks

    - **Benefit**
        - Minimised unnecessary component re-renders and established a predictable, one-way data flow


6. Cloud-Native DevOps & Infrastructure - **Scaling from PaaS to Serverless**
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
            - Achieved Zero-Downtime Deployments and optimised operational costs through Serverless scaling
            - Established a Hybrid Execution Model that seamlessly handles both persistent REST API traffic and scheduled background tasks across any environment


7. **Reducer Refactor – CRUD State Management**
    - Redesigned reducer to explicitly define CRUD state behaviors in advance
    - Simplified state handling and improved maintainability by centralizing transitions


8. **Real-time Synchronization – WebSocket vs CRUD Fetch**
    - **WebSocket Advantages**
        - Persistent connection enables instant push updates from server
        - Lower network overhead compared to repeated polling/fetch
        - Ensures immediate UI synchronisation across all connected clients
        - Particularly effective for admin/management dashboards with multi-user monitoring

    - **Frequent Fetch (CRUD GET) Advantages**
        - Simple and stateless, easier to implement and scale
        - Reliable for ensuring eventual consistency (always re-fetch latest data)
        - Works well with serverless environments (e.g. Lambda) where persistent connections are not feasible

    - **Trade-off Decision**
        - WebSocket chosen for local/EC2 deployment to achieve real-time synchronisation and reduce redundant GET calls
        - Frequent fetch retained as a fallback pattern in serverless contexts (Lambda)<br>
         (Where long-lived connections are unsuitable)


9. Cloud backend architecture trade-off - **Lambda (Serverless) vs EC2**
    - **Lambda (Serverless) Advantages**
        - Automatic scaling with no server management required
        - Pay-per-use model, ideal for event-driven or intermittent workloads
        - Well-suited for APIs, scheduled tasks, and batch processing

    - **EC2 Advantages**
        - Full control over OS, runtime, and networking
        - Stable environment for long-lived connections and continuous services
        - Better fit for applications requiring persistent sessions, such as WebSocket

    - **WebSocket Limitation with Lambda**
        - Lambda’s short execution lifecycle makes it unsuitable for maintaining persistent WebSocket connections (Cold start)
        - WebSocket deployment is therefore restricted to local or EC2 environments<br>
          (While Lambda is leveraged for stateless API endpoints)