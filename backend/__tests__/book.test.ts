import request from 'supertest'
import app from '../src/app'
import { connectTestDB, closeTestDB } from './utils/dbHandler'

jest.setTimeout(30000);

beforeAll(async () => 
{
    await connectTestDB();
});

afterAll(async () => 
{
    await closeTestDB();
});

// Get All Book Data
describe("Book API Test", () => 
{
    it("GET /api/book/record, should get all book data", async () => 
    {
        const res = await request(app).get("/api/book/record")

        expect(res.statusCode).toBe(200);
    });
});

// Get All Book Data with filter data (bookname)
describe("Book API Test (with filter data)", () => 
{
    it("GET /api/book/record, should get all book data with filter data", async () => 
    {
        const res = await request(app).get("/api/book/record?bookname=Harry")

        expect(res.statusCode).toBe(200);
    });
});

// Get All Book Data with invalid filter data 
describe("Book API Test (with invalid filter data)", () => 
{
    it("GET /api/book/record, should return null", async () => 
    {
        const res = await request(app).get("/api/book/record?bookname=zzz")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toEqual([])
    });
});

// Get Recommend Book (New Publish)
describe("Book API Test (Get Recommend Book which new publish)", () => 
{
    it("GET /api/recommend/type=newPublish, should get new Publish book", async () => 
    {
        const res = await request(app).get("/api/recommend/type=newPublish")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toHaveLength(8);
    });
});

// Get Recommend Book (Most Loaned)
describe("Book API Test (Get Recommend Book which most loaned)", () => 
{
    it("GET /api/recommend/type=mostPopular, should get most loaned book", async () => 
    {
        const res = await request(app).get("/api/recommend/type=mostPopular")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundLoanBook)
    });
});
