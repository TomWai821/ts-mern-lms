import { FC } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"

import BookRecommendationPage from "../../MainPages/BookRecommendationPage"
import DashboardPage from "../../MainPages/DashboardPage"
import { Box } from "@mui/material"

interface PropsInterface
{
    tabValue: number
}

const MainPageTabPanel:FC<PropsInterface> = (props) =>
{
    const {tabValue} = props;

    const MainPages = 
    [
        <DashboardPage/>,
        <BookRecommendationPage/>
    ];

    const TabSyntax = {padding: "20px 20px"};
    
    return(
        <Box sx={TabSyntax}>
            {
                MainPages.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={tabValue}>
                        {table}
                    </CustomTabPanel>
                ))
            }
        </Box>
    )
}

export default MainPageTabPanel