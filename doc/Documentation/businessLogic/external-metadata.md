## External Metadata Integration (Google Books)

### Workflow
- Client Request → Controller → externalBookService → parseGoogleBook → Normalised Metadata → UI Rendering

### Key Components
- **Controller (The Orchestration Layer)**
    - Acts as a thin orchestration layer between HTTP requests and the service layer
    - Extracts query parameters (bookname, author)
    - Delegates metadata retrieval to externalBookService
    - Returns a standardised API response to the client

- **externalBookService**
    - Calls Google Books API using server-side credentials
    - Implements fallback and error-handling logic
    - Returns a consistent response model

- **parseGoogleBook**
    - Normalises external JSON into application DTOs
    - Uses defensive parsing (?., ??)
    - Merges with DEFAULT_BOOK_DATA

- **DEFAULT_BOOK_DATA**
    - Provides a stable schema baseline
    - Prevents undefined values from propagating to the UI

- **Design Principles**
    - Separation of Concerns
    - DTO Pattern
    - Defensive Programming
    - Graceful Degradation
    - Consistent Return Types

- **Source Code Reference**
    - [bookController.ts](../../../backend/src/controller/bookController.ts) 
        - GetDataFromGoogleBook (Line 116 - 131)

    - [externalBookService.ts](../../../backend/src/service/book/externalBookService.ts)
        - externalBookService
        - GetDataFromGoogleBook
        - DEFAULT_BOOK_DATA