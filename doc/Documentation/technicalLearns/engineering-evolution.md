### The Engineering Evolution
After graduation, I refactored the entire system to align with industry-standard engineering principles, focusing on Decoupling, Resilience, and Cloud-Native scalability:

- Architectural Overhaul: **Layered Decoupling**
    - Transitioned from a monolithic script to a Layered Architecture (Router-Middleware-Controller-Service-Model)
    
    - **Impact**
        - Isolated business logic from transport and persistence layers<br>
          (Enable independent scaling of services and reducing regression risks during feature iterations)


- Logic Refactoring: **Backend-Driven Computation**
    - Offloaded heavy business logic (such as the TF-IDF Recommendation Engine, from the client-side to the Backend Service Layer)

    - **Benefit**
        - **Resource Decoupling**
            - Prevented client-side browser freesing during high-intensity vector computations, ensuring a responsive interface regardless of the library's data volume

        - **Centralised Computation** 
            - Guaranteed a single source of truth for recommendation logic
              (Ensure consistent results across all user sessions and facilitating future algorithmic updates without client-side redeployment)



- DevOps Integration: **Environment Parity & CD Readiness**
    - Orchestrated a Dockerized environment integrated with GitHub Actions to enforce a rigorous CI pipeline (Linting, Integration Testing)

    - **Implementation**
        - Specifically engineered the Dockerfile to be compatible with AWS Lambda Web Adapter (e.g., configuring port mapping and extension layers)

    - **Impact**
        - Achieved high-fidelity environment parity between local development and AWS Serverless runtime
        - Effectively eliminating "it works on my machine" issues during the migration from PaaS to AWS