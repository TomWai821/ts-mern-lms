### Technical Learns 
- System Architecture - **Layered Design (Router-Middleware-Controller-Service-Model)**
    - Designed a modular Express.js backend to achieve a clean Separation of Concerns

    - **Benefit**
        - Facilitates high code maintainability and allows independent testing of business logic and data access layers
  

- Data Integrity & Consistency Management - **Reliable Image Persistence (Multer & fs/promises)**
    - Developed a custom workflow utilising memoryStorage to simulate atomicity<br>
      (Ensured that file system mutations (e.g. HandleDeleteImage) only execute after verifying primary database operations)

    - **Action**
        - **Coordinated Deletion & Logical Rollback**
            - Engineered a core-first deletion service via decoupled Service Layers, isolating master records from non-blocking background cleanups

        - **Redundancy Control**
            - Implemented Regex sanitisation and strict execution order to prevent "orphaned" files and redundant filename timestamps during consecutive edits

  
- Type-Safe Development - **End-to-End TypeScript Integration**
    - Leveraged TypeScript across the full stack to enforce rigorous data structures and interface contracts

    - **Result**
        - Significantly reduced runtime TypeErrors
        - Improved developer productivity through IDE intelligent code completion
  

- Security Logic - **Dual‑Token Authorisation for High‑Risk Loan Operations**
    - The loan workflow enforces dual‑token authorisation
      (A loan request proceeds only when both the borrower and librarian JWTs are present and validated)

    - **Benefit**
        - Prevents either party from performing high‑risk state changes alone
          (Reduce the risk of accidental operations or abuse of privileges)
          
        - Significantly raising the cost of the attack
          (Even if a single credential is compromised, an attacker still needs the other party’s authorisation to complete a loan)
  

- State Orchestration - **Performance-Oriented Frontend Architecture**
    - Optimised React performance by centralising global state with Context API and encapsulated logic within Custom Hooks

    - **Benefit**
        - Minimised unnecessary component re-renders and established a predictable, one-way data flow


- Cloud-Native DevOps & Infrastructure - **Scaling from PaaS to Serverless**
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