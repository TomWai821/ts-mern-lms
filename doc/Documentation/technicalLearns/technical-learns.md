### Technical Learns 
1. System Architecture - **Layered Design (Router-Middleware-Controller-Service-Model)**
    - Designed a modular Express.js backend to achieve a clean Separation of Concerns

    - **Benefit**
        - Facilitates high code maintainability and allows independent testing of business logic and data access layers
  


2. Data Integrity & Consistency Management - **Reliable Image Persistence (Multer & fs/promises)**
    - Developed a custom workflow utilising memoryStorage to simulate atomicity<br>
      (Ensured that file system mutations (e.g. HandleDeleteImage) only execute after verifying primary database operations)

    - **Action**
        - **Coordinated Deletion & Logical Rollback**
            - Engineered a core-first deletion service via decoupled Service Layers, isolating master records from non-blocking background cleanups

        - **Redundancy Control**
            - Implemented Regex sanitisation and strict execution order to prevent "orphaned" files and redundant filename timestamps during consecutive edits

  

3. Type-Safe Development - **End-to-End TypeScript Integration**
    - Leveraged TypeScript across the full stack to enforce rigorous data structures and interface contracts

    - **Result**
        - Significantly reduced runtime TypeErrors
        - Improved developer productivity through IDE intelligent code completion
  


4. Security Logic - **Dual‑Token Authorisation for High‑Risk Loan Operations**
    - The loan workflow enforces dual‑token authorisation
      (A loan request proceeds only when both the borrower and librarian JWTs are present and validated)

    - **Benefit**
        - Prevents either party from performing high‑risk state changes alone
          (Reduce the risk of accidental operations or abuse of privileges)
          
        - Significantly raising the cost of the attack
          (Even if a single credential is compromised, an attacker still needs the other party’s authorisation to complete a loan)
  


5. State Orchestration - **Performance-Oriented Frontend Architecture**
    - Optimised React performance by centralising global state with Context API and encapsulated logic within Custom Hooks

    - **Benefit**
        - Minimised unnecessary component re-renders and established a predictable, one-way data flow



6. **Reducer Refactor – CRUD State Management**
    - Redesigned reducer to explicitly define CRUD state behaviors in advance
    - Simplified state handling and improved maintainability by centralizing transitions
