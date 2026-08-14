import { FC, lazy, Suspense } from "react"

// UI Fragment
import CustomTabPanel from "../../../UIFragment/CustomTabPanel"
import { Box } from "@mui/material"

const DashboardPage = lazy(() => import("../../MainPages/DashboardPage"));
const BookRecommendationPage = lazy(() => import("../../MainPages/BookRecommendationPage"));

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
            <Suspense fallback={<div>Loading...</div>}>
            {
                MainPages.map((table, index) => 
                (
                    <CustomTabPanel key={index} index={index} value={tabValue}>
                        {table}
                    </CustomTabPanel>
                ))
            }
            </Suspense>
        </Box>
    )
}

export default MainPageTabPanel