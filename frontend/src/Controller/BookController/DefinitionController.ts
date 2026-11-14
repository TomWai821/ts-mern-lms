const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
const contentType = "application/json";

const baseUrl = `${localhost}/api/definition`

export const GetDefinition = async (type:string, data?:string) => 
{
    try
    {
        const actualUrl = data ? `${baseUrl}/type=${type}?name=${data}` : `${baseUrl}/type=${type}`;

        const response = await fetch(actualUrl,
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

export const CreateDefinitionData = async (type:string, shortName:string, detailsName:string) => 
{
    try
    {
        const data = BuildBodyData(type, shortName, detailsName, undefined);

        const response = await fetch(`${baseUrl}/type=${type}`,
            {
                method: 'POST',
                credentials:"include",
                headers: { 'content-type': contentType},
                body: JSON.stringify(data)
            }
        );

        return response;
    }
    catch(error)
    {
         return new Response(
            JSON.stringify({ error: "Create Definition failed", details: String(error) }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

export const EditDefinitionData = async (type:string, id:string, shortName:string, detailsName:string) => 
{        
    const data = BuildBodyData(type, shortName, detailsName, id);

    try
    {
        const response = await fetch(`${baseUrl}/type=${type}`,
            {
                method: 'PUT',
                credentials:"include",
                headers: { 'content-type': contentType },
                body: JSON.stringify(data)
            }
        );

       return response;
    }
    catch(error)
    {
        return new Response(
            JSON.stringify({ error: "Edit Definition failed", details: String(error) }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

export const DeleteDefinitionData = async (type:string, id:string) => 
{
    try
    {
        const response = await fetch(`${baseUrl}/type=${type}`,
            {
                method: 'DELETE',
                credentials:"include",
                headers: { 'content-type': contentType },
                body: JSON.stringify({id})
            }
        );

       return response;
    }
    catch(error)
    {
        return new Response(
            JSON.stringify({ error: "Delete Definition failed", details: String(error) }),
            { status: 500, headers: { "content-type": "application/json" } }
        );
    }
}

const BuildBodyData = (type:string, shortName:string, detailsName:string, id?:string) => 
{
    let data:Record<string, any> = {shortName};

    if(id)
    {
        data.id = id;
    }

    switch(type)
    {
        case "Genre":
            data.genre = detailsName;
            break;
        
        case "Language":
            data.language = detailsName;
            break;

        default:
            return console.log(`Invalid type ${type}`);
    }
    return data;
}
