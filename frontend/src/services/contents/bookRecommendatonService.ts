import { BookDataInterface, LoanBookInterface } from "../../Model/ResultModel";

const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const baseUrl = `${localhost}/api/recommend`
const contentType:string = "application/json";

export interface RecommendedBook extends BookDataInterface
{
    recommendationReason: string;
}

export interface RecommendationDataInterface
{
    recommendBooks: RecommendedBook[];
    newPublishBooks: BookDataInterface[];
    mostPopularBooks: LoanBookInterface[];
}

export type RecommendationPanelItem = (BookDataInterface & { recommendationReason?: string }) | LoanBookInterface;

interface RecommendationResponse<T>
{
    foundBook?: T[];
}

export async function GetRecommendationData(isLoggedin: boolean) 
{
    const [recommendBooks, newPublishBooks, mostPopularBooks] = await Promise.all([GetRecommendBooks(isLoggedin), GetNewPublishBooks(), GetMostPopularBooks()]);
    return {recommendBooks, newPublishBooks, mostPopularBooks};
}

async function GetRecommendBooks(isLoggedin: boolean): Promise<RecommendedBook[]>
{
    if(!isLoggedin)
    {
        return [];
    }

    const response = await fetch(`${baseUrl}/type=forUser`,
    {
        method: "POST",
        credentials: "include",
        headers: { "content-type": contentType }
    });

    if(!response.ok)
    {
        return [];
    }

    const result = await response.json() as RecommendationResponse<RecommendedBook>;
    return result.foundBook ?? [];
}


async function GetNewPublishBooks(): Promise<BookDataInterface[]>
{
    return fetchBooks<BookDataInterface>(`${baseUrl}/type=newPublish`);
}


async function GetMostPopularBooks(): Promise<LoanBookInterface[]>
{
    return fetchBooks<LoanBookInterface>(`${baseUrl}/type=mostPopular`);
}


async function fetchBooks<T>(url:string): Promise<T[]>
{
    const response = await fetch(url, 
        {
            method: "GET", 
            headers: { "content-type": contentType }
        }
    );

    if(!response.ok)
    {
        return [];
    }

    const result = await response.json() as RecommendationResponse<T>;
    return result.foundBook ?? [];
}