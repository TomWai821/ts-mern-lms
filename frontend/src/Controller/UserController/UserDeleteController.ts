const localhost = process.env.REACT_APP_API_URL;

const url:string = `${localhost}/user`;
const contentType:string = 'application/json';

const DeleteUserController = async(authToken:string, userId:string) => 
{
    try
    {
        const response = await fetch(`${url}/User/id=${userId}`,
            {
                method: 'DELETE',
                headers: 
                { 
                    'content-type': contentType,
                    'authToken': authToken
                }
            }
        )

        return response
    }
    catch(error)
    {
        console.log(error);
        throw error;
    }
}

export { DeleteUserController } 