import { Box, MenuItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import { ChangeEvent, FC, Fragment } from "react";

import { TabInterface } from "../../Model/TablePagesAndModalModel";

import { displayAsRow } from "../../Data/Style";
import { TabProps } from "../../Controller/OtherUsefulController";
import { useAuthContext } from "../../Context/User/AuthContext";

const CustomTab:FC<TabInterface> = (TabData) => 
{

    const {tabLabel, type, value, paginationValue, changeValue, paginationOption} = TabData;
    const {IsAdmin, IsLoggedIn} = useAuthContext();

    const handleTabChange = (event: ChangeEvent<{}>, newValue: number) => 
    {
        changeValue("Tab", newValue);
    }

    const handlePaginationChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
    {
        const selectedValue = parseInt(event.target.value);
        changeValue("Pagination", selectedValue);
    }

    const condition = () =>
    {
        return IsAdmin() || (IsLoggedIn() && type === "Record");
    }

    return(
        <Fragment>
            <Box sx={{ ...displayAsRow, width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                { condition() && (
                    <Tabs value={value} onChange={handleTabChange}>
                        {tabLabel.map((tab, index) => 
                            (
                                <Tab key={index} label={tab.label} {...TabProps(index)}/>
                            ))
                        }
                    </Tabs>
                )}

                {
                    paginationValue &&
                    <Box sx={{...displayAsRow, alignItems: 'center', marginLeft: 'auto'}}>
                        <Typography sx={{marginRight: '10px'}}>Show Rows</Typography>
                        <TextField size="small" value={paginationValue} onChange={handlePaginationChange} select>
                            {
                                (paginationOption as number[]).map((option, index) => 
                                    (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    )
                                )
                            }
                        </TextField>
                    </Box>
                }
            </Box>
        </Fragment>
    );
}

export default CustomTab