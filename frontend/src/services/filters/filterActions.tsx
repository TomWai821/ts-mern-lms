import { useState } from "react";

export const useFilterActions = () => 
{
    const [optionVisiable, setOptionVisiable] = useState(false);
    const [actionMenu, openActionMenu] = useState<HTMLElement | null>(null);

    const toggleCardVisibility = () => 
    {
        setOptionVisiable((prev) => !prev);
    };

    const handleActionMenu = (event: React.MouseEvent<HTMLElement>) =>
    {
        openActionMenu(actionMenu ? null : event?.currentTarget);
    };

    return { optionVisiable, actionMenu, toggleCardVisibility, handleActionMenu };
}