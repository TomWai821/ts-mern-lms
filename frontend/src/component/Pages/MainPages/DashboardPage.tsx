import { Box} from "@mui/material";
import { usePageService } from "../../../services/pages/pageService";
import DashboardTabPanel from "../TablePages/Tabs/DashboardTabPanel";
import CustomTab from "../../UIFragment/CustomTab";

const DashboardPage = () => 
{
    const {tabValue, changeValue} = usePageService();

    const tabLabel = 
    [
        {label: "User Section"},
        {label: "Book Section"},
        {label: "Fine Records Section"}
    ]

    return(
        <Box>
            <CustomTab value={tabValue} changeValue={changeValue} tabLabel={tabLabel} type={""}/>
            
            <DashboardTabPanel tabValue={tabValue}/>
        </Box>
    )
}

export default DashboardPage