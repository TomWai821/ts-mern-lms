## Technical Tradeoff

### Real-time Synchronisation – WebSocket vs CRUD Fetch
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



### Cloud backend architecture trade-off - Lambda (Serverless) vs EC2
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