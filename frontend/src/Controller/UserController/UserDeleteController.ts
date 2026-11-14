const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const url:string = `${localhost}/api/user`;
const contentType:string = 'application/json';

const DeleteUserController = async(userId:string) => 
{
    try
    {
        const response = await fetch(`${url}/User/id=${userId}`,
            {
                method: 'DELETE',
                credentials:"include",
                headers: { 'content-type': contentType,}
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