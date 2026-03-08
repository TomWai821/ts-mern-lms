import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { ChildProps, AuthContextProps } from "../../Model/ContextAndProviderModel";
import { GetUserCookie } from "../../Controller/CookieController";
import { ViewProfileModel } from "../../Model/InputFieldModel";
import { GetResultInterface } from "../../Model/ResultModel";
import { UserDataInterface } from "../../Model/UserTableModel";
import { FetchUserData } from "../../Controller/UserController/UserGetController";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<ChildProps> = ({ children }) =>
{
    const [Credentials, setCredentials] = useState<ViewProfileModel>({ email: "", gender: "", username: "", role: ""});
    const mainPage:string = process.env.REACT_APP_MAIN_PAGE as string;

    const fetchUser = useCallback(async () => 
    {
        const authToken = GetData("authToken");

        if (authToken) 
        {
            try
            {
                const userData = await FetchUserData(undefined, authToken);
    
                if (userData) 
                {
                    updateCredentials(userData);
                }
            } 
            catch (error) 
            {
                console.log('Error while fetching user', error);
            }
        }
    },[])
    
    const updateCredentials = (userData: GetResultInterface) =>
    {
        const foundUser = Array.isArray(userData.foundUser) 
        ? userData.foundUser[0] ?? {} 
        : (userData.foundUser as UserDataInterface) ?? {};

    
        setCredentials({ username: foundUser.username ?? "", gender: foundUser.gender ?? "", role: foundUser.role ?? "", email: foundUser.email ?? "" });
    }

    const IsLoggedIn = () => 
    {
        const tokenFromCookie = document.cookie.match("authToken");
    
        if (tokenFromCookie || sessionStorage.getItem('authToken')) 
        {
            return true;
        }
        return false;
    }
    
    const GetData = (data:string): string | undefined | null => 
    {
        const DataList = ["authToken", "role", "username", "avatarUrl", "status"];
    
        if(DataList.includes(data))
        {
            return GetUserCookie(data) as string || sessionStorage.getItem(data);
        }
    
        return undefined;
    }
    
    const IsAdmin = (): boolean => 
    {
        return GetData("role") === "Admin";
    }

    const handleLogout = async() =>
    {
        if(document.cookie)
        {
            document.cookie = "userInfo=" + {} + '; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
        sessionStorage.clear();
        window.location.href = mainPage;
    }

    useEffect(() => 
    {
        if(IsLoggedIn())
        {
            fetchUser()
        }
    },[fetchUser])
    
    return(
        <AuthContext.Provider value={{Credentials, fetchUser, IsLoggedIn, GetData, IsAdmin, handleLogout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => 
{
    const context = useContext(AuthContext);
        
    if (context === undefined) 
    {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
}