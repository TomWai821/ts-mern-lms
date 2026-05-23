import { externalDataInterface } from "../../model/requestInterface";

const DEFAULT_BOOK_DATA = 
{ 
    averageRating: "N/A", 
    ratingsCount: "N/A", 
    categories: "N/A", 
    saleability: "N/A", 
    listPrice: "N/A", 
    retailPrice: "N/A", 
    ISBN_13_Code: "N/A", 
    ISBN_10_Code: "N/A"
};

export const externalBookService = async (bookname: string, author: string) => 
{
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const baseUrl = process.env.GOOGLE_BOOKS_BASE_URL;

    if (!apiKey || !baseUrl) 
    {
        console.warn("Missing Google Books API configuration.");
        return DEFAULT_BOOK_DATA;
    }

    try 
    {
        const query = `${bookname} inauthor:${author}`;
        const url = `${baseUrl}?q=${query}&key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) 
        {
            return DEFAULT_BOOK_DATA;
        }

        const result = await response.json() as externalDataInterface;

        return result?.items?.[0] ? parseGoogleBook(result.items[0]) : DEFAULT_BOOK_DATA;
    } 
    catch (error) 
    {
        console.error("ExternalBookService Error:", error);
        return DEFAULT_BOOK_DATA;
    }
};

const parseGoogleBook = (item: any) => 
{
    const { volumeInfo = {}, saleInfo = {} } = item;
    const identifiers = volumeInfo.industryIdentifiers || [];
    const saleability = saleInfo.saleability || "N/A";

    const data = 
    {
        ...DEFAULT_BOOK_DATA, 
        averageRating: volumeInfo.averageRating ? `${volumeInfo.averageRating} (From Google Books)` : "N/A",
        ratingsCount: volumeInfo.ratingsCount?.toString() ?? "N/A",
        categories: Array.isArray(volumeInfo.categories) ? volumeInfo.categories.join(", ") : "N/A",
        saleability,
        ISBN_13_Code: identifiers.find((i: any) => i.type === "ISBN_13")?.identifier ?? "N/A",
        ISBN_10_Code: identifiers.find((i: any) => i.type === "ISBN_10")?.identifier ?? "N/A",
    };

    if (saleability !== "NOT_FOR_SALE" && saleInfo.listPrice) 
    {
        const { listPrice, retailPrice } = saleInfo;

        data.listPrice = `${listPrice.currencyCode}$${listPrice.amount}`;
        data.retailPrice = retailPrice?.amount ? `${retailPrice.currencyCode}$${retailPrice.amount}` : "N/A";
    }

    return data;
};

