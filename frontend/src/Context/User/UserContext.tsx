import { createContext, FC, useCallback, useContext, useEffect } from "react";

// Another Useful Function
import { FetchUserData } from "../../Controller/UserController/UserGetController";
import { CalculateDueDate, GetCurrentDate } from "../../Controller/OtherController";
import { ModifySuspendListDataController, ModifyStatusController, ModifyUserDataController } from "../../Controller/UserController/UserPutController";
import { RegisterController } from "../../Controller/UserController/UserPostController";

// Models
import { GetResultInterface } from "../../Model/ResultModel";
import { FindUserInterface } from "../../Model/UserTableModel";
import { ChildProps, UserContextProps } from "../../Model/ContextAndProviderModel";
import { DeleteUserController } from "../../Controller/UserController/UserDeleteController";

import { useAuthContext } from "./AuthContext";
import { useUserRecordReducer } from "../../Reducer/UserRecordReducer";
import { UserRecordwsEventToActionMap } from "../../services/ws/config/WSConfig";
import { useWebSocket } from "../../customhook/WebSocket";
import { executeMutationWithFallback } from "../../Controller/MutationWithFallback";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: FC<ChildProps> = ({ children }) =>
{
    const { GetData } = useAuthContext();
    const { dispatch, state } = useUserRecordReducer();

    const userData = [state.AllUser, state.SuspendUser];
    const authToken = GetData("authToken") as string;

    useWebSocket(dispatch, UserRecordwsEventToActionMap);

    // For init
    const fetchAllUser = useCallback(async () => 
    {
        const resultForAllUser: GetResultInterface | undefined = await FetchUserData("AllUser", authToken);
        const resultForSuspendUser: GetResultInterface | undefined = await FetchUserData("SuspendUser", authToken);

        if(resultForAllUser && Array.isArray(resultForAllUser.foundUser))
        {
            dispatch({ type: "SET_ALL_USER", payload: resultForAllUser.foundUser });
        }

        if(resultForSuspendUser && Array.isArray(resultForSuspendUser.foundUser))
        {
            dispatch({ type: "SET_SUSPEND_USER", payload: resultForSuspendUser.foundUser });
        }

    },[authToken, dispatch])


    // For search function
    const fetchUser = useCallback(async (type:string, UserData: {username?: string, role?: string, status?: string, gender?: string} | undefined) => 
    {
        const {username, role, status, gender} = UserData as FindUserInterface;

        const result : GetResultInterface | undefined = await FetchUserData(type, authToken, username, role, status, gender);

        if(result && Array.isArray(result.foundUser))
        {
            switch(type)
            {
                case "AllUser":
                    dispatch({ type: "SET_ALL_USER", payload: result.foundUser });
                    break;

                case "SuspendUser":
                    dispatch({ type: "SET_SUSPEND_USER", payload: result.foundUser });
                    break;
            }
            
        }
    }
    ,[authToken, dispatch])


    const createUser = useCallback((username:string, email:string, password:string, role:string, gender:string, birthDay:string) => 
    {
        return executeMutationWithFallback(() => RegisterController(username, email, password, role, gender, birthDay), fetchAllUser);
    }
    ,[fetchAllUser])


    const editUserData = useCallback((userId: string, username:string, email:string, gender:string, role:string) => 
    {
        return executeMutationWithFallback(() => ModifyUserDataController(authToken, userId, username, email, gender, role), fetchAllUser);
    }
    ,[authToken, fetchAllUser])
    

    const editSuspendUserData = useCallback((userId:string, suspendedListID:string, dueDate:Date, description:string) => 
    {
        return executeMutationWithFallback(() => ModifySuspendListDataController(authToken, userId, suspendedListID, dueDate, description), fetchAllUser);
    }
    ,[authToken, fetchAllUser])


    const changeUserStatus = useCallback((type: string, userId:string, status:string, ListID?:string, duration?:number, description?:string) => 
    {
        const startDate = GetCurrentDate("Date") as Date;
        const dueDate = CalculateDueDate(duration as number);
        
        return executeMutationWithFallback(() => 
        {
            if(type === "UnSuspend")
            {
                return ModifyStatusController(type, authToken, userId, status, ListID);
            }

            return ModifyStatusController(type, authToken, userId, status, undefined, startDate, dueDate, description);
        }, fetchAllUser)
    
    }
    ,[authToken, fetchAllUser]);


    const actualDeleteUser = useCallback((userId:string) => 
    {
        return executeMutationWithFallback(() => DeleteUserController(authToken, userId), fetchAllUser);
    }
    ,[authToken, fetchAllUser]);
    

    useEffect(() => 
        {
            fetchAllUser();
        }, [fetchAllUser]
    )

    return (
        <UserContext.Provider value={{ userData, fetchAllUser, fetchUser, createUser, editUserData, editSuspendUserData, changeUserStatus, actualDeleteUser }}>
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
