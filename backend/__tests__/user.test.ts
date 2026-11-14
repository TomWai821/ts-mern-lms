import request from 'supertest'
import app from '../src/app'
import { FindUserAndDelete } from '../src/schema/user/user'
import { connectTestDB, closeTestDB } from './utils/dbHandler'

jest.setTimeout(30000);

beforeAll(async () => 
{
    await connectTestDB();
});

afterAll(async () => 
{
    FindUserAndDelete("TheTestUser", "tester@gmail.com");
    await closeTestDB();
});


// Register (With Non-exist data)
describe("User API Test", () => 
{
    const agent = request.agent(app);

    it("POST /api/user/Register, should register successfully", async () => 
    {
        const res = await agent.post("/api/user/Register")
            .send({ email: "tester@gmail.com", username: "TheTestUser", password: "TheTestUser", 
                gender: "Male", role: "User", status : "Normal", birthDay: "01/01/2000"})

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Register Successfully!");
    });

    it("POST /api/user/Register, should failed to register", async () => 
    {
        const res = await agent.post("/api/user/Register")
            .send({ email: "tester@gmail.com", username: "TheTestUser", password: "TheTestUser", 
                gender: "Male", role: "User", status : "Normal", birthDay: "01/01/2000"})

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email already in use");
    });

    it("POST /api/user/Logout, should logout successfully", async () => 
    {
        const res = await agent.post("/api/user/Logout")

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logout Successfully");
    });
});

// Login Test
describe("User API Test", () => 
{
    const agent = request.agent(app);
    
    it("POST /api/user/Login, should failed to login with incorrect email", async () => 
    {
        const res = await request(app).post("/api/user/Login")
            .send({email:"testera@gmail.com", password: "TheTestUser"})

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid email address");
    });

    it("POST /api/user/Login, should login successfully", async () => 
    {
        const res = await agent.post("/api/user/Login")
            .send({email:"tester@gmail.com", password: "TheTestUser"})

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login Successfully!");
    });

    it("POST /api/user/Login, should failed to login with incorrect password", async () => 
    {
        const res = await agent.post("/api/user/Login")
            .send({email:"tester@gmail.com", password: "JustAPassword"})

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid password");
    });

    it("GET /api/me, should get Self data", async () => 
    {
        const res = await agent.get("/api/me/")

        expect(res.statusCode).toBe(200);

        const ResultList:Record<string, string> = 
        {
            "username": "TheTestUser",
            "role": "User",
            "status": "Normal",
            "email": "tester@gmail.com",
            "gender": "Male"
        }

        for(const [key, value] of Object.entries(ResultList))
        {
            expect(res.body.data).toHaveProperty(key, value);
        }        
    });

    // Get QR Code data
    it("GET /api/me/QRCode, should get QR Code data", async () => 
    {
        const res = await agent.get("/api/me/qrCode")

        expect(res.statusCode).toBe(200);
        expect(res.body.data).toEqual(
            {
                userId: expect.any(String),
                username: expect.any(String),
                type: "library-member"
            }
        );
    });

    // Get Self Loan Record
    it("GET /api/book/loanRecord/type=Self, should get empty", async () => 
    {
        const res = await agent.get("/api/book/loanRecord/type=Self")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundLoanBook).toEqual([]);
    });

    // Get Favourite Book
    it("GET /api/book/favourite, should get empty", async () => 
    {
        const res = await agent.get("/api/book/favourite")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundFavouriteBook).toEqual([]);
    });

    // Logout after implement all test cases
    it("POST /api/user/Logout, should logout successfully", async () => 
    {
        const res = await agent.post("/api/user/Logout")

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logout Successfully");
    });
});
