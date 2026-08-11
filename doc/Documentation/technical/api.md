## API Endpoints

### For Authenication
1. For login
   - Endpoint: `POST /api/user/Login`

      - Request Body Example
      ```Json
      {
         "email":"TimmyChan@gmail.com",
         "password": "123456"
      }
      ```
   
2. For Registration
   - Endpoint: `POST /api/user/Register`
   
      - Request Body Example
      ```Json
      {
         "username":"Timmy Chan",
         "email":"TimmyChan@gmail.com",
         "password":"123456",
         "birthDay":"1/1/1999",
         "gender":"Male"
      }
      ```

   - Validator in backend
      - Both request body are not allow null/empty value
      - Username at least require 3 characters
      - Password at least require 6 characters

   - Remarks
      - User record creation are using register API (In registration page/User management page)
      - Password will hashing with bcrypt
      - birthDay will transfer to Date type in backend side


### For User Data (Require authToken in header)
1. Get User data (For user management/suspend list)
   - Endpoints
      - `GET /api/user/UserData/tableName=:tableName` (For all record)
      - `GET /api/user/UserData/tableName=:tableName?username=a` (For username filtering)
      - `GET /api/user/UserData/tableName=:tableName?status=Normal` (For status filtering)
      - `GET /api/user/UserData/tableName=:tableName?role=User` (For role filtering)
      - `GET /api/user/UserData/tableName=:tableName?gender=Male` (For gender filtering)

   - Remarks
      - tableName = SuspendUser/AllUser
      - Get User data (For the direct user only)


   - Endpoint: `GET /api/user/UserData`

   - Remarks
      - It just require the authToken in header


2. Modify User data 
   - Endpoint: `PUT /api/user/UserData/id=:id`

      - Request Body Example
      ```Json
      {
         "username": "Johnny Chan",
         "password": "444444",
         "gender":"Female",
         "role":"Admin"
      }
      ```

   - Remarks
      - id = MongoDB ObjectID in user collection
   
3. Modify User data (For user himself)
   - Endpoint: `PUT /api/user/UserData/type=:type`
   
      - Request body(For username)
      ```Json
      {
         "username": "Jacky Wong"
      }
      ```

      - Request body(For password)
      ```Json
      {
         "password": "444444"
      }
      ```

   - Remarks
      - type = username/password
      - It will get the data from user collection with authToken(unhashed by JWT, then transfer to userID) before modify the username/password
   
4. Modify Suspend Data 
   - Endpoint: `PUT /api/user/Suspend/id=:id`

      - Request Body Example(For Suspend User)
      ```Json
      {
         "StatusForUserList": "Suspend",
         "description": "Does not return book many times",
         "startDate": "9-6-2025T04:06:50.006+00:00",
         "dueDate": "9-7-2025T04:06:50.006+00:00"
      }
      ```


5. Modify user Status (Include Suspend User/Unsuspend User)
   - Endpoint: `PUT /api/user/Unsuspend/id=:id`

   - Remarks
      - id = MongoDB ObjectID in user collection
   
6. Delete User data
   - EndPoint: `DELETE /api/user/User/id=:id`

   - Remarks
      - id = MongoDB ObjectID in user collection
   

   
### For Suspend List (Require authToken in header)
   1. Modify Suspend List data
      - Endpoint: `PUT /SuspendListData/id=:id`

         - Request Body Example
         ```Json
         {
            "suspendListID":"",
            "dueDate":"8-7-2025T04:06:50.006+00:00",
            "description":"Does not return books and paid fines many time"
         }
         ```

      - Remarks
         - id = the MongoDB ObjectID in user collection, it use to ensure the account was exist
         - suspendListID = the MongoDB ObjectID in suspendList


### For Book Data (Require authToken in header)
1. Get book data
   - Endpoints
      - `GET /api/book/record` (For all books)
      - `GET /api/book/record?bookname=a` (For all books with bookname filtering)
      - `GET /api/book/record?status=OnShelf` (For all books with status filter)
      - `GET /api/book/record?authorID=""` (For all books with authorID filtering)
      - `GET /api/book/record?publisherID=""` (For all books with publisherID filtering)
      - `GET /api/book/record?genreID=""` (For all books with genreID filtering)
      - `GET /api/book/record?languageID=""` (For all books with languageID filtering)
   - Remarks
      - authorID = MongoDB ObjectID in author collection
      - publisherID = MongoDB ObjectID in publisher collection
      - genreID = MongoDB ObjectID in genre collection
      - languageID = MongoDB ObjectID in language collection
   
2. Create book record
   
   - Endpoint:`POST /api/book/record`
      - Request Body Example
      ```Json
      {
         "bookname":"Beast Senpai Travelling Diary",
         "languageID":"",
         "genreID":"",
         "authorID":"",
         "publisherID":"",
         "description":"It collect the photo about the fun facts during beast senpai travelling",
         "publishDate":"2005-07-16T00:00:00.000+00:00"
      }
      ```
   - Remarks
      - authorID = MongoDB ObjectID in author collection
      - publisherID = MongoDB ObjectID in publisher collection
      - genreID = MongoDB ObjectID in genre collection
      - languageID = MongoDB ObjectID in language collection
   
3. Modify book record
   - Endpoint:`PUT /api/book/record/id=:id`
   - Request Body Example
      ```Json
      {
         "bookname":"Beast Senpai Travelling Diary",
         "languageID":"",
         "genreID":"",
         "authorID":"",
         "publisherID":"",
         "description":"It collect the photo about the fun fact during beast senpai travelling, and it cost $114514",
         "publishDate":"2005-07-16T00:00:00.000+00:00"
      }
      ```
   - Remarks
      - authorID = MongoDB ObjectID in author collection
      - publisherID = MongoDB ObjectID in publisher collection
      - genreID = MongoDB ObjectID in genre collection
      - languageID = MongoDB ObjectID in language collection
      - id = MongoDB ObjectID in book collection
   
4. Delete book record
   - Endpoint:`DELETE /api/book/record/id=:id``
   - Remarks
      - id = MongoDB ObjectID in book collection

### For Loan Books Data (Require authToken in header)
1. Get Loan Book record
   - Endpoints
      - `GET /api/book/loanRecord` (For all loan book record)
      - `GET /api/book/loanRecord?status=Returned` (For loan book record with status filtering)
      - `GET /api/book/loanRecord?bookname=Harry` (For loan book record with bookname filtering)
      - `GET /api/book/loanRecord?username=a` (For loan book record with username filtering)
      - `GET /api/book/loanRecord?finesPaid=Paid` (For loan book record with finesPaid status filtering)
   
2. Create Loan Record (Enforced Dual-Token Mutual Verification)
   - Endpoint: `POST /api/book/loanRecord`

      - Request Body Example
      ```Json
      {
         "userID":"",
         "bookID":"",
         "loanDate":"2025-06-09T00:00:00.000+00:00",
         "dueDate":"2025-06-16T00:00:00.000+00:00"
      }
      ```

   - Remarks
      - userID = MongoDB ObjectID in user collection
      - bookID = MongoDB ObjectID in book collection
      - It will change book status after loan record created
   
3. Modify Loan Book record
   - Endpoint: `PUT /api/book/loanRecord/id=:id`

      - Request Body Example
      ```Json
      {
         "finesPaid": "Not paid needed"
      }
      ```

   - Remarks
      - It will change the loan record status to returned/returned(late), based on the date to send the request(return book)
      - finesPaid could be "Not paid needed"/"Not paid"/"paid"
      - id = MongoDB ObjectID in bookloaned collection


4. DELETE Loan Book record
   Endpoint: `DELETE /api/book/loanRecord/id=:id`

   - Remarks
      -  id = MongoDB ObjectID in bookloaned collection
   
### For Favourite Book (Require authToken in header)
1. Get favourite book record
   - Endpoint:`GET /api/book/favourite`
   
2. Create a favourite book record
   
   - Endpoint:`POST /api/book/favourite`

      - Request body Example:
      ```Json
      {
         "bookID":""
      }
      ```

   - Remarks
      - It will get the userID from authToken(unhash by jwt)
      - BookID  = MongoDB ObjectID in book collection
   
3. Delete a favourite book record
   Endpoint:`DELETE /api/book/favourite/id=:id`

   - Remarks
      - id = MongoDB ObjectID in favourite book collection
   
### For Book data definition (Require authToken in header)
1. Create a new definition data
   - Endpoints
      - `GET /api/definition/type=:type`
      - `GET /api/definition/type=:Genre?genre=N` (Search genre with filter data)
      - `GET /api/definition/type=:Language?language=En` (Search language with filter data)

   - Remarks
      - type = Genre/Language
   
2. Get the whole definition data:
   - Endpoint: `POST /api/definition/type=:type`

      - Request Body Example(For Genre)
      ```Json
      {
         "genre":"Science Fiction",
         "shortName":"SF"
      }
      ```

      - Request Body Example(For Language)
      ```Json
      {
         "language":"English",
         "shortName":"EN"
      }
      ```

   - Remarks
      - type = Genre/Language
      - Here also has URL paramters(type) validation
   
   
3. Update the definition data:
   - Endpoint: `PUT /api/book/definition/type=:type?id=""`

      - Request Body Example(For Genre)
      ```Json
      {
         "genre":"Science Fiction",
         "shortName":"SF"
      }
      ```

      - Request Body Example(For Language)
      ```Json
      {
         "language":"English",
         "shortName":"EN"
      }
      ```

   - Remarks
      - type = Genre/Language
      - id = MongoDB ObjectID in langauge/genre collection

   
4. Delete the definition data
   - Endpoint: `DELETE /api/definition/type=:type?id=""`

   - Remarks
      - type = Genre/Language
      - id = MongoDB ObjectID in langauge/genre collection
   
### For contact data (Require authToken in header)
1. Creating a new contact
   - Endpoint: `GET /api/contact/type=:type`
   
      - Request Body Example(Author):
      ```Json
      {
         "author":"author",
         "phoneNumber": "N/A",
         "email": "N/A"
      }
      ```
   
      - Request Body Example(Publisher)
      ```Json
      {
         "publisher":"publisher",
         "phoneNumber": "N/A",
         "email": "N/A"
      }
      ```
   
2. Get the whole contact data
   - Endpoint: `POST /api/contact/type=:type`
   - Endpoint(For author filtering): `POST /api/contact/type=Author?author=a`
   - Endpoint(For publisher filtering): `POST /api/contact/type=Publisher?publisher=a`
   
3. Update the contact data
   - Endpoint: `PUT /api/contact/type=:type`
   
      - Request Body Example(Author)
      ```Json
      {
         "id": "",
         "author": "author",
         "phoneNumber": "12345678",
         "email": "author@gmail.com"
      }
      ```
   
      - Request Body Example(Publisher)
      ```Json
      {
         "id": "",
         "publisher": "publisher",
         "phoneNumber": "12345678",
         "email": "publisher@gmail.com"
      }
      ```
   
   - Remarks
      - id = MongoDB ObjectID in author/publisher collection
   
4. Delete the contact data:
   - Endpoint: `DELETE /api/contact/type=:type`

      - Request Body Example
      ```Json
      {
         "id": ""
      }
      ```
   - Remarks
      - id = MongoDB ObjectID


### For external data (Require authToken in header)
   - Endpoint: `GET /api/book/external/bookname=${bookname}&author=${author}`

      - Response (Does not have suitable data in External API):
      ```Json
      {
         "success": true,
         "foundExternalBook": 
         {
            "averageRating": "N/A",
            "ratingsCount": "N/A",
            "categories": "N/A",
            "saleability": "N/A",
            "listPrice": "N/A",
            "retailPrice": "N/A",
            "ISBN_13_Code": "N/A",
            "ISBN_10_Code": "N/A"
         }
      }
      ```

      - Response (Have suitable data in External API):
      ```Json
      {
         "success": true,
         "foundExternalBook": 
         {
            "averageRating": "4.5 (From Google Books)",
            "ratingsCount": "34",
            "categories": "Science Fiction",
            "saleability": "FOR_SALE",
            "listPrice": "HKD$99.99",
            "retailPrice": "HKD$99.99",
            "ISBN_13_Code": "978XXXXXXXXXX",
            "ISBN_10_Code": "XXXXXXXXX"
         }
      }
      ```

### Response
1. If failed to implement CRUD operations
   ```Json
   {
     "success": false,
     "error": ""
   }

2. If implement CRUD operations/Authenticate successfully
   - For Authenticate
   ```Json
   {
      "success": true,
      "authtoken": ""
   }
   ```

   - For User Data
   ```Json
   {
      "success": true,
      "foundUser": [ {/* user data */} ]
   }
   ```

  - For Book data
   ```Json
   {
      "success": true,
      "foundBook": [ {/* book data */} ]
   }
   ```

   - For Definition Data
   ```Json
   {
      "success": true,
      "foundDefinition": [ {/* definition data */} ]
   }
   ```

   - For Contact Data
   ```Json
   {
      "success": true,
      "foundContact": [ {/* contact data */}]
   }
   ```

   - For Loan Book Data
   ```Json
   {
      "success": true,
      "foundLoanBook": [ {/* loan book data */}]
   }
   ```

   - For Favourite Book Data
   ```Json
   {
      "success": true,
      "foundFavouriteBook": [ {/* user favourite book data */}]
   }
   ```
