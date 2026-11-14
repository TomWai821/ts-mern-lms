"use client";
import { useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";

// Context
import { useDefinitionContext } from "../../../Context/Book/DefinitionContext";

// Useful function
import { ChangePage } from "../../../Controller/OtherController";

// data (CSS Syntax)
import { PageItemToCenter } from "../../../Data/Style";

import { useAuthContext } from "../../../Context/User/AuthContext";

import { TabProps } from "../../../Controller/OtherUsefulController";
import { DefinitionTabLabel } from "../../../Data/TableData";



// Custom Hook in services (Page Data and Filter)
import { getTablePageTitle, usePageService } from "../../../services/pages/pageService";
import { useDefinitionFilter } from "../../../services/filters/definitionFilter";
import ChipBody from "../../../component/Templates/ChipBodyTemplate";
import CustomTabPanel from "../../../component/UIFragment/CustomTabPanel";
import TableTitle from "../../../component/UIFragment/TableTitle";
import DefinitionFilter from "../components/DefinitionFilter";

const DefinitionPage  = () => 
{
    const { isAdmin, isAuthLoading } = useAuthContext();
    const { definition } = useDefinitionContext();
    const { tabValue, ChangeTabValue } = usePageService();
    const { searchData, onChange, SearchDefinition, resetFilter } = useDefinitionFilter(tabValue);

    const { title } = getTablePageTitle("Definition", tabValue, isAdmin);
    const definitionType = tabValue === 0 ? "Genre" : "Language";

    useEffect(() => 
    {
        if(isAuthLoading) return;

        if(!isAdmin)
        {
            ChangePage('/');
        }
    },[isAuthLoading, isAdmin])

    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>

            <TableTitle title={title} dataLength={definition[tabValue].length}/>

            <DefinitionFilter searchData={searchData} value={tabValue} onChange={onChange} Search={SearchDefinition} resetFilter={resetFilter}/>

            <Tabs value={tabValue} onChange={ChangeTabValue} sx={{paddingBottom: '50px', width: '500px'}}>
                {
                    DefinitionTabLabel.map((tab, index) => 
                    (
                        <Tab key={index} label={tab.label} {...TabProps(index)}/>
                    ))
                }
            </Tabs>
            
            <CustomTabPanel index={tabValue} value={0}>
                <ChipBody value={tabValue} definitionType={definitionType} data={definition[0]}/>
            </CustomTabPanel>

            <CustomTabPanel index={tabValue} value={1}>
                <ChipBody value={tabValue} definitionType={definitionType} data={definition[1]}/>
            </CustomTabPanel>
        </Box>
    );
}

export default DefinitionPage