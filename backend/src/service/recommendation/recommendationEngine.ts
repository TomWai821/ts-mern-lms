import { GetBook, AllBooksAggregationResult } from "../../schema/book/book";
import { GetBookLoaned, BookLoanedAggregationResult } from "../../schema/book/bookLoaned";
import { Types } from "mongoose";
import { calculateTFIDF } from "./TF-IDF_Logic";
//import { GoogleGenAI } from "@google/genai";

interface AllBooksCorpus
{
    id: string;
    metadata: string;
}

interface BookMetadata
{
    id: string;
    bookname: string;
    genre: string;
    author: string;
    publisher: string;
}
/*
interface ExplanationResult
{
    bookId: string,
    reason: string
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
*/

export const getRecommendedBooksForUserService = async (userId: string) => 
{
    const userObjectId = new Types.ObjectId(userId);
    const bookLoanedRecords = await GetBookLoaned({ userID: userObjectId }, 10, { loanDate: -1 });

    if (bookLoanedRecords.length === 0)
    {
        return [];
    }

    const { loanedBooksCorpus, genreFrequencyMap } = buildUserProfile(bookLoanedRecords);
    const allBooksCorpus = await buildCandidateCorpus();
    const { scoreMap, topBookIds, excludedIds } = generateRecommendationCandidates(loanedBooksCorpus, genreFrequencyMap, allBooksCorpus);
    const rankedBook = await rankAndFetchBooks(scoreMap, topBookIds, excludedIds);
    /*
    const explanations = await generateExplanation(genreFrequencyMap, rankedBook);

    const reasonMap = new Map(explanations.map(item => [item.bookId, item.reason]));

    return rankedBook.map(book => (
    { 
        ...book,
        recommendationReason: reasonMap.get(book._id.toString()) ?? "Recommended based on your reading history."
    }));
    */

    return rankedBook;
};



const buildUserProfile = (bookLoanedRecord: BookLoanedAggregationResult[]) => 
{
    const loanedBooksCorpus = bookLoanedRecord.map(mapLoanRecordToMetadata);
    const genreFrequencyMap = new Map<string, number>();

    loanedBooksCorpus.forEach(book => 
        { 
            genreFrequencyMap.set(book.genre, (genreFrequencyMap.get(book.genre) || 0) + 1)
        }
    );

    return {loanedBooksCorpus, genreFrequencyMap};
}

const buildCandidateCorpus = async () => 
{
    const allBooks = await GetBook();
    return allBooks.map(mapBookToMetadata).map(book => ({ id: book.id, metadata: buildBookCorpus(book)}));
}

const generateRecommendationCandidates = (loanedBooksCorpus: BookMetadata[], genreFrequencyMap: Map<string, number>, allBooksCorpus: AllBooksCorpus[]) => 
{
    const TF_IDF_Scores = calculateTFIDF(loanedBooksCorpus.map(buildBookCorpus), allBooksCorpus, genreFrequencyMap, loanedBooksCorpus.length);
    const scoresWithJitter = [...TF_IDF_Scores].sort((a, b)=>
    {
        const diff = b.score - a.score;

        if (Math.abs(diff) < 0.01)
        {
            return a.id.localeCompare(b.id);
        }

        return diff;
    });
    
    const scoreMap = new Map(scoresWithJitter.map(s => [s.id.toString(), s.score]));
    
    const topBookIds = scoresWithJitter.slice(0, 20).map((book: { id: string; }) => book.id);
    const excludedIds = loanedBooksCorpus.map(book => new Types.ObjectId(book.id));

    return {scoreMap, topBookIds, excludedIds};
}

const rankAndFetchBooks = async (scoreMap: Map<string, number>, topBookIds: string[], excludedIds: Types.ObjectId[]) => 
{
    const bookObjectIds = topBookIds.map(bookId => new Types.ObjectId(bookId));
    const foundBook = await GetBook({ _id: {  $in: bookObjectIds, $nin: excludedIds } });

    return foundBook.sort((a, b) => 
    {
        const scoreA = scoreMap.get(a._id.toString()) || 0;
        const scoreB = scoreMap.get(b._id.toString()) || 0;
        return scoreB - scoreA;
    })
    .slice(0, 8);
}
/*
const generateExplanation = async (genreFrequencyMap: Map<string, number>, foundBook: AllBooksAggregationResult[]) => 
{
    const prompt = promptBuilder(genreFrequencyMap, foundBook);

    const result = await ai.models.generateContent({ model: "gemini-2.0-flash-001", contents: prompt });

    const text = result.text;

    if (!text)
    {
        throw new Error("Failed to get Gemini response");
    }

    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try
    {
        return JSON.parse(cleanedText) as ExplanationResult[];
    }
    catch
    {
        return [];
    }
}

const promptBuilder = (genreFrequencyMap: Map<string, number>, foundBook: AllBooksAggregationResult[]) => 
{
    return `
        You are a book recommendation assistant.

        Based on the user's reading profile, explain why each recommended book matches the user's interests.

        Rules:
        1. Return JSON only.
        2. Each reason must be less than 40 words.
        3. Mention genre similarity when relevant.
        4. Mention author similarity when relevant.
        5. Do not recommend the same book generically.
        6. Make each explanation different.
        7. Do not use markdown.

        User Reading Profile:
        ${JSON.stringify(Object.fromEntries(genreFrequencyMap))}

        Recommended Books:
        ${JSON.stringify(
            foundBook.map(book => 
            (
                {
                    bookId: book._id, bookName: book.bookname,
                    genre: book.genreDetails?.genre, author: book.authorDetails?.author
                }
            ))
        )}

        Response:
        [
            {
                "bookId": "...",
                "reason": "..."
            }
        ]
    `;
}
*/
const mapLoanRecordToMetadata = (loanRecord: BookLoanedAggregationResult): BookMetadata =>
(
    {
        id: loanRecord.bookDetails._id.toString(),
        bookname: loanRecord.bookDetails.bookname,
        genre: loanRecord.genreDetails.genre,
        author: loanRecord.authorDetails.author,
        publisher: loanRecord.publisherDetails.publisher,
    }
);

const mapBookToMetadata = (book: AllBooksAggregationResult): BookMetadata =>
(
    {
        id: book._id.toString(),
        bookname: book.bookname,
        genre: book.genreDetails.genre,
        author: book.authorDetails.author,
        publisher: book.publisherDetails.publisher,
    }
);

const buildBookCorpus = (book: BookMetadata) =>
{
    return [ book.bookname, book.genre, book.author, book.publisher ].join(" ");
}
