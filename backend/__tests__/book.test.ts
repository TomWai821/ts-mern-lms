import request from 'supertest'
import app from '../src/app'
import mongoose from "mongoose";

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
    await mongoose.connection.close();
});

// Get All Book Data
describe("Book API Test", () => 
{
    it("GET /api/book/BookData, should get all book data", async () => 
    {
        const res = await request(app).get("/api/book/BookData")

        expect(res.statusCode).toBe(200);
    });
});

// Get All Book Data with filter data (bookname)
describe("Book API Test (with filter data)", () => 
{
    it("GET /api/book/BookData, should get all book data with filter data", async () => 
    {
        const res = await request(app).get("/api/book/BookData?bookname=Harry")

        expect(res.statusCode).toBe(200);
    });
});

// Get All Book Data with invalid filter data 
describe("Book API Test (with invalid filter data)", () => 
{
    it("GET /api/book/BookData, should return null", async () => 
    {
        const res = await request(app).get("/api/book/BookData?bookname=zzz")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toEqual([])
    });
});

// Get Recommend Book (New Publish)
describe("Book API Test (Get Recommend Book which new publish)", () => 
{
    it("GET /api/book/BookData, should get new Publish book", async () => 
    {
        const res = await request(app).get("/api/book/BookData/type=newPublish")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toHaveLength(8);
    });
});

// Get Recommend Book (Most Loaned)
describe("Book API Test (Get Recommend Book which most loaned)", () => 
{
    it("GET /api/book/LoanBook, should get most loaned book", async () => 
    {
        const res = await request(app).get("/api/book/LoanBook/type=mostPopular")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundLoanBook)
    });
});