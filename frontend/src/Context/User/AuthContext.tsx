import { createContext, Dispatch, FC, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { ChildProps } from "../../Model/ContextAndProviderModel";
import { ViewProfileModel } from "../../Model/InputFieldModel";
import { GetCurrentUserController } from "../../Controller/UserController/UserGetController";
import { LogoutController } from "../../Controller/UserController/UserPostController";

const mainPage:string = process.env.NEXT_PUBLIC_MAIN_PAGE as string;

interface AuthContextProps
{
    user: ViewProfileModel | null;
    setUser: Dispatch<SetStateAction<ViewProfileModel | null>>;
    isAuthLoading: boolean;
    isLoggedIn: boolean;
    isAdmin: boolean;
    fetchUser: () => Promise<void>;
    handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: FC<ChildProps> = ({ children }) =>
{
    const [user, setUser] = useState<ViewProfileModel | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const isLoggedIn = !!user;
    const isAdmin = isLoggedIn && user?.role === "Admin";

    const fetchUser = useCallback(async() =>
    {
        setIsAuthLoading(true);

        try
        {
            const response = await GetCurrentUserController("Self") as Response;

            if(!response.ok)
            {
                setUser(null);
                return;
            }

            const result = await response.json();
            setUser(result.data);
        }
        catch(error)
        {
            setUser(null);
        }
        finally
        {
            setIsAuthLoading(false);
        }
    },[]);

    const handleLogout = async() =>
    {
        try
        {
            await LogoutController();

            setUser(null);
            window.location.href = mainPage;
        }
        catch(error)
        {
            console.error(error);
        }
    };

    useEffect(() =>
    {
        fetchUser();
    },[fetchUser]);
    
    return(
        <AuthContext.Provider value={{ user, setUser, isAuthLoading, isLoggedIn, isAdmin, fetchUser, handleLogout}}>
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