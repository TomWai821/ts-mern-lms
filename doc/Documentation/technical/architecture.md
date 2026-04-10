## Architecture

### System Architecture Overview
***Architecture Diagram - Development***
<img src="../../../Image/Diagrams/ArchitectureDiagram_Development.png" style="width:90%;"/><br>

1. **Development & Deployment Infrastructure**
- **Environment Parity**
    - Leveraging Docker Compose to mirror the production environment locally<br>
      (Reducing "works on my machine" inconsistencies via consistent container orchestration)
- **Network Isolation**
    - All internal services communicate securely within a Docker Virtual Network
    - The database (MongoDB) is isolated from external access, accessible only by the backend service
- **Persistence & Config**
    - Utilises Docker Volumes for persistent data retention
    - Decoupled environment-specific settings via localised .env files for enhanced security
          
2. **Backend Layered Architecture**
- The backend follows a Modular Layered Architecture to achieve Separation of Concerns (SoC) and ensure system scalability

| Layer            | Responsibility	                                                                 | Key Practice                                              |
| ---------------- | --------------------------------------------------------------------------------| --------------------------------------------------------- |
| Routing          | Resource-based dispatching (e.g., /books, /users)                               | Decoupled Modules using express.Router                    |
| Middleware       | Handles Auth (JWT), Validation, and Integrity checks                            | The Quality Gate for incoming data                        |
| Controller       | Orchestrates request lifecycle and core CRUD operations                         | Action-oriented and delegated Query Building to Services  |
| Service          | Core Algorithms (TF-IDF), External API (Google Books)	                         | Pure logic Isolation; strictly return-value driven        |
| Model (DB)       | Schema definitions and Data Access Logic	                                       | Data Integrity via Mongoose static methods                |

**Architectural Decision: Service Logic Integration**
- **Pragmatic Hybrid Pattern**
    - To maintain high development velocity during the MVP phase, certain straightforward business logic is currently encapsulated within the Controller Layer
    
- **Future-Proofing & Scalability**
    - As illustrated in the Request Lifecycle Diagram, core complex logic—such as the TF-IDF Recommendation Engine—is designed with high modularity<br>
      (Ready to be fully decoupled into a dedicated Service Layer to enhance Unit Testability (TDD) as the system scales)
    
- **Automated Quality Assurance**
    - Integrated GitHub Actions for automated linting and build checks, ensuring every deployment meets the system's "Quality Gate" standards



***Architecture Diagram - CD (Continuous Deployment)***<br>
<img src="../../Image/Diagrams/ArchitectureDiagram_CD.png" style="width:90%;"/><br>

- The production stack leverages managed Cloud/SaaS solutions for high availability and performance:
  - **Frontend**: Hosted on Vercel for optimised edge delivery and seamless React integration
  - **Backend**: Deployed on AWS Lambda via Amazon ECR (Docker Container Image), providing a scalable, serverless execution environment
  - **API Management**: Managed by Amazon API Gateway to handle REST API requests and CORS validation
  - **Storage**: Amazon S3 is utilised for persistent image storage and retrieval
  - **Database**: MongoDB Atlas (DBaaS) for managed security and global scaling
  - **Security**: Credentials are securely injected via Platform Secrets (Vercel/GitHub/AWS), ensuring zero-credential exposure in the source code

### Core Concept for the whole Architecture
- Regardless of the environment (Local or Production), the core application logic remains consistent and follows a unified quality standard:
  - **Modular Backend**: Follows the Route-Middleware-Controller pattern with Mongoose for data access
  
  - **CI/CD Pipeline**: GitHub Actions serves as the central orchestrator:
    - **Frontend Deployment**: Triggers Deploy Hooks to Vercel to initiate automated builds
    - **Backend Deployment**: Automates the Docker Build & Push process to Amazon ECR and triggers Lambda function updates via AWS CLI
    - **Stateless Architecture**: Ensures the backend remains stateless by offloading file management to Amazon S3 and data to MongoDB Atlas
    - **Quality Gate**: Ensures code reliability through automated testing and linting before any deployment

### Frontend
***Sequence Diagram (Authentication)***
    
1. Registration<br>
<img src="../../Image/Diagrams/RegisterSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram illustrates the modular backend registration flow — from frontend validation and request dispatch, to database interaction and token generation<br>
  (It ensures secure account creation with robust error handling and clean separation of concerns across services)<br>
       
2. Login<br>
<img src="../../Image/Diagrams/LoginSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram illustrates the login flow across frontend and backend layers — from validation and request dispatch to database verification and token generation<br>
  (It ensures secure authentication with proper error handling and modular separation across components such as middleware, endpoint logic, and MongoDB integration)<br>
    
***Sequence Diagram (Project Features)***
1. External Data from Google Book API
<img src="../../Image/Diagrams/SequenceDiagramForGetDataFromGoogleBook.png" style="width:90%;"/><br>
- This sequence diagram illustrates the book data retrieval flow initiated by a frontend GET request to the Google Books API
- When the user presses the book image, an event handler constructs and sends a request containing the book name and the author name
- The event handler processes the returned data and renders the book results to the user interface (When receiving the response)
    
2. QR Code Generation<br>
<img src="../../Image/Diagrams/QRCodeModalSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram illustrates the QR Code generation flow initiated by a user interaction
- When the user clicks the "Display QR Code" button, the event handler retrieves the authentication token and username from local or cookie storage
- Then it parses the data and sends a request to the QR Code Generator service
- The event handler opens a modal and displays the generated QR code to the user (When the response is received)

    
***Sequence Diagram (CRUD operations)***
1. Get data from the backend side<br>
<img src="../../Image/Diagrams/GetDataSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram illustrates the data retrieval flow initiated via a frontend GET request
- The process involves middleware-level parsing, backend token validation, and data querying from MongoDB
- With modular orchestration across services and structured response handling, it ensures secure and reliable delivery of data to the client<br>
    
    
2. Data Creation
<img src="../../Image/Diagrams/CreateDataSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram illustrates the user confirmation flow, beginning with a frontend POST request and progressing through middleware parsing, backend validation, and MongoDB record creation
- It demonstrates secure data handling with token verification, modular backend orchestration, and structured client response<br>
  (It ensures reliability and clarity in the user confirmation process)<br>
    
    
3. Data Modification
<img src="../../Image/Diagrams/UpdateDataSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram illustrates the confirmation flow via a frontend PUT request<Br>
  (Showing how user-modified data is securely validated, parsed, and updated in the backend)<br>
- The system ensures accurate record updates and clear client feedback with middleware safeguards, token verification, and modular backend orchestration
    
    
4. Data Deletion
<img src="./Image/Diagrams/DeleteDataSequenceDiagram.png" style="width:90%;"/><br>
- This sequence diagram captures the user confirmation flow initiated via a frontend DELETE request
- The process includes middleware-level data parsing, backend token validation, and MongoDB record deletion<br>
  (It ensures secure and reliable user operations through structured response handling and modular orchestration across services)<br>

5. Get Data From Google Books (API Integration)
<img src="../../Image/Diagrams/GetDataFromGoogleBookAPI.png" style="width:90%;"/><br>
- The application uses a Node.js middleware to bridge the React frontend with the Google Books API<br>
  (When a user searches for a book, the backend first validates the user's Auth Token for security)<br>
- After fetching the raw data from the external API, the backend filters and refines the response into a clean payload<br>
  (This approach optimises performance, enhances data security and ensures the frontend only receives the necessary information for UI rendering)<br>


### Backend

***Backend Process Flow Diagram and another function***<br>
<img src="../../Image/Diagrams/ProcessFlowDiagram.png" style="width:90%;"/><br>
Backend side using modular API design, therefore, using the backend process flow diagram is better than using a class diagram to explain the backend architecture
| Component               | Usage                                                                                                  | Example Path (Backend - Book data)                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Client / Request        | Initiates API calls via Fetch from the frontend	                                                       | frontend/src/Controller/bookController.ts                                                       |
| Entry Point             | Initialises the Express server and mounts core middleware                                              | backend/src/index.ts                                                                            |
| Router                  | Orchestrates resource-based routing modules                                                            | backend/src/routes/book.ts                                                                      |
| Validator               | Enforces Schema Validation (Request Body) before processing                                            | backend/src/validator/expressBodyValidator.ts                                                   |
| Auth Middleware         | Handles Identity & Access Control (JWT)                                                                | backend/src/middleware/User/authMiddleware.ts                                                   |
| Business Middleware     | Performs Integrity Checks (e.g. verifying DB record existence)                                         | backend/src/middleware/Book/bookValidationMiddleware.ts                                         |
| Controller              | Orchestrates request parsing, service logic, and core DB interactions (CRUD without query building)    | backend/src/controller/bookController.ts                                                        |
| TF-IDF Engine	(Service) | Core Algorithm Service for search and recommendations                                                  | backend/src/controller/TF-IDF_Logic.ts, backend/src/service/bookRecommendationService.ts        |
| Image Handler (Service) | Manages atomic file storage (memoryStorage), filename sanitisation (Regex), and disk I/O (fs/promises) | backend/src/controller/bookController.ts, backend/src/service/book/HandleEditImageService.ts    |
| Query Builder (Service) | Implements dynamic filter pre-processing and data sanitisation before DB execution                     | backend/src/service/book/*.ts                                                                   |
| Data Access (Model)     | Defines Mongoose Schemas and manages Persistent Storage	                                               | backend/src/schema/book/book.ts                                                                 |
| API Response	          | Standardises and returns the final JSON response to the client	                                       | backend/src/controller/bookController.ts                                                        |

**Remarks**
- Controllers in this repo perform business logic (act like the service) and send the final HTTP response at the end of the handler using res.status(...).json(...)
- Helper functions may return values for unit tests, but controllers must call res in runtime

Other functions (grouped, not on the main synchronous path)
| Function                   | Usage                                                                                                       | Example Path                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| CI Pipeline (Quality Gate) | Automated Linting and Unit/Integration Testing on every mon-documentation Push/PR                           | .github/workflows/ci.yml,  .github/workflows/cd.yml          |
| Infrastructure/Init        | Container orchestration and automated DB Schema initialisation / Seeding for environment parity             | docker-compose.yml/compose.yaml, backend/MongoDBSchema/*     |
| Scheduled Jobs             | Background services for critical business logic (e.g., overdue detection and automated fine calculation)    | backend/detectRecord.ts                                      |


### Database

***Entity-Relational Diagram(ERD)***<br>
<img src="../../Image/Diagrams/EntityRelationDiagram-LibraryManagementSystem.png" style="width:75%;"/><br>
This ERD explain the database schema for the Library Management System


****Collections related to book data****<br>
Book
| Key Attribute | Type     | Enum                  | Required | Default   | Description                                                              |
| ------------- | ---------| --------------------- | -------- | --------- | ------------------------------------------------------------------------ |
| image         | Object   |                       |          |           | Stores book cover image details, including URL and filename              |
| bookname	    | String   |                       | True     |           | The title of the book for identification                                 |
| languageID    | ObjectID |                       | True     |           | References for the Language collection, indicating the book's language   |
| genreID       | ObjectID |                       | True     |           | References the Genre collection, categorising the book                   |
| authorID      | ObjectID |                       | True     |           | Links to the Author collection, storing authorship details               |
| publisherID   | ObjectID |                       | True     |           | Assoates with the publisher collection for book publishing details       |
| status        | String   | ['OnShelf', 'OnLoan'] | True     | 'OnShelf' | Defines the book’s availability, such as OnShelf and Loaned              |
| description   | String   |                       |          | 'N/A'     | Provides a brief overview or synopsis of the book                        |
| publishDate   | Date     |                       |          |  Date.now | The official publication date of the book, indexed for search efficiency |

Genre
| Key Attribute | Type   | Required  | Unique | Description                                                                   |
| ------------- | ------ | --------- | ------ | ------------------------------------------------------------------------------|
| genre         | String | True      | True   | The full name is used to represent the genre, ensuring correct classification |
| shortName     | String | True      | True   | An abbreviated version of the genre name is used for display purposes         |

Language
| Key Attribute | Type   | Required  | Unique | Description                                                                   |
| ------------- | ------ | --------- | ------ | ----------------------------------------------------------------------------- |
| language      | String | True      | True   | The full name used to represent the language, ensures correct classification  |
| shortName     | String | True      | True   | An abbreviated version of the language name is used for display purposes      |

Author
| Key Attribute | Type   | Required  | Unique | Default | Description                                                                              |
| ------------- | ------ | --------- | ------ | ------- |----------------------------------------------------------------------------------------- |
| author        | String | True      | True   |         | The full name of the author, stored for identification purposes                          |
| phoneNumber   | String |           |        | 'N/A'   | The contact number provided for communication with the author                            |
| email         | String |           |        | 'N/A'   | The email address used for professional or system-related correspondence with the author |

Publisher
| Key Attribute |  Type  | Required | Unique | Default | Description                                                                                 |
| ------------- | ------ | -------- | ------ | ------- | ------------------------------------------------------------------------------------------- |
| publisher	    | String | True     | True   |         | The full name of the publisher, stored for identification purposes                          |
| phoneNumber   | String |          |        | 'N/A'   | The contact number provided for communication with the publisher                            |
| email         | String |          |        | 'N/A'   | The email address used for professional or system-related correspondence with the publisher |


****Collections related to user data****<br>
User
| Key Attribute | Type    | Enum                  | Required | Unique | Default  | Description                                   |
| ------------- | ------- | --------------------- | -------- | ------ | -------- | --------------------------------------------- |
| Username      | String  |                       | True     | True   |          | The unique display name chosen by the user    |
| Email         | String  |                       | True     | True   |          | Primary identifier for authentication         |
| Password      | String  |                       | True     |        |          | Encrypted storage for login credentials       |
| Gender        | String  |                       | True     |        |          | Captures gender identity for the user profile |
| Role          | String  | ['User', 'Admin']     | True     |        | 'User'   | Defines permissions for admin and user        |
| Status        | String  | ['Normal', 'Suspend'] | True     |        | 'Normal' | Describe the account status                   |
| birthDay      | Date    |                       | True     |        |          | Stores the user’s date of birth               |
| avatarurl     | String  |                       | True     |        |          | The URL for the avatar image                  |

SuspendList
| Key Attribute |	Type      | Enum                     | Required | Default            | Description                                                                                                |
| ------------- | --------- | ------------------------ | -------- | ------------------ | -----------------------------------------------------------------------------------------------------------|
| userID        | ObjectID  |                          |          |                    | Links to the user collection, ensuring proper tracking of suspended individuals                            |
| description	  | String    |                          |          | 'N/A'              | Stores details about the reason for the user's suspension, ensuring proper enforcement of library policies |
| Status        | String    | ['Suspend', 'Unsuspend'] | True     | 'Suspend'          | Describe the account status, such as Normal, Suspend                                                       |
| startDate	    | Date	    |                          |          |                    | The date when the user suspension begins                                                                   |
| dueDate       | Date      |                          |          |                    | The scheduled date when the suspension will end, allowing access restoration                               |


****Collections related to interaction between book and user****<br>
BookLoaned
| Key Attribute | Type     | Enum                                     | Required | default           | Description                                                                                          |
| ------------- | -------- | ---------------------------------------- | -------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| userID        | ObjectID |                                          | True     |                   | References the User collection                                                                       |
| bookID        | ObjectID |                                          | True     |                   | References the Book collection                                                                       |
| loanDate      | Date     |                                          | True     |                   | The date when the user loaned the book                                                               |
| dueDate       | Date     |                                          | True     |                   | The date on which the book should return                                                             |
| returnDate    | Date	   |                                          |          | null              | The actual date when the book returns                                                                |
| Status        | String   | ['Returned', 'Loaned', 'Returned(Late)'] |          | 'Loaned'          | Defines the loan status, such as Loaned, Returned                                                    |
| finesAmount   | Number   |                                          |          | 0                 | The monetary fine for overdue book returns                                                           |
| finesPaid	    | String   | ['Not Fine Needed', 'Paid', 'Not Paid']  |          | 'Not Fine Needed' | Indicate whether the fine was paid, with predefined statuses, like Paid, Not Paid, or No Fine Needed |

BookFavourite
| Key Attribute | Type     | Required | Description                                                                  |
| ------------- | -------- | -------- | ---------------------------------------------------------------------------- |
| userID        | ObjectID | True     | References the User collection, identifying the user who favourited the book |
| bookID        | ObjectID | True     | References the Book collection, identifying the book marked as favourite     |

Remarks:
1. Every collection includes an _id field of type ObjectId, which serves as the unique identifier