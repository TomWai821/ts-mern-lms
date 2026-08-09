const localhost = process.env.REACT_APP_BACKEND_BASE_URL;
const url:string = `${localhost}/api/book`;
const contentType:string = "application/json";

export const deleteBookRecord = async (type:string ,authToken:string, ID:string) => 
{
    try
    {
        const finalUrl:Record<string, string> = 
        {
            "Book": `${url}/record/id=${ID}`,
            "Favourite": `${url}/favourite/id=${ID}`
        }

        const response = await fetch(finalUrl[type],
            {
                method: 'DELETE',
                headers: {'content-type': contentType, 'authToken': authToken}
            }
        )

        return response;
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
}