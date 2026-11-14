"use client";
import { Box } from "@mui/material";
import { useEffect } from "react";
import CustomTab from "../../../component/UIFragment/CustomTab";
import { useAuthContext } from "../../../Context/User/AuthContext";
import { PageItemToCenter } from "../../../Data/Style";
import { usePageService } from "../../../services/pages/pageService";
import MainPageTabPanel from "../components/Tabs/MainPageTabPanel";


const MainPage = () =>
{
    const { isAdmin, isAuthLoading } = useAuthContext();
    const { tabValue, changeValue } = usePageService();
    
    const tabLabel = 
    [
        {label: "DashBoard"},
        {label: "Book Recommendation"}
    ]

    useEffect(() => 
    { 
        if(isAuthLoading) return;
        
        if(!isAdmin) 
        { 
            changeValue("Tab", 1);
        }
    },[isAuthLoading, isAdmin, changeValue])
    
    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 25px'}}>
            <CustomTab value={tabValue} changeValue={changeValue} tabLabel={tabLabel} type={""}/>

            <MainPageTabPanel tabValue={tabValue}/>
        </Box>
    );
}

export default MainPage