## QR Code Handling
- QR codes are generated entirely on the client side without requiring a dedicated backend endpoint
- The encoded payload follows a simple JSON structure:
  ```json
  {
    "username": "<string>",
    "userID": "<string>"
  }
- Generated QR codes are displayed within a frontend modal and used as part of the book loan verification workflow
- The lightweight payload design avoids unnecessary backend processing while keeping the QR generation process responsive


### Design Note
- The current implementation prioritises simplicity and low infrastructure overhead
- For production environments with stronger security requirements, the QR payload could be replaced with signed tokens or short-lived server-generated identifiers to mitigate replay and unauthorised reuse risks