import { GetResultInterface } from "../../Model/ResultModel";

const localhost = process.env.REACT_APP_LOCAL_HOST;

const contentType:string = 'application/json';
const url:string = `${localhost}/user`;

export const FetchUserData = async(tableName?: string, authToken?:string,  username?: string, role?: string , status?: string, gender?: string, startDate?:Date, dueDate?: Date) => 
{
    try
    {
        const headers: Record<string, string> = 
        {
            'content-type': contentType
        }

        if(authToken)
        {
            headers['authToken'] = authToken;
        }

        let queryParams = BuildQuery({username, role, status, gender, startDate, dueDate});

        const queryString = queryParams.toString();
        const URL = tableName === undefined ? `${url}/UserData` : `${url}/userData/tableName=${queryString ? `${tableName}?${queryString}` : `${tableName}`}`;

        const response = await fetch(URL,
            {
                method: 'GET',
                headers
            }
        )

        console.log(localhost);
        const result: GetResultInterface = await response.json();
        return result;
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