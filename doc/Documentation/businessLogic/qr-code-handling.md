## QR Code Handling (Frontend Only)
- The QR code is generated entirely on the frontend
- Encoded format: JSON object
  ```json
  {
    "username": "<string>",
    "userID": "<string>"
  }
- No backend API endpoint is required for QR code generation
- The QR code is used within the frontend modal for loan verification