## Product Limitation

### Architecture
- **3NF-style Schema:** Adopted early to accelerate prototyping (Note: This increases cross‑collection lookups, complicating server‑side RBAC and raising runtime costs)
- **Query Strategy:** Initially relied on aggregation pipelines; later recognised that many join functions are more efficiently handled with `.populate()` for better readability

### Frontend
- **Separation of Concerns:** Component views and controllers are currently coupled (Appropriate for demo scope; requires refactoring for production maintenance)
- **Performance:** No production-grade optimisations (e.g., lazy loading, advanced caching)

### Backend
- **Testing:** Integration test coverage is constrained by project scope (Core authentication flows are validated)
- **Error Handling:** Minimalised for demo clarity (Using `console.error` and standard 400/500 HTTP status codes)

### Hardware Dependencies
- **Scanner Requirement:** Requires a physical scanner or camera for seamless QR input
- **Manual Fallback:** In non-scanner environments, manual injection of the `authToken` is required to simulate the scanning trigger

### Security
- **Token Storage:** `authToken` is currently in Client-side storage to facilitate manual testing in non-scanner environments (Standard production requires HttpOnly Cookies)
- **Vulnerability:** Susceptible to client-side script access (XSS risk), this trade-off is accepted specifically for the **Initial Prototype/Demo phase**

### Summary
- These limitations reflect the **demo-oriented nature** of the project
- Core flows are validated, while production-grade features (scaling, unified error handling) are intentionally deferred to focus on prototyping efficiency and recruiter clarity