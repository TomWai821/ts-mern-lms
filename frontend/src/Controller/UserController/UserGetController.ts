import { GetResultInterface } from "../../Model/ResultModel";

const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const contentType:string = 'application/json';
const url:string = `${localhost}/api/user`;

export const FetchUserData = async(tableName?: string, username?: string, role?: string , status?: string, gender?: string, startDate?:Date, dueDate?: Date) => 
{
    try
    {   
        let queryParams = BuildQuery({username, role, status, gender, startDate, dueDate});

        const queryString = queryParams.toString();
        const URL = tableName === undefined ? `${url}/userData` : `${url}/userData/tableName=${queryString ? `${tableName}?${queryString}` : `${tableName}`}`;

        const response = await fetch(URL,
            {
                method: 'GET',
                credentials:"include",
                headers: { 'content-type': contentType }
            }
        )

        if(response.ok)
        {
            const result: GetResultInterface = await response.json();
            return result;
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

const BuildQuery = (params:Record<string, number | string | Date | undefined>) =>
{
    let queryParams = new URLSearchParams();
    for(const key in params)
    {
        if (params[key] === undefined || params[key] === null || params[key] === "" || params[key] === "All" || key.trim() === "") 
        {
            continue; 
        }
        else if(params[key] instanceof Date)
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

type CurrentUserData = "Self" | "QRCode";

export const GetCurrentUserController = async (dataType: CurrentUserData) =>
{
    const dataUrl = dataType === "Self" ? `${localhost}/api/me/` : `${localhost}/api/me/qrCode`;
    try
    {
        return fetch(`${dataUrl}`,
            {
                method:"GET",
                credentials:"include"
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
};