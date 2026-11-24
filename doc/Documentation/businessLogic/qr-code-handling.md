## QR Code Handling

### QR Code Generation
- Members can request their personal QR code after authentication
- The backend retrieves the authenticated member information and returns a QR payload
- The frontend generates and displays the QR code from the returned payload

### QR Code Schema
```json
{
  "userId": "<string>",
  "username": "<string>",
  "type": "library-member"
}
```

### Loan Process
- Members present their QR code during the borrowing process
- Librarians manually enter the QR payload into the loan form
  (No in-app camera scanning is provided)<br>
- The system validates the QR payload and extracts the member identifier for loan processing

### Design Considerations
- The QR code contains member identification data instead of authentication credentials
- Authentication and authorization remain enforced by backend APIs
- A type field is included in the payload to support future QR code categories and validation rules

### References
- [QR code endpoint](../../../backend/src/routes/api/me.ts)
- [Auth controller](../../../backend/src/controller/authController.ts)
- [QR display modal](../../../frontend/src/features/profile/components/modals/DisplayQRCodeModal.tsx)
- [Loan flow](../../../frontend/src/features/book/components/modals/confirms/LoanBookConfirmationModal.tsx)