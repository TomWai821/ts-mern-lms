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

import TableTitle from "../../UIFragment/TableTitle";
import DefinitionFilter from "./Filter/DefinitionFilter";
import ChipBody from "../../Templates/ChipBodyTemplate";
import CustomTabPanel from "../../UIFragment/CustomTabPanel";

// Custom Hook in services (Page Data and Filter)
import { usePageService } from "../../../services/pages/pageService";
import { useDefinitionFilter } from "../../../services/filters/definitionFilter";

const DefinitionPage  = () => 
{
    const { IsAdmin } = useAuthContext();
    const { definition } = useDefinitionContext();
    const { title, tabValue, ChangeTabValue } = usePageService("Definition", IsAdmin);
    const { searchData, onChange, SearchDefinition, resetFilter } = useDefinitionFilter(tabValue);
    const definitionType = tabValue === 0 ? "Genre" : "Language";

    useEffect(() => 
    {
        if(!IsAdmin())
        {
            ChangePage('/');
        }
    },[IsAdmin])

    return(
        <Box sx={{ ...PageItemToCenter, flexDirection: 'column', padding: '0 50px'}}>

            <TableTitle title={title} dataLength={definition[definitionType].length}/>

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
                <ChipBody value={tabValue} definitionType={definitionType} data={definition.Genre}/>
            </CustomTabPanel>

            <CustomTabPanel index={tabValue} value={1}>
                <ChipBody value={tabValue} definitionType={definitionType} data={definition.Language}/>
            </CustomTabPanel>
        </Box>
    );
}

export default DefinitionPage