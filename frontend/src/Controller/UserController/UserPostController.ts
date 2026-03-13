const localhost = process.env.REACT_APP_API_URL;

const contentType:string = 'application/json';
const url:string = `${localhost}/user`;

const LoginController = async (email:String, password:String): Promise<any> => 
{
    const user = {email, password};

    try
    {
        const response:Response = await fetch(`${url}/Login`, 
            {
                method: 'POST',
                headers: { 'content-type': contentType },
                body: JSON.stringify(user)
            }
        );

        return response;
    }
    catch(error)
    {
        console.log(error);
    }
}

const RegisterController = async (username:string, email:string, password:string, role:string, gender:string, birthDay:string): Promise<any> => 
{
    const user = {username, email, password, gender, role, birthDay};

    try
    {
        const response: Response = await fetch(`${url}/Register`,
            {
                method: 'POST',
                headers: { 'content-type': contentType },
                body: JSON.stringify(user)
            }
        )        
        
        return response;
    }
    catch(error)
    {
        console.log(error);
    }
}

export {LoginController, RegisterController}