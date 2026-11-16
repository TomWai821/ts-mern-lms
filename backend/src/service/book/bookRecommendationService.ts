import { Book } from "../../model/requestInterface";
import { calculateTFIDF } from "../../controller/TF-IDF_Logic";
import { BookLoanedAggregationResult, GetBookLoaned } from "../../schema/book/bookLoaned";
import { BookInterface } from "../../model/bookSchemaInterface";
import { GetBook } from "../../schema/book/book";
import { ObjectId } from "mongodb";
import { DynamoDBTableMap, GetDataFromDynamoDB, PutDataIntoDynamoDB } from "../dynamoDB/dynamoDBService";
import { RecommendBookType } from "../../controller/bookRecommendationController";

export const GetBookRecommendationService = async (suggestType: RecommendBookType, userId?: string) => 
{
    if(suggestType === "forUser" && !userId)
    {
        return {success: false, statusCode: 400, message: "This suggestion type requires authToken!"};
    }

    const cacheResult = await GetDataFromDynamoDB("RecommendBook", suggestType, userId);
    let foundBook = cacheResult.Item?.data as DynamoDBTableMap["RecommendBook"][typeof suggestType] | undefined;

    if(!foundBook)
    {
        foundBook = await RefreshRecommendation(suggestType, userId);
    }

    return {success: true, statusCode: 200, foundBook};
};

const RefreshRecommendation = async ( suggestType: RecommendBookType, userId?: string) =>
{
    const freshData = await BuildRecommendationData(suggestType, userId);
    await PutDataIntoDynamoDB("RecommendBook", suggestType, freshData, userId);

    return freshData;
};

export const RefreshRecommendationCache = async (suggestType: RecommendBookType, userId?: string): Promise<void> =>
{
    await RefreshRecommendation(suggestType, userId);
};

const BuildRecommendationData = async (suggestType: RecommendBookType, userId?: string) =>
{
    switch (suggestType)
    {
        case "newPublish":
            return GetBook(undefined, { publishDate: -1 }, 8);

        case "mostPopular":
            return GetBookLoaned(undefined, 8);

        case "forUser":
            return getRecommendedBooksForUserService(userId!);
    }
};

const getRecommendedBooksForUserService = async (userId: string) => 
{
    const userObjectId = new ObjectId(userId as unknown as ObjectId);
    const getBookLoanedRecord = await GetBookLoaned({ userID: userObjectId }, 5, { loanDate: -1 });
    let foundBook: any = null;

    if((getBookLoanedRecord as any[]).length > 0)
    {
        const loanedBooksCorpus = (getBookLoanedRecord as any[]).map(formatBookMetadata);

        const genreFrequencyMap = new Map<string, number>();
        loanedBooksCorpus.forEach(book => { genreFrequencyMap.set(book.genre, (genreFrequencyMap.get(book.genre) || 0) + 1)});
    
        const allBooks = await GetBook(undefined);
        const allBooksCorpus = (allBooks as any[]).map(book => ({ id: book._id, metadata: formatBookMetadata(book).corpus }));
    
        // Calculate scores and apply jitter to introduce controlled randomness for dynamic recommendations
        const TF_IDF_Scores = calculateTFIDF(loanedBooksCorpus.map(books => books.corpus), allBooksCorpus, genreFrequencyMap, loanedBooksCorpus.length);
        const scoresWithJitter = TF_IDF_Scores.map(item => ({ ...item, score: item.score + (Math.random() * 0.1) }));
        
        const scoreMap = new Map(scoresWithJitter.map(s => [s.id.toString(), s.score]));
        
        const topBookIds = scoresWithJitter.slice(0, 20).map((book: { id: any; }) => book.id);
        const excludedNames = loanedBooksCorpus.map(book => book.bookname);

        foundBook = await GetBook({ _id: { $in: topBookIds }, bookname: { $nin: excludedNames } }, undefined);

        foundBook = (foundBook as BookInterface[])
        .sort((a, b) => 
        {
            const scoreA = scoreMap.get(a._id.toString()) || 0;
            const scoreB = scoreMap.get(b._id.toString()) || 0;
            return scoreB - scoreA;
        })
        .slice(0, 8);
    }

    return foundBook;
};

const formatBookMetadata = (book: any): Book => 
({
    _id: book._id || book.bookDetails?._id,
    bookname: book.bookname || book.bookDetails?.bookname || 'Unknown',
    genre: book.genre || book.genreDetails?.genre || 'Unknown',
    author: book.author || book.authorDetails?.author || 'Unknown',
    publisher: book.publisher || book.publisherDetails?.publisher || 'Unknown',
    get corpus() { return `${this.bookname} ${this.genre} ${this.author} ${this.publisher}` }
});
