import { FC, Fragment } from "react"
import { Box, Card, Typography } from "@mui/material"

import { OptionFieldModel } from "../../Model/InputFieldModel";
import SearchFieldSection from "./SearchOptionsSection/SearchFieldSection";

const SearchOptionField:FC<OptionFieldModel> = ({...optionData}) =>
{
    const {optionVisiable, onChange, SearchField, searchData} = optionData;

    if (!optionVisiable) 
    {
        return null;
    }

    return(
        <Fragment>
            {optionVisiable && (
                <Card sx={{padding: '15px' }}>
                    <Typography>Options</Typography>
                    <Box sx={{ padding: '15px 20px', display: 'grid', justifyContent: 'center', alignItems: 'center', gap: '15px 50px', gridTemplateColumns: '10% 30% 10% 30%' }}>
                        {
                            SearchFieldSection(SearchField, searchData, onChange)
                        }
                    </Box>
                </Card>
            )}
        </Fragment>
    )
}

export default SearchOptionField