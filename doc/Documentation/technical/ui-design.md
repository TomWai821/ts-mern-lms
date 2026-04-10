## UI Layout

***1. Navigation***<br>
<img src="../../Image/UILayout/Navigation-Guest.png" style="width:90%;"/><br>
Image 1.1 - Navigation For Guest User<br>

<img src="../../Image/UILayout/Navigation-AuthenticateUser.png" style="width:90%;"/><br>
Image 1.2 - Navigation For Authenticated User<br>

<img src="../../Image/UILayout/Navigation-Admin.png" style="width:90%;"/><br>
Image 1.3 - Navigation For Admin(Librarian)<br>

#### Description:<br>
- The Guest user is allowed to view book data (Image 1.1)
- Authenticated Users could view book data, suspend list, view records, profile with data modify function and the QR Code (Image 1.2)
- Administrator (Librarian) can manage book, user, contact and book definition data (Image 1.3). Another function is the same as that of an authenticated user


***2. Main page (Book recommendation)***<br>
<img src="../../Image/UILayout/MainPage-Guest.png" style="width:90%;"/><br>
Image 2.1 - Main Page For User / Authenticated User (who does not have a loan book record)<br>

<img src="../../Image/UILayout/MainPage-AuthenticateUser.png" style="width:90%;"/><br>
Image 2.2 - Main Page For Authenticated User (Include Librarian)<br>

#### Description:<br>
- Without the Loan Book record (Image 2.1), one can see the most popular book and the newest published book
- With the Loan Book record (Image 2.2), you can view recommended books from the backend system

***3. Authenticate Pages***<br>
<img src="../../Image/UILayout/RegisterCard.png" style="width:40%;"/><br>
Image 3.1 - Registration Page<br>

<img src="../../Image/UILayout/LoginCard.png" style="width:40%;"/><br>
Image 3.2 - Login Page<br>

#### Description:
- Registration Page (Image 3.1) requires input of all the data to register an account, and has a validator to verify data in the input field
- The Login Page (Image 3.2) requires input of all the data to log in, and it also has a validator to verify the data in the input field (It has a checkbox to decide whether to store data in session storage or cookie storage)


***4. Profile Page***<br>
<img src="../../Image/UILayout/ProfileCard.png" style="width:40%;"/><br>
Image 4.1 - Profile Page<br>

<img src="../../Image/UILayout/DisplayQRCodeModal.png" style="width:40%;"/><br>
Image 4.2 - QR Code Modal<br>

<img src="../../Image/UILayout/EditProfileDataModal-username.png" style="width:40%;"/><br>
Image 4.3 - Edit Profile Data Modal (Username)<br>

<img src="../../Image/UILayout/EditProfileDataModal-password.png" style="width:40%;"/><br>
Image 4.4 - Edit Profile Data Modal (Password)<br>

#### Description
- Profile card (Image 4.1) could view all the data
- QR Code modal (Image 4.2) has a QR Code used to loan a book, and it has a hint to ask the user how to use the QR Code
- The Username Edit Modal (Image 4.3) requires input of a new username
- The Edit Password Modal (Image 4.4) requires the input of a new password and a confirmation of the password


***5. Content Page***<br>
<img src="../../Image/UILayout/TopOfTableContentWithFilter-User.png" style="width:90%;"/><br>
Image 5.1 - Top of Table Content With Filter (For User)<br>

<img src="../../Image/UILayout/TopOfTableContentWithFilter-Admin.png" style="width:90%;"/><br>
Image 5.2 - Top of Table Content With Filter (For Librarian)<br>

#### Description
- The User Table Top (Image 5.1) includes a filter with an expandable panel, a title with the total number of records and a dropdown for the pagination 
- Librarian Table Top (Image 5.2) has a tab to change the table and has an action button between the search button, another function is the same as that of the user


***6. Modal for view data***<br>
<img src="../../Image/UILayout/BookInfoModal-Guest.png" style="width:40%;"/><br>
Image 6.1 - Book data modal (For Guest user)<br>

<img src="../../Image/UILayout/BookInfo-AuthenticateUser.png" style="width:40%;"/><br>
Image 6.2 - Book data modal (For Authenticated User)<br>

<img src="../../Image/UILayout/BookInfo_GoogleBook-AuthenicateUser.png" style="width:40%;"/><br>
Image 6.3 - Book data modal (Google Book - For Authenticated User)<br>

#### Description
- Guest users' book data modal (Image 6.1) only includes basic book data
- Authenticated users (including librarians) book data modal (Image 6.2) has book status, and it is the same as that of guest users
- Authenticated users (including librarians) book data modal (image 6.3) has Google Book data, and ISBM display as a BarCode Image


***7. Modal for CRUD operations (Librarian only)***<br>
<img src="../../Image/UILayout/CreateBookModal.png" style="width:50%;"/><br>
Image 7.1 - Book record Creation Modal <br>

<img src="../../Image/UILayout/CreateBookConfrimationModal.png" style="width:40%;"/><br>
Image 7.2 - Book record Create Confirmation Modal <br>

<img src="../../Image/UILayout/EditBookRecordModal.png" style="width:50%;"/><br>
Image 7.3 - Book data Modification Modal <br>

<img src="../../Image/UILayout/EditBookConfirmationModal.png" style="width:40%;"/><br>
Image 7.4 - Book data Modify Confirmation Modal <br>

<img src="../../Image/UILayout/DeleteBookConfrimationModal.png" style="width:40%;"/><br>
Image 7.5 - Book record Delete Confirmation Modal <br>

#### Description
- Book Creation Model (Image 7.1) requires input data and has a validator to validate data
- Book Create Confirmation Modal (Image 7.2) allows viewing the input data again
- Book Data Modification Modal (Image 7.3) requires input of most of the data and has a validator to validate data
- Book Data Modify Confirmation Modal (Image 7.4) displays the modified data
- Book Data Delete Confirmation  Modal (Image 7.5) displays the data to be deleted and requires librarian confirmation


***8. Way to display data***<br>
<img src="../../Image/UILayout/TableCell_BookManagementPage.png" style="width:90%;"/><br>
Image 8.1 - Table Cell with buttons

<img src="../../Image/UILayout/DefinitionPage.png" style="width:90%;"/><br>
Image 8.2 - Chip set

#### Description
- The table cell (Image 8.1) stores book data, and the actions allow the user/librarian to implement
- The Chipset table (Image 8.2) could reduce the space to display data