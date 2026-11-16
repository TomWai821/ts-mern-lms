import request from 'supertest'
import app from '../src/app'
import { InitialiseSystem } from '../src/init/connectToDynamoDB'
import { connectTestDB, closeTestDB, waitForTestDynamoDB } from './utils/dbHandler'

jest.setTimeout(60000);

beforeAll(async () => 
{
    await connectTestDB();
    await waitForTestDynamoDB();
    await InitialiseSystem();
});

afterAll(async () => 
{
    await closeTestDB();
});

// Get All Book Data with invalid filter data 
describe("Book Records API Test", () => 
{
    it("GET /api/book/record, should get all book data", async () => 
    {
        const res = await request(app).get("/api/book/record")

        expect(res.statusCode).toBe(200);
    });

    it("GET /api/book/record, should get all book data with filter data", async () => 
    {
        const res = await request(app).get("/api/book/record?bookname=Harry")

        expect(res.statusCode).toBe(200);
    });

    it("GET /api/book/record, should return null", async () => 
    {
        const res = await request(app).get("/api/book/record?bookname=zzz")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toEqual([])
    });
});

// Get Recommend Book (New Publish)
describe("Book Recommendation API Test", () => 
{
    it("GET /api/recommend/type=newPublish, should get new Publish book", async () => 
    {
        const res = await request(app).get("/api/recommend/type=newPublish")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toHaveLength(8);
    });

    it("GET /api/recommend/type=mostPopular, should get most loaned book", async () => 
    {
        const res = await request(app).get("/api/recommend/type=mostPopular")

        expect(res.statusCode).toBe(200);
        expect(res.body.foundBook).toBeInstanceOf(Array);
    });
});
