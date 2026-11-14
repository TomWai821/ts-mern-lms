import { FC } from "react";
import { Box, Button, TextField } from "@mui/material";
import { ItemToCenter } from "../../../Data/Style";
import { DefinitionFilterInterface } from "../../../Model/TablePagesAndModalModel";

const DefinitionFilter:FC<DefinitionFilterInterface> = (filterData) => 
{
    const {value, searchData, onChange, Search, resetFilter} = filterData;
        
    const dataForTextField = 
    [
        {label: "Genre", name: "genre", value: searchData.genre},
        {label: "language", name: "language", value: searchData.language}
    ]

    return(
        <Box sx={{ padding: '25px 15%' }}>
            <Box sx={{ ...ItemToCenter, paddingBottom: '25px', alignItems: 'center' }}>
               
                <TextField label={dataForTextField[value].label} name={dataForTextField[value].name} value={dataForTextField[value].value} 
                    onChange={onChange} size="small" sx={{ width: '60%', paddingRight: '20px' }}/>
                
                <Button variant='contained' sx={{marginLeft: '10px'}} onClick={Search}>Search</Button>
                <Button variant='contained' sx={{marginLeft: '10px'}} onClick={resetFilter}>Reset Filter</Button>
            </Box>
        </Box>
    )
}

export default DefinitionFilter