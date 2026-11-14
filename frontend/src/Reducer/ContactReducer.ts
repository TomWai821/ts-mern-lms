import { useReducer } from "react";
import { ContactInterface } from "../Model/ResultModel";

import { publisherReducer } from "./Contact/PublisherReducer";
import { authorReducer } from "./Contact/AuthorReducer";

export interface ContactState
{
    Author: ContactInterface[];
    Publisher: ContactInterface[];
}

const initialState: ContactState = 
{
    Author: [],
    Publisher: [],
};

const contactReducer = (state: ContactState, action: any) => 
(
    {
        Author: authorReducer(state.Author, action),
        Publisher: publisherReducer(state.Publisher, action),
    }
);

export const useContactReducer = () =>
{
    const [state, dispatch] = useReducer(contactReducer, initialState);
    return { state, dispatch };
}