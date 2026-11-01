## API Overview

### Authentication APIs
- JWT-based authentication is used for user identity verification and access control

| Endpoint                | Purpose             |
| ----------------------- | ------------------- |
| POST /api/user/login    | User authentication |
| POST /api/user/register | User registration   |



### User Management APIs
| Endpoint               | Purpose                  |
| ---------------------- | ------------------------ |
| GET /api/user/UserData | Retrieve user data       |
| PUT /api/user/UserData | Update user information  |
| DELETE /api/user/User  | Delete user account      |
| PUT /api/user/Suspend	 | Manage suspension status |



### Book Management APIs
| Endpoint                | Purpose                 |
| ----------------------- | ----------------------- |
| GET /api/book/record    | Retrieve book records   |
| POST /api/book/record   | Create book records     |
| PUT /api/book/record    | Update book records     |
| DELETE /api/book/record | Delete book records     |



### Loan Management APIs
| Endpoint                    | Purpose               |
| --------------------------- | --------------------- |
| GET /api/book/loanRecord	   | Retrieve loan records |
| POST /api/book/loanRecord   | Create loan records   |
| PUT /api/book/loanRecord    | Return borrowed books |
| DELETE /api/book/loanRecord	| Delete loan records   |



### Favourite Management APIs
| Endpoint                   | Purpose                  |
| -------------------------- | ------------------------ |
| GET /api/book/favourite	  | Retrieve user favourites |
| POST /api/book/favourite   | Add favourite book       |
| DELETE /api/book/favourite | Remove favourite book    |



### External Integration APIs
| Endpoint               | Purpose                  |
| ---------------------- | ------------------------ |
| GET /api/book/external | Google Books integration |



### Supporting Data APIs
| Category              | Resources          |
| --------------------- | ------------------ |
| Definition Management | Genre, Language    |
| Contact Management    | Author, Publisher  |
| Suspension Management | Suspend, Unsuspend |



### Standard Response Format
- Success
   - Most endpoints follow a consistent response structure:
      ```json
      {
         "success": true,
         "data": {}
      }
      ```

   - Actual response payload names may vary depending on the resource type (e.g. foundBook, foundUser or foundLoanBook)

- Failure
   ```json
   {
      "success": false,
      "error": "Error message"
   }
   ```