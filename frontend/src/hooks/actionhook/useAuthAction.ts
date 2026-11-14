import { useAuthContext } from "../../Context/User/AuthContext";
import { ChangePage } from "../../Controller/OtherController";
import { LoginController, RegisterController } from "../../Controller/UserController/UserPostController";
import { GetResultInterface } from "../../Model/ResultModel";
import { useMutation } from "../customhook/useMutation";

type ILoginCrendentials =
{
    email: string;
    password: string;
    stayLogin?: boolean;
}

type IRegisterCredentials = ILoginCrendentials &
{
    username: string;
    gender: string;
    birthDay: string;
}

export const useAuthAction = () => 
{
    const { MutationFeedback } = useMutation();
    const { fetchUser } = useAuthContext();

    const UserLogin = async (Credentials: ILoginCrendentials) => 
    {
        const response = await LoginController( Credentials.email, Credentials.password, Credentials.stayLogin as boolean) as Response;
        const result: GetResultInterface = await response.json();

        await MutationFeedback(response, result);

        if (response.ok) 
        {
            await successAction();
        }
    }

    const UserRegister = async (Credentials: IRegisterCredentials) => 
    {
        const response = await RegisterController( Credentials.username, Credentials.email, Credentials.password, "User", Credentials.gender, Credentials.birthDay);
        const result: GetResultInterface = await response.json();

        await MutationFeedback(response, result);
        
        if (response.ok) 
        {
            await successAction();
        }
    }

    const successAction = async () => 
    {
        await fetchUser();
        ChangePage("/");
    }

    return {UserLogin, UserRegister};
}
