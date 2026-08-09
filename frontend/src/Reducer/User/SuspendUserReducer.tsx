import { UserResultDataInterface } from "../../Model/ResultModel";

export type SuspendUserAction =
  | { type: "SET_SUSPEND_USER"; payload: UserResultDataInterface[] }
  | { type: "CREATE_SUSPEND_USER"; payload: UserResultDataInterface }
  | { type: "UPDATE_SUSPEND_USER"; payload: UserResultDataInterface }
  | { type: "DELETE_SUSPEND_USER"; payload: string }

export const suspendUserReducer = (state: UserResultDataInterface[], action: SuspendUserAction) => 
{
    switch (action.type) 
    {
        case "SET_SUSPEND_USER": 
            return action.payload;

        case "CREATE_SUSPEND_USER":
            return [...state, action.payload];

        case "UPDATE_SUSPEND_USER":
            return state.map(suspendUser => suspendUser.suspendedDetails?._id === action.payload.suspendedDetails?._id ? action.payload : suspendUser);

        case "DELETE_SUSPEND_USER":
            return state.filter(suspendUser => suspendUser._id !== action.payload);

        default: 
            return state;
    }
};
