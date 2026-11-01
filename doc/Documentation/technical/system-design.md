## System Design

### Sequence Diagrams

- **Authentication Flow**
<img src="../../Image/Diagrams/LoginSequenceDiagram.png" style="width:90%;"/><br>
Figure 1 - User Login Sequence Diagram

- This sequence diagram illustrates the user login workflow, from credential submission to JWT token issuance
- The workflow performs request validation, user verification and token-based authentication before granting access to protected resources



- **External Service Integration Flow**
<img src="../../Image/Diagrams/SequenceDiagramForGetDataFromGoogleBook.png" style="width:90%;"/><br>
Figure 2 - Google Books Integration Sequence Diagram

- This sequence diagram illustrates the external book information retrieval workflow through the Google Books API
- The backend acts as an integration layer that validates requests, consumes external APIs and transforms the response into a consistent format for frontend consumption
    


- **Feature Workflow**
<img src="../../Image/Diagrams/QRCodeModalSequenceDiagram.png" style="width:90%;"/><br>
Figure 3 - QR Code Generation Sequence Diagram

- This sequence diagram illustrates the QR code generation workflow initiated by authenticated users
- User credentials are processed by the QR generation service, with the generated QR code rendered through a modal interface
