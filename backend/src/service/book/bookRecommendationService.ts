import { NextFunction, Response } from "express";
import { AuthRequest, Book } from "../../model/requestInterface";
import { calculateTFIDF } from "../../controller/TF-IDF_Logic";
import { GetBookLoaned } from "../../schema/book/bookLoaned";
import { BookInterface } from "../../model/bookSchemaInterface";
import { GetBook } from "../../schema/book/book";
import { ObjectId } from "mongodb";

export const GetSuggestBookDataService = async (req: AuthRequest, res: Response, next: NextFunction) => 
{
    const suggestType = req.params.type;
    const userId = req.user?._id;
    let foundBook: any = null;

    try 
    {
        switch (suggestType) 
        {
            case "newPublish":
                foundBook = await GetBook(undefined, { publishDate: -1 }, 8);
                break;

            case "forUser":
                if (!userId) 
                {
                    return res.status(400).json({ success: false, error: `This suggestion type requires authToken!` });
                }
                foundBook = await getRecommendedBooksForUserService(userId as unknown as string);
                break;

            case "mostPopular": 
                foundBook = await GetBookLoaned(undefined, 8);
                break;

            default:
                return res.status(400).json({ success: false, error: "Invalid Suggest Type: " + suggestType });
        }

        req.foundBook = foundBook;
        next();

    } 
    catch (error) 
    {
        console.error("GetSuggestBook Error:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
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

    return foundBook
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
