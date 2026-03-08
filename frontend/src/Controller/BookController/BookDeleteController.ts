const localhost = process.env.REACT_APP_API_URL;
const contentType:string = "application/json";

export const deleteBookRecord = async (type:string ,authToken:string, ID:string) => 
{
    try
    {
        const url:Record<string, string> = 
        {
            "Book": `${localhost}/book/bookData/id=${ID}`,
            "Favourite": `${localhost}/book/FavouriteBook/id=${ID}`
        }

        const response = await fetch(url[type],
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