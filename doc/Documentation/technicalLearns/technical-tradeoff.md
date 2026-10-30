1. **Real-time Synchronisation – WebSocket vs CRUD Fetch**
    - **WebSocket Advantages**
        - Persistent connection enables instant push updates from server
        - Lower network overhead compared to repeated polling/fetch
        - Ensures immediate UI synchronisation across all connected clients
        - Particularly effective for admin/management dashboards with multi-user monitoring<br>
          (Ref: [Web Socket Service and Config](../../../frontend/src/services/ws), [useWebSocket](../../../frontend/src/customhook/WebSocket.tsx))

    - **Frequent Fetch (CRUD GET) Advantages**
        - Simple and stateless, easier to implement and scale
        - Reliable for ensuring eventual consistency (always re-fetch latest data)
        - Works well with serverless environments (e.g. Lambda) where persistent connections are not feasible

    - **Trade-off Decision**
        - WebSocket chosen for local/EC2 deployment to achieve real-time synchronisation and reduce redundant GET calls
        - Frequent fetch retained as a fallback pattern in serverless contexts (Lambda)<br>
         (Where long-lived connections are unsuitable)



2. **Cloud backend architecture trade-off - **Lambda (Serverless) vs EC2**
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



3. Cloud-Native DevOps & Infrastructure - **Scaling from PaaS to Serverless**
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