import request from 'supertest'
import app from '../src/app'
import mongoose from "mongoose";
import { FindUserAndDelete } from '../src/schema/user/user'

jest.setTimeout(30000);

beforeAll(async () => 
{
    await mongoose.connect(process.env.MONGO_URI!, 
    {
        serverSelectionTimeoutMS: 20000,
    });
});

afterAll(async () => 
{
    FindUserAndDelete("TheTestUser", "tester@gmail.com");
    await mongoose.connection.close();
});

let authToken:string;

// Register (With Non-exist data)
describe("User API Test", () => 
{
    it("POST /api/user/Register, should register successfully", async () => 
    {
        const res = await request(app).post("/api/user/Register")
            .send({ email: "tester@gmail.com", username: "TheTestUser", password: "TheTestUser", 
                gender: "Male", role: "User", status : "Normal", birthDay: "01/01/2000"})

        expect(res.statusCode).toBe(200);
    });
});

// Register (With duplicate data)
describe("User API Test", () => 
{
    it("POST /api/user/Register, should failed to register", async () => 
    {
        const res = await request(app).post("/api/user/Register")
            .send({ email: "tester@gmail.com", username: "TheTestUser", password: "TheTestUser", 
                gender: "Male", role: "User", status : "Normal", birthDay: "01/01/2000"})

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email already in use");
    });
});

// Login (With exist data)
describe("User API Test", () => 
{
    it("POST /api/user/Login, should login successfully", async () => 
    {
        const res = await request(app).post("/api/user/Login")
            .send({email:"tester@gmail.com", password: "TheTestUser"})

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Login Successfully!");
        authToken = res.body.data.authToken;
    });
});

// Login (With incorrect email)
describe("User API Test", () => 
{
    it("POST /api/user/Login, should failed to login with incorrect email", async () => 
    {
        const res = await request(app).post("/api/user/Login")
            .send({email:"testera@gmail.com", password: "TheTestUser"})

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid email address");
    });
});

// Login (With incorrect password)
describe("User API Test", () => 
{
    it("POST /api/user/Login, should failed to login with incorrect password", async () => 
    {
        const res = await request(app).post("/api/user/Login")
            .send({email:"tester@gmail.com", password: "JustAPassword"})

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid password");
    });
});

// Get User Data
describe("User API Test", () => 
{
    it("GET /api/user/UserData, should get user data", async () => 
    {
        const res = await request(app).get("/api/user/UserData")
            .set("authToken", authToken)

        expect(res.statusCode).toBe(200);
        expect(res.body.foundUser).toMatchObject({username: "TheTestUser", gender: "Male", role: "User"});
    });
});

// Get User Data (With Invalid JWT)
describe("User API Test", () => 
{
    it("GET /api/user/UserData, should be error", async () => 
    {
        const res = await request(app).get("/api/user/UserData")
            .set("authToken", "a")

        expect(res.statusCode).toBe(401);
    });
});

// Get Loan Data (Should be empty, because it is new account)
describe("Book API Test (with AuthToken)", () => 
{
    it("GET /api/book/LoanBook, should get empty", async () => 
    {
        const res = await request(app).get("/api/book/LoanBook")
            .set("authToken", authToken)

        expect(res.statusCode).toBe(200);
        expect(res.body.foundLoanBook).toEqual([]);
    });
});

// Get Favourite Data (Should be empty, because it is new account)
describe("Book API Test (with AuthToken)", () => 
{
    it("GET /api/book/FavouriteBook, should get empty", async () => 
    {
        const res = await request(app).get("/api/book/FavouriteBook")
            .set("authToken", authToken)

        expect(res.statusCode).toBe(200);
        expect(res.body.foundFavouriteBook).toEqual([]);
    });
});

