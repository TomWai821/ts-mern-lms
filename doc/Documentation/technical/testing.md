## Testing Strategy

### Overview
- **Frontend:** Unit tests with Jest + React Testing Library (mock APIs, setup/teardown hooks)  
- **Backend:** Integration tests with Jest + Supertest (real DB operations tested in CI pipeline)
- **Result:** CI pipeline runs tests automatically on push/PR, logs kept clean for recruiter/demo clarity

#### 1. Docker test compose (Jest)
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

#### 2. Local test (Jest)
1. Start local server
   - For backend side
   ```bash
   npm run dev
   ```
   - For frontend side:
   ```bash
   npm run start
   ``` 
2. Run tests locally  
   ```bash
   npm run test
   ```

### Test cases

THe following test case are using docker test compose (Jest)

#### Frontend
   
1. Register an account (In Register Page)
    - Expectation
        - Alert is shown with success colour (green)
        - Alert message is 'Registration successful! Redirecting...'
    - Result
        - Same as expectation

2. Input the already registered data (In Register Page)
    - Expectation
        - Alert is shown with error colour (red)
        - Alert message is 'Failed to register! Please try again'
    - Result
        - Same as expectation
   
3. Input DOB that is younger than 6 years old (In Register Page)
    - Expectation
        - HelperText is shown
        - HelperText message is 'Only users aged 6 years and older can register'
    - Result
        - Same as expectation
   
5. Login account (In Login Page)
    - Expectation
        - Alert is shown with success colour (green)
        - Alert message is 'Login successfully'
    - Result
        - Same as expectation
   
6. Input an invalid password (In the login page)
    - Expectation
        - Alert is shown with error colour (red)
        - Alert message is 'Invalid email or password!'
    - Result
        - Same as expectation

7. Let the email input field become empty (In the login page)
    - Expectation
        - HelperText is shown
        - HelperText message is 'Please enter a valid email address'
    - Result
        - Same as expectation
   
8. Let the password input field become empty (In the login page)
    - Expectation
        - HelperText is shown
        - HelperText message is 'password must be at least 6 characters long'
    - Result
        - Same as expectation


****Remarks****
- This is unit test
- Frontend test case in './frontend/src/__test__/Login.test.tsx'
- It will remove session storage and cookie storage data after completing each test case


****Test Coverage****
- Current Coverage: ~41.78%
- Coverage report integrated into CI workflow (viewable in GitHub Actions tab, last CI run)
- Focus on core process (Authentication, profile data, book data filtering)



#### Backend

***For User Data***
1. Account Registeration
    - Expectation:
        - Status Code 200
    - Result
        - Same as expectation

2. Account Registeration (with already registeration data)
    - Expectation
        - Status Code 400
        - error message should be 'Email already in use'
    - Result
        - Same as expectation

3. Account Login
    - Expectation
        - Status Code 200
        - message should be 'Login Successfully!'
    - Result
        - Same as expectation

4. Account Login (With Invalid email)
    - Expectation
        - Status Code 400
        - message should be 'Invalid email address'
    - Result
        - Same as expectation

5. Account Login (With Invalid password)
    - Expectation
        - Status Code 400
        - message should be 'Invalid password'
    - Result
        - Same as expectation

6. Get User Profile data
    - Expectation
        - Status Code 200
        - It should return an object which include username, gender, role in data column
    - Result
        - Same as expectation

7. Get User Profile data (With Invalid JWT Token)
    - Expectation
        - Status Code 401
    - Result
        - Same as expectation

8. Get User Loan Book Record
    - Expectation
        - Status Code 200
        - It should return [] (It is new account)
    - Result
        - Same as expectation

9. Get User Favourite Book Record
    - Expectation
        - Status Code 200
        - It should return [] (It is new account)
    - Result
        - Same as expectation

***For Book Data***
1. Get the whole book data
    - Expectation
        - Status Code 200
    - Result
        - Same as expectation

2. Get the whole book data with filter data (bookname=Harry)
    - Expectation
        - Status Code 200
    - Result
        - Same as expectation

3. Get the whole book data with invalid filter data (bookname=zzz)
    - Expectation:
        - Status Code 200
        - It should return []
    - Result
        - Same as expectation

4. Get recommend book data (Based on publish date)
    - Expectation
        - Status Code 200
        - It should return 8 records
    - Result
        - Same as expectation

5. Get recommend book data (Based on publish date)
    - Expectation
        - Status Code 200
        - It should has data in body(foundbook)
    - Result
        - Same as expectation

***Remarks***
- This is an integration test (Using real data in the MongoDB container)
- Backend test case in './backend/tests/*.ts'
- It will remove the created data after completing the whole test case
- It will connect to the MongoDB at the start and disconnect it after the whole test case

### Postman Smoke Test (Prefer docker environment)

#### Postman Environment
- base_url = http://localhost:5000
- email = IamTester@gmail.com
- password = IamTester
- token = (null if not logged in or absent)

Disclaimer: All contact information provided in this file is fictitious and used solely for demonstration purposes

#### Pre-request Script (Collection -> Pre-request Script)
``` javascript
// Pre-request Script: auto-login and save token to environment
const baseUrl = pm.environment.get("base_url") || "http://localhost:5000";
const email = pm.environment.get("email") || "IamTester@gmail.com";
const password = pm.environment.get("password") || "IamTester";

// Remove the if-check to always refresh token
if (!pm.environment.get("token")) {
  const loginRequest = {
    url: baseUrl + "/api/user/login",
    method: "POST",
    header: { "Content-Type": "application/json" },
    body: { mode: "raw", raw: JSON.stringify({ email, password }) }
  };

  pm.sendRequest(loginRequest, function (err, res) {
    if (err) {
      console.error("Login request failed", err);
      return;
    }

    let json = null;
    try { json = res.json(); } catch (e) { console.log(e); }

    let token = null;
    if (json) {
      token = json.token || (json.data && (json.data.token || json.data.authToken)) || json.accessToken || null;
    }

    if (!token) {
      try {
        const headerCandidates = ["authToken", "Authorization", "x-auth-token"];
        for (let i = 0; i < headerCandidates.length; i++) {
          const h = pm.response.headers.get(headerCandidates[i]);
          if (h) {
            token = h.replace(/^Bearer\s+/i, "");
            break;
          }
        }
      } catch (e) { console.log(e); }
    }

    if (token) {
      pm.environment.set("token", token);
      console.log("Token saved to environment");
    } else {
      console.warn("Token not found in login response", json || res.text());
    }
  });
}
```

Reminder 
    - If you run services locally (not via Docker), replace container hostnames with `localhost` and ensure `PORT` matches the backend port you started (e.g., 5000)

#### Request to run
1. Login
    ``` 
    POST {{base_url}}/api/user/login
    ```
    Body JSON:
    ```json
    {
        "email": "{{email}}",
        "password": "{{password}}"
    }
    ```
    
    Expected Result
    - Response Code: 200
    - success: true
    - data: Include username, role, authToken, status and avatarUrl
    - The token in the environment was set

2. Get books (All books) 
    ``` 
    GET {{base_url}}/api/book/bookData
    ```
    
    Expected Result
    - Response Code: 200
    - Get the whole book data (Totally 11 Records)

3. Get Books (With Filter)
    ```
    GET {{base_url}}/api/book/bookData?paginationAmount=10&pageAmount=1&genreID=67e7a3bf0ccdaa9c1766e958
    ```
    
    Expected Result
    - Response Code: 200
    - Get 2 Records

4. Get Loaned Record (Protected) - Require Login
    ```
    GET {{base_url}}/api/book/LoanBook
    ```
    Header: 
    authToken: {{token}}
    
    Expected Result
    - Response Code: 200
    - Get 1 Record (It is called Absolute Batman, this data at foundBook.bookDetails.bookname)
    
    Remarks and Test Cases (For Get Books with filter and Loaned Record)
    - GenreID examples
       - 67e7a3bf0ccdaa9c1766e958 → Japanese Comic
       - 67e26e59715e8a63743b7951 → Academic Textbooks
    - Other supported filters
       - publisherID (Example: 67e217b0b135608ea8ba432c → Bloomsbury)
       - languageID (Example: 67d101b76682366b8515c636 → English)
       - authorID (Example: 67e215c1ad7b49fc068fa048 → J.K. Rowling)
       - languageID with authorID (Example: authorID=67e215c1ad7b49fc068fa048&languageID=67d101cf6682366b8515c638) => It will return [] with Response Code 200 (67d101cf6682366b8515c638 → Simplified Chinese)
    - Pagination
        - Pagination = Items per page (Allow value: 10, 20, 50, 100)
        - pageAmount = Page number
       

5. Book Recommendation (Most Popular)
    ```
    GET {{base_url}}/api/book/LoanBook/type=mostPopular
    ```
    
    Expected Result
    - Response Code: 200
    - Get 4 Records (Only have 4 loaned records in bookloaneds collection)

Notes:
- The API may return [] or null when no matching data exists, or seed data is not present