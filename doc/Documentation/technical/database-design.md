## Database Design

### Entity-Relational Diagram<br>
<img src="../../Image/Diagrams/EntityRelationDiagram-LibraryManagementSystem.png" style="width:75%;"/><br>
Figure 1 - ERD of Library Management Plafrotm

- The database follows a document-oriented design using MongoDB.

- Core collections are centred around users, books and loan records<br>
  (While supporting collections such as authors, genres, publishers and languages are used to normalise metadata and reduce data duplication)

- Figure 1 illustrates the relationships between the primary entities within the Library Management System


### Book Collection
| Key Attribute | Type     | Description                                                              |
| ------------- | ---------| ------------------------------------------------------------------------ |
| image         | Object   | Stores book cover image details, including URL and filename              |
| bookname	    | String   | The title of the book for identification                                 |
| languageID    | ObjectID | References for the Language collection, indicating the book's language   |
| genreID       | ObjectID | References the Genre collection, categorising the book                   |
| authorID      | ObjectID | Links to the Author collection, storing authorship details               |
| publisherID   | ObjectID | Assoates with the publisher collection for book publishing details       |
| status        | String   | Defines the book’s availability, such as OnShelf and Loaned              |
| description   | String   | Provides a brief overview or synopsis of the book                        |
| publishDate   | Date     | The official publication date of the book, indexed for search efficiency |



### User Collection
| Key Attribute | Type    | Description                                   |
| ------------- | ------- | --------------------------------------------- |
| Username      | String  | The unique display name chosen by the user    |
| Email         | String  | Primary identifier for authentication         |
| Password      | String  | Encrypted storage for login credentials       |
| Gender        | String  | Captures gender identity for the user profile |
| Role          | String  | Defines permissions for admin and user        |
| Status        | String  | Describe the account status                   |
| birthDay      | Date    | Stores the user’s date of birth               |
| avatarurl     | String  | The URL for the avatar image                  |



### BookLoaned Collection

| Key Attribute | Type     | Description                                                                                          |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| userID        | ObjectID | References the User collection                                                                       |
| bookID        | ObjectID | References the Book collection                                                                       |
| loanDate      | Date     | The date when the user loaned the book                                                               |
| dueDate       | Date     | The date on which the book should return                                                             |
| returnDate    | Date	   | The actual date when the book returns                                                                |
| Status        | String   | Defines the loan status, such as Loaned, Returned                                                    |
| finesAmount   | Number   | The monetary fine for overdue book returns                                                           |
| finesPaid	    | String   | Indicate whether the fine was paid, with predefined statuses, like Paid, Not Paid, or No Fine Needed |


Remarks:
- Every collection contains a MongoDB ObjectId (_id) as its primary identifier
- Relationships between collections are established through referenced ObjectId fields rather than embedded documents
- Supporting collections (Author, Genre, Publisher and Language) are designed to minimise data duplication and simplify maintenance