## Testing Strategy

### Overview
- **Frontend:** Unit tests with Jest + React Testing Library (mock APIs, setup/teardown hooks)  
- **Backend:** Integration tests with Jest + Supertest (real DB operations tested in CI pipeline)
- **Result:** Test suites are executed automatically within the CI pipeline on every push and pull request

### Test Environment Configuration
<details>
<summary>Docker test compose</summary>
    - Build test containers
    ```bash
    docker compose -f compose.test.yaml build
    ```
    - Start test environment
    ```bash
    docker-compose -f docker-compose.test.yml up
    ```
    - Run Jest tests inside container  
    ```bash
    docker exec backend npm test
    ```
</details>

<details>
<summary>Local test (Jest)</summary>
    - Start local server
        - For backend side
        ```bash
        npm run dev
        ```
        - For frontend side:
        ```bash
        npm run start
        ``` 

    - Run tests locally  
    ```bash
    npm run test
    ```
</details>


### Test Scope
- The following test case are using docker test compose (Jest)

#### Frontend Unit Tests
- Covered scenarios include:
    - User registration
    - Duplicate account registration
    - Login authentication
    - Invalid credential handling
    - Email validation
    - Password validation
    - Age restriction validation

- **Coverage**
    - Current Coverage: ~41.78%
    - Coverage reports are integrated into the CI workflow
    - Priority is given to critical user-facing workflows such as authentication and profile management

- **Source Code Files**
    - [Frontend Test Case Directory](../../../frontend/src/__tests__/)



#### Backend Integration Tests
- Covered scenarios include:
    - **User Management**
        - Account registration
        - Duplicate account handling
        - User authentication
        - JWT validation
        - Profile retrieval
        - User loan records
        - User favourite records


    - **Book Services**
        - Book retrieval
        - Filtered search
        - Invalid filter handling
        - Recommendation endpoints

- **Remarks**
    - Integration tests execute against a real MongoDB container
    - Test data is automatically cleaned up after execution
    - Database connections are established during setup and closed during teardown

- **Source Code Files**
    - [Backend Test Case Directory](../../../backend/__tests__/)