import { Box } from "@mui/material";
import { PageItemToCenter } from "../../Data/Style";
import { useEffect } from "react";
import { useAuthContext } from "../../Context/User/AuthContext";
import { usePageService } from "../../services/pages/pageService";
import CustomTab from "../UIFragment/CustomTab";
import MainPageTabPanel from "./TablePages/Tabs/MainPageTabPanel";

const MainPage = () =>
{
    const { IsAdmin } = useAuthContext();
    const { tabValue, changeValue } = usePageService();
    
    const tabLabel = 
    [
        {label: "DashBoard"},
        {label: "Book Recommendation"}
    ]

    useEffect(() => 
    { 
        if(!IsAdmin()) 
        { 
            changeValue("Tab", 1);
        }
    },[IsAdmin, changeValue])
    
    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 25px'}}>
            <CustomTab value={tabValue} changeValue={changeValue} tabLabel={tabLabel} type={""}/>

            <MainPageTabPanel tabValue={tabValue}/>
        </Box>
    );
}

export default MainPage