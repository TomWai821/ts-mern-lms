import { useCallback, useState } from "react";

type pageList = "User" | "Book" | "Contact" | "Definition" | "SelfRecord";


const getTitle = (pageList: pageList, tabValue: number, IsAdmin: () => boolean) =>
{
    const TitleList: Record<pageList, string[]> =
    {
        "User": IsAdmin() ? ["Manage User Record", "Manage Suspend User"] : ["","View Suspend List"],
        "Book": IsAdmin() ? ["Manage Books Record", "Manage Loaned Books Record"] : ["View Books", ""],
        "Contact": IsAdmin() ? ["Manage Author Record", "Manage Publisher Record"] : [],
        "Definition": IsAdmin() ? ["Manage Genre Record", "Manage Language Record"] : [],
        "SelfRecord": ["Loan Book Record", "Favourite Book Record"]
    };

    return TitleList[pageList][tabValue];
}

export const usePageService = (pageList: pageList, IsAdmin?: () => boolean) =>
{
    const [tabValue, setTabValue] = useState(0);
    const [paginationValue, setPaginationValue] = useState(10);
    const title = getTitle(pageList, tabValue, IsAdmin || (() => false));

    const changeValue = useCallback((type:string, newValue: number) =>
    {
        switch(type)
        {
            case "Tab":
                setTabValue(newValue);
                break;

            case "Pagination":
                setPaginationValue(newValue);
                break;
            
            default:
                break;
        }
    },[])

    const ChangeTabValue = (event: React.SyntheticEvent, newValue: number) =>
    {
        changeValue("Tab", newValue);
    }

    return {tabValue, paginationValue, title, changeValue, ChangeTabValue};
}
