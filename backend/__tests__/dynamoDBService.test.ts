import mongoose from "mongoose";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { BookInterface } from "../src/model/bookSchemaInterface";

jest.mock("../src/init/connectToDynamoDB", () => ({
    dynamoDB: { send: jest.fn() }
}));

import { dynamoDB } from "../src/init/connectToDynamoDB";
import { GetDataFromDynamoDB, PutDataIntoDynamoDB } from "../src/service/dynamoDB/dynamoDBService";

describe("DynamoDB service", () =>
{
    beforeEach(() => jest.clearAllMocks());

    it("serialises MongoDB ObjectIds and dates before writing", async () =>
    {
        const id = new mongoose.Types.ObjectId();
        const publishDate = new Date("2024-01-02T03:04:05.000Z");
        const book = {
            _id: id,
            image: { url: "image-url", filename: "image.jpg" },
            bookname: "Test book",
            languageID: id,
            genreID: id,
            authorID: id,
            publisherID: id,
            status: "OnShelf",
            pages: 10,
            description: "Test description",
            publishDate
        } as unknown as BookInterface;

        await PutDataIntoDynamoDB("RecommendBook", "newPublish", [book]);

        const command = (dynamoDB.send as jest.Mock).mock.calls[0][0] as PutCommand;
        expect(command.input.Item).toMatchObject({ dataType: "newPublish", userId: "global" });
        expect(command.input.Item?.data).toEqual([{
            _id: id.toHexString(),
            image: { url: "image-url", filename: "image.jpg" },
            bookname: "Test book",
            languageID: id.toHexString(),
            genreID: id.toHexString(),
            authorID: id.toHexString(),
            publisherID: id.toHexString(),
            status: "OnShelf",
            pages: 10,
            description: "Test description",
            publishDate: publishDate.toISOString()
        }]);
    });

    it("uses the supplied user id in user-specific cache keys", async () =>
    {
        await GetDataFromDynamoDB("RecommendBook", "forUser", "user-123");

        const command = (dynamoDB.send as jest.Mock).mock.calls[0][0] as GetCommand;
        expect(command.input.Key).toEqual({ dataType: "forUser", userId: "user-123" });
    });

    it("requires a user id for user-specific cache keys", async () =>
    {
        await expect(GetDataFromDynamoDB("RecommendBook", "forUser")).rejects.toThrow("userId required");
        expect(dynamoDB.send).not.toHaveBeenCalled();
    });
});
