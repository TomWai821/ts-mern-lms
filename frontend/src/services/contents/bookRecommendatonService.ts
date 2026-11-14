import { BookDataInterface, GetResultInterface } from "../../Model/ResultModel";

const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const baseUrl = `${localhost}/api/recommend`
const contentType:string = "application/json";

export interface RecommendationDataInterface
{
    recommendBooks: BookDataInterface[] | [];
    newPublishBooks: BookDataInterface[] | [];
    mostPopularBooks: BookDataInterface[] | [];
}

export async function GetRecommendationData(isLoggedin: boolean) 
{
    const [recommendBooks, newPublishBooks, mostPopularBooks] = await Promise.all([GetRecommendBooks(isLoggedin), GetNewPublishBooks(), GetMostPopularBooks()]);
    return {recommendBooks, newPublishBooks, mostPopularBooks} as RecommendationDataInterface;
}

async function GetRecommendBooks(isLoggedin: boolean)
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

    const result:GetResultInterface = await response.json();
    return result.foundBook;
}


async function GetNewPublishBooks()
{
    return fetchBooks(`${baseUrl}/type=newPublish`);
}


async function GetMostPopularBooks()
{
    return fetchBooks(`${baseUrl}/type=mostPopular`);
}


async function fetchBooks(url:string)
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

    const result:GetResultInterface = await response.json();
    return result.foundBook;
}