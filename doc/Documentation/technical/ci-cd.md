## CI/CD

### Continuous Integration (CI)
- **Automated Pipeline**
    - Orchestrated with GitHub Actions to trigger on every Push and Pull Request

- **Quality Assurance**
    - **Frontend**: Executes Unit Testing with Jest to ensure UI logic reliability
    - **Backend**: Performs Integration Testing to validate full API request-response cycles and database interactions

- **Linting**
    - Enforces code consistency via ESLint across the entire stack

- **Artefact Management**
    - Automatically generates and uploads backend Test Coverage Reports as CI artefacts for reviewer visibility

- **Docker Integration**
    - Automates Docker Image builds within the pipeline to ensure cross-environment reproducibility


### Continuous Deployment (CD)
- **Multi-Platform Deployment Strategy**
    - **Frontend (Vercel)**
        - **Orchestrated Deployment**
            - Replaced default auto-update with Vercel Deploy Hooks triggered via GitHub Actions
      
        - **Resource Optimisation**
            - Implemented Ignored Build Step to prevent redundant builds and ensure the frontend only updates after the backend service is confirmed ready
        
    - **Backend (AWS ECR + S3 Bucket + Lambda)**
        - **Automated Deployment Orchestration**
            - Integrated with GitHub Actions to automate the build-and-push process to Amazon ECR. The pipeline triggers an immediate code update to AWS Lambda
              (Ensure the production environment is always synchronised with the latest main branch)
    - **Containerised Portability & Scalability**
        - Engineered a production-ready Dockerfile to encapsulate the Node.js environment
          (Ensure consistent runtime behavior across local development and AWS Serverless infrastructure)
    - **Serverless Resource Optimisation**
        - Leveraged AWS Lambda's event-driven architecture to eliminate idle server costs, moving away from fixed subscription models to a more cost-effective Pay-as-you-go strategy
        
    - **Database (MongoDB Atlas)**
        - **DBaaS Integration**
            - Integrated a cloud-managed Database-as-a-Service (DBaaS) layer (Connection strings are securely injected via Railway's environment variables to ensure data persistence across container redeployments)

- **Deployment Status and Records**
    - **Images**<br>
    <img src="../../Image/Deployment/Vercel_Deployment.png" style="width:90%;"/><br>
    Image 1 - Vercel Deployment Record<br>

    <img src="../../Image/Deployment/AWS_Deployment(ECR).png" style="width:90%;"/><br>
    Image 2 - AWS Deployment Record(ECR)<br>
    
    <img src="../../Image/Deployment/AWS_Deployment(Lambda).png" style="width:90%;"/><br>
    Image 3 - AWS Deployment Record(Lambda)<br>


    - **Deployment Secret Explanation**

    | Secret Name              | Description / Purpose                                                                     | How to Obtain                                                  |
    | ------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
    | VERCEL_DEPLOY_HOOK       | Triggers automated deployment for the Frontend on Vercel                                  | Vercel Project Settings > Git > Deploy Hooks                   |    
    | AWS_ACCESS_KEY_ID        | Unique identifier for the IAM user to authorize GitHub Actions to access AWS resources    | IAM > Users > [Your-User] > Security credentials > Access keys |
    | AWS_SECRET_ACCESS_KEY    | Confidential private key used in conjunction with the Access Key ID for authentication    | Displayed in the AWS Console navigation bar (top-right corner) |
    | AWS_REGION               | The physical location of the AWS data center where resources are hosted (e.g. ap-east-1)  | Display at the navigation bar (Right-hand side)                |
    | AWS_LAMBDA_FUNCTION_NAME | The specific name of the target Lambda function to be updated during the CD process       | Lambda > Functions > [Your-Function-Name]                      |


    - **Security And Operational Excellence**
        - **Zero-Credential Exposure**
            - Ensure the source code does not have private data, and fulfil the OWASP standard
        - **Automated Lifecycle**
            - Reduce the deployment mistakes on manual trigger with GitHub Actions

            
- **Changes**
    - **Production Environment Realignment**
        - Migrated BACKEND_BASE_URL and BASE_URL from localhost to platform-specific production endpoints (Vercel/AWS)<br>
          (It ensured seamless communication between the decoupled frontend and backend services in a live cloud environment)<br>
          
    - **Security & CORS Optimisation**
        - Enhanced the ORIGINAL_URI configuration to support Multiple Origins<br>
          (It allowed the backend to securely accept requests from both the Vercel production domain and local development environments simultaneously, improving workflow flexibility without compromising security)


### Remarks
- **For CI/CD**
    - The entire CI/CD workflow is managed and automated via GitHub Actions workflows
    - CI/CD workflow definitions are located in `.github/workflows/` (The whole process could be viewed in the actions tab -> All workflows, CD workflow = CD pipeline)
- **For CD (AWS Deployment)**
    - **Production Environment Realignment**
        - Migrated backend hosting from Railway to AWS Lambda (Container Image via ECR)
        - Transitioned `BACKEND_BASE_URL` to the Amazon API Gateway endpoint<br>
          (This ensures the frontend communicates with a scalable, production-grade REST API instead of a fixed-server environment)

    - **Cost & Infrastructure Management**
        - Utilising AWS Free Tier / Pay-as-you-go model for Lambda and ECR<br>
          (Provide highly cost-effective scaling compared to fixed subscription models)