import { GetResultInterface } from "../../Model/ResultModel";

const localhost = process.env.REACT_APP_API_URL;
const contentType = "application/json";

export const GetContact = async (type:string, author?:string, publisher?:string) => 
{
    try
    {
        const invalidQuery = (type === "Author" && publisher) || (type === "Publisher" && author);
        let query:string = "";

        if (invalidQuery)
        {
            console.log(`Invalid query data: ${type === "Author" ? "publisher" : "author"}`);
            return undefined;
        }
    
        switch(type)
        {
            case "Author":
                if(author)
                {
                    query = `?author=${author}`;
                }
                break;
        
            case "Publisher":
                if(publisher)
                {
                    query = `?publisher=${publisher}`;
                }
                break;
        }

        const url = `${localhost}/book/contact/type=${type}${query}`;
        
        const response = await fetch(url,
            {
                method: 'GET',
                headers: { 'content-type': contentType }
            }
        );

        if (!response) 
        {
            throw new Error("No response from fetch");
        }

        if(response.ok)
        {
            const result:GetResultInterface = await response.json();
            return result;
        }
        else 
        {
            const error = await response.json();
            throw new Error(error.error || "Request failed");
        }

    }
    catch(error)
    {
        console.log(error);
    }
}

export const CreateContact = async (authToken:string, type:string, contactName:string, phoneNumber:string, email:string) => 
{
    const body = BuildBodyData(type, contactName, phoneNumber, email);

    try
    {
        const response: Response = await fetch(`${localhost}/book/contact/type=${type}`,
            {
                method: 'POST',
                headers: { 'content-type': contentType, 'authToken': authToken },
                body: JSON.stringify(body)
            }
        );

        return response;
    }
    catch(error)
    {
        return new Response(
            JSON.stringify({ error: "Create Contact failed", details: String(error) }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

export const EditContact = async (authToken:string, type:string, contactName:string, phoneNumber:string, email:string, id?:string) => 
{
    const body = BuildBodyData(type, contactName, phoneNumber, email, id);

    try
    {
        const response: Response = await fetch(`${localhost}/book/contact/type=${type}`,
            {
                method: 'PUT',
                headers: { 'content-type': contentType, 'authToken': authToken },
                body: JSON.stringify(body)
            }
        );

       return response;
    }
    catch(error)
    {
        return new Response(
            JSON.stringify({ error: "Edit Contact failed", details: String(error) }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

export const DeleteContact= async (authToken:string, type:string, id:string) => 
{
    try
    {
        const response: Response = await fetch(`${localhost}/book/contact/type=${type}`,
            {
                method: 'DELETE',
                headers: { 'content-type': contentType, 'authToken': authToken },
                body: JSON.stringify({id: id})
            }
        );

        return response;
    }
    catch(error)
    {
        return new Response(
            JSON.stringify({ error: "Delete Contact failed", details: String(error) }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

const BuildBodyData = (type:string, contactName:string, phoneNumber:string, email:string,  id?:string) => 
{

    let data:Record<string, any> = 
    {
        ...(id && {id}),
        ...(phoneNumber && {phoneNumber}),
        ...(email && {email})
    };

    switch(type)
    {
        case "Publisher":
            data.publisher = contactName;
            break;
        
        case "Author":
            data.author = contactName;
            break;

        default:
            return console.log(`Invalid type ${type}`);
    }
    return data;
}
    