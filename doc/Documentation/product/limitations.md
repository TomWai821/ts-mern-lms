## Product Limitation

### Architecture
- **3NF Schema** 
    - Adopted early to accelerate prototyping (Note: This increases cross‑collection lookups, complicating server‑side RBAC and raising runtime costs)
    
- **Query Strategy**
    - Initially relied on aggregation pipelines; later recognised that many join functions are more efficiently handled with `.populate()` for better readability



### Frontend
- **Production Optimisation Still Pending** 
    - No production-grade optimisations (e.g. component memo, advanced caching)



### Backend
- **Testing Coverage** 
    - Integration test coverage is constrained by project scope (Core authentication flows are validated)

- **Error Handling** 
    - Minimalised for demo clarity (Using `console.error` and standard 400/500 HTTP status codes)



### Hardware Dependencies
- **QR Code Scanner Requirement** 
    - QR-based workflows currently require either a physical scanner or manual token injection during local testing



### Security
- **Client-side Token Storage** 
    - Authentication tokens are temporarily stored client-side to simplify demo and scanner-free testing workflows
    - This introduces XSS exposure risks and would be replaced by HttpOnly cookies in a production deployment



### Summary
- These limitations reflect deliberate trade-offs made to prioritise prototyping speed, architectural experimentation, and demonstration clarity
- Core business workflows are fully functional, while production-grade concerns such as advanced security, scalability, and comprehensive testing remain part of the long-term roadmap