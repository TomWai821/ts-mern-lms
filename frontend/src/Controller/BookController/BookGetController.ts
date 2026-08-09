import { GetResultInterface } from "../../Model/ResultModel";

const localhost = process.env.REACT_APP_BACKEND_BASE_URL;
const url:string = `${localhost}/api/book`;
const contentType:string = "application/json";

export const fetchBook = async (bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
{
    const queryString = BuildQuery({bookname, languageID, status, genreID, publisherID, authorID});

    const response = await fetch(`${url}/record${queryString ? `?${queryString}` : ``}`,
        {
            method: 'GET',
            headers: { 'content-type': contentType },
        }
    );

    if (!response) 
    {
        throw new Error("No response from fetch");
    }

    if(response.ok)
    {
        const result: GetResultInterface = await response.json();
        return result;
    }
    else 
    {
        const error = await response.json();
        throw new Error(error.error || "Request failed");
    }
}

export const fetchLoanBook = async(authToken?:string, type?:string, bookname?:string, username?:string, status?:string, finesPaid?:string) => 
{
    const data = {bookname, username, status, finesPaid};

    const headers: Record<string, string> = 
    {
        'content-type': contentType
    }

    if(authToken)
    {
        headers['authToken'] = authToken;
    }

    const queryParams =  BuildQuery(data);
    const baseUrl = `${url}/loanRecord`;
    let finalUrl = '';

    finalUrl = queryParams ? `${baseUrl}/type=${type}?${queryParams}` : `${baseUrl}/type=${type}`;

    const response = await fetch(finalUrl,
        {
            method: 'GET',
            headers: headers
        }
    );

    if(response.ok)
    {
        const result: GetResultInterface = await response.json();
        return result;
    }
}

export const fetchFavouriteBook = async(authToken:string, bookname?:string, status?:string, genreID?:string, languageID?:string, authorID?:string, publisherID?:string) => 
{
    const queryString = BuildQuery({bookname, languageID, status, genreID, publisherID, authorID});

    const response = await fetch(`${url}/favourite${queryString ? `?${queryString}` : ``}`,
        {
            method: 'GET',
            headers: {'content-type':contentType, 'authToken': authToken}
        }
    );

    if(response.ok)
    {
        const result: GetResultInterface = await response.json();
        return result;
    }
}

const BuildQuery = (params:Record<string, number | string | Date | boolean | undefined>) =>
{
    let queryParams = new URLSearchParams();
    for(const key in params)
    {
        if (params[key] === undefined || params[key] === null || params[key] === "" || params[key] === "All" || key.trim() === "") 
        {
            continue; 
        }
        
        if(params[key] instanceof Date)
        {
            queryParams.append(key, (params[key] as Date).toISOString());
        }
        else
        {
            queryParams.append(key, params[key] as string);
        }
    }

    return queryParams.toString();
}

export const GetExternalData = async (authToken:string, bookname:string, author:string) =>
{
      const response = await fetch(`${localhost}/api/book/external?bookname=${bookname}&author=${author}`,
        {
            method: 'GET',
            headers: { 'content-type': contentType, 'authToken': authToken },
        }
    );

    if(response.ok)
    {
        const result: GetResultInterface = await response.json();
        return result;
    }
}