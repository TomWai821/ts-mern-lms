import { createContext, FC, useContext } from "react";

// Models
import { DetailsInterfaceForSuspend, UserResultDataInterface } from "../../Model/ResultModel";
import { ChildProps } from "../../Model/ContextAndProviderModel";
import { useUserRecordReducer } from "../../Reducer/UserRecordReducer";
import { UserRecordwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { useWebSocket } from "../../hooks/customhook/WebSocket";
import { fetchSuspendUser, fetchUsers } from "../../services/contents/userService";
import { SuspendUserAction } from "../../Reducer/User/SuspendUserReducer";
import { UserAction } from "../../Reducer/User/UserReducer";

interface UserContextProps
{
    userData:  (UserResultDataInterface[] | DetailsInterfaceForSuspend[])[];
    initUsers: (isAdmin: boolean, isLoggedin: boolean, isAuthLoading:boolean) => Promise<void>;
    refreshUsers: (type: string, isAdmin: boolean, isLoggedin: boolean, isAuthLoading: boolean) => Promise<void>;
    modifyUsers: (action: UserAction | SuspendUserAction) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: FC<ChildProps> = ({ children }) =>
{
    const { dispatch, state } = useUserRecordReducer();

    const userData = [state.AllUser, state.SuspendUser];
    useWebSocket(dispatch, UserRecordwsEventToActionMap);

    const initUsers = async (isAdmin: boolean, isLoggedin:boolean) => 
    {
        const [Users, SuspendUsers] = await Promise.allSettled([fetchUsers(isAdmin), fetchSuspendUser(isLoggedin)]);

        const UsersResult: UserResultDataInterface[] | undefined = Users.status === "fulfilled" ? Users.value : undefined;
        const SuspendUsersResult:  UserResultDataInterface[] | undefined = SuspendUsers.status === "fulfilled" ? SuspendUsers.value : undefined;

        if (UsersResult && Array.isArray(UsersResult)) 
        {
            modifyUsers({ type: "SET_ALL_USER", payload: UsersResult});
        }

        if (SuspendUsersResult && Array.isArray(SuspendUsersResult)) 
        {
            modifyUsers({ type: "SET_SUSPEND_USER", payload: SuspendUsersResult });
        }
    }

    const refreshUsers = async (type: string, isAdmin: boolean, isLoggedin:boolean) => 
    {
        switch(type)
        {
            case "AllUser":
                const UsersResult: UserResultDataInterface[] | undefined  = await fetchUsers(isAdmin);
                modifyUsers({ type: "SET_ALL_USER", payload: UsersResult});
                break;
            
            case "SuspendUser":
                const SuspendUsersResult: UserResultDataInterface[] | undefined  = await fetchSuspendUser(isLoggedin);
                modifyUsers({ type: "SET_SUSPEND_USER", payload: SuspendUsersResult });
                break;
        }

    }

    const modifyUsers = (action: UserAction | SuspendUserAction) => 
    {
        dispatch(action);
    }
        
    return (
        <UserContext.Provider value={{ userData, initUsers, refreshUsers, modifyUsers }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => 
{
    const context = useContext(UserContext);
    
    if (context === undefined) 
    {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
