const localhost = process.env.REACT_APP_BACKEND_BASE_URL;
const contentType = "application/json";

const baseUrl = `${localhost}/api/contact`

export const GetContact = async (type:string, filterData?:string) => 
{
    try
    {
        let query:string = "";
    
        switch(type)
        {
            case "Author":
                if(filterData)
                {
                    query = `?author=${filterData}`;
                }
                break;
        
            case "Publisher":
                if(filterData)
                {
                    query = `?publisher=${filterData}`;
                }
                break;
        }

        const url = `${baseUrl}/type=${type}${query}`;
        
        const response = await fetch(url,
            {
                method: 'GET',
                headers: { 'content-type': contentType }
            }
        );

        return response;
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
        const response: Response = await fetch(`${baseUrl}/type=${type}`,
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
        const response: Response = await fetch(`${baseUrl}/type=${type}`,
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
        const response: Response = await fetch(`${baseUrl}/type=${type}`,
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
    