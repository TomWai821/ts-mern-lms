const localhost = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const contentType:string = 'application/json';
const url:string = `${localhost}/api/user`;

const LoginController = async (email: string, password: string, stayLogin:boolean) =>
{
    try
    {
        return fetch(`${url}/Login`,
        {
            method: "POST",
            credentials: "include",
            headers:{ "Content-Type": contentType },
            body: JSON.stringify({ email, password, stayLogin })
        }
    );
    }
    catch(error)
    {
        console.log(error);
    }
    
};

const RegisterController = async (username:string, email:string, password:string, role:string, gender:string, birthDay:string): Promise<any> => 
{
    const user = {username, email, password, gender, role, birthDay};

    try
    {
        const response: Response = await fetch(`${url}/Register`,
            {
                method: 'POST',
                credentials: "include",
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

const LogoutController = async () =>
{
    try
    {
        return fetch(`${url}/Logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
};

export {LoginController, RegisterController, LogoutController}