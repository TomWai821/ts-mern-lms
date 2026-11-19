## Future Enhancements

### Frontend
- Complete migration to the custom hook architecture across all pages
- Introduce a unified API transport layer for standardised request and error handling

- **References**
    - [customhook Directory](../../../frontend/src/hooks/customhook)
    - [AjaxUtils.ts](../../../frontend/src/improvement/AjaxUtils.ts)

<hr>

### Backend
- Implement server-side Role-Based Access Control (RBAC)
- Integrate a generic repository and factory abstraction to reduce repetitive CRUD logic
- Replace multi-step write operations with MongoDB transactions where strong consistency is required

- **References**
    - [GenericRepository.ts](../../../backend/src/Improvement/GenericRepository.ts)
    - [RepositoryFactory.ts](../../../backend/src/Improvement/RepositoryFactory.ts)

<hr>

### Security
- Introduce short-lived QR credentials backed by Redis and UUID-based mappings

<hr>

### Testing
- Expand automated end-to-end testing coverage for critical user journeys
