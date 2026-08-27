import { useCallback, useState } from "react";

type pageList = "User" | "Book" | "Contact" | "Definition" | "SelfRecord";

export const getTablePageTitle = (pageList: pageList, tabValue: number, IsAdmin?: () => boolean) =>
{
    const isAdmin = IsAdmin !== undefined ? IsAdmin() : false;

    const TitleList: Record<pageList, string[]> =
    {
        "User": isAdmin ? ["Manage User Record", "Manage Suspend User"] : ["","View Suspend List"],
        "Book": isAdmin ? ["Manage Books Record", "Manage Loaned Books Record"] : ["View Books", ""],
        "Contact": isAdmin ? ["Manage Author Record", "Manage Publisher Record"] : [],
        "Definition": isAdmin ? ["Manage Genre Record", "Manage Language Record"] : [],
        "SelfRecord": ["Loan Book Record", "Favourite Book Record"]
    };

    const matchTitle = TitleList[pageList][tabValue] || "View Details"; 

    return {title:matchTitle};
}

export const usePageService = () =>
{
    const [tabValue, setTabValue] = useState(0);
    const [paginationValue, setPaginationValue] = useState(10);

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

    return {tabValue, paginationValue, changeValue, ChangeTabValue};
}
