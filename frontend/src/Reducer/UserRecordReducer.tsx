import { useReducer } from "react";
import { UserResultDataInterface } from "../Model/ResultModel";
import { suspendUserReducer } from "./User/SuspendUserReducer";
import { userReducer } from "./User/UserReducer";

interface UserRecordState 
{
    AllUser: UserResultDataInterface[];
    SuspendUser: UserResultDataInterface[];
}

const initialState: UserRecordState = 
{
    AllUser: [],
    SuspendUser: [],
};

const userRecordReducer = (state: UserRecordState, action: any) => 
(
    {
        AllUser: userReducer(state.AllUser, action),
        SuspendUser: suspendUserReducer(state.SuspendUser, action),
    }
);

export const useUserRecordReducer = () =>
{
    const [state, dispatch] = useReducer(userRecordReducer, initialState);
    return { state, dispatch };
}