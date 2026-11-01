## Installation Guide

### Prerequisites
- Before starting, ensure the following software is installed:
    - Docker Desktop
    - Node.js (for local development)
    - MongoDB Compass (optional)
    - Git



### Environment Variables
- Environment templates are provided:
    - cp backend/.env.example backend/.env
    - cp frontend/.env.example frontend/.env

- Refer to the corresponding .env.example files for the complete list of supported variables and configuration examples



### Docker Setup
- The Docker environment is the recommended development setup and closely mirrors the project's intended development workflow

- Start the entire development environment:
```Shell
docker compose -f compose.yaml up --build -d
```

- **Access**
    - Frontend: http://localhost:3000
    - Backend : http://localhost:5000



### Local Development
- Backend
```Shell
cd backend
npm install
npm run dev
```

- Frontend
```Shell
cd frontend
npm install
npm start
```



### MongoDB Seed Data
- Demo data is located in:
    - backend/MongoDBSchema/

- **Docker**
    - Seed data is automatically imported when the MongoDB volume is created for the first time.

- **Local MongoDB**
    - Import the JSON files manually using MongoDB Compass



### Volume Reset
- To completely reset demo data:
```Shell
docker compose down -v
docker compose up --build -d
```

- **Warning**: This permanently deletes all persisted MongoDB data



### Troubleshooting
<details>
<summary>Common Setup Issues</summary>

1. **Seed data not imported**
    - Reset Docker volumes
```Shell
docker compose down -v
docker compose up --build -d
```


2. **MongoDB connection failed**
    - Check:
        - Docker: mongodb://mongo:27017
        - Local : mongodb://localhost:27017


3. **JWT authentication issues**
    - Changing JWT_SECRET invalidates all existing authentication tokens
    - Users must log in again
</details>



<details>
<summary>Environment Configuration Reference</summary>

1. Expected URLs
    | Variable                    | Value                    |
    | --------------------------- | ------------------------ |
    | ORIGIN_URI                  | http://localhost:3000    |
    | REACT_APP_BACKEND_BASE_URL  | http://localhost:5000    |
    | REACT_APP_MAIN_PAGE         | http://localhost:3000    |
    | BACKEND_BASE_URL            | http://localhost:5000    |
    | STORAGE_TYPE                | LOCAL                    |
    | REACT_APP_WEB_SOCKET_SERVER | http://localhost:5000/ws |

    - **Remarks**
        - REACT_APP_WEB_SOCKET_SERVER can be ignored for cloud - Lambda deployment


2. Ports and hostnames
    - If you run the project with **Docker Compose**, use the Docker examples in `.env.example` (e.g. `MONGO_URI=mongodb://mongo:27017/...`)<br>
      (Docker Compose maps container ports to the host automatically)

    - If you run services locally (not via Docker), replace container hostnames with `localhost` and ensure `PORT` matches the port you start the backend on (e.g. `3000`)

    - Always include protocol and port for URLs
<details>