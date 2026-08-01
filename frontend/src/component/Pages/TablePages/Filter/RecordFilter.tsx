import { FC, Fragment } from "react"
import { FilterInterface } from "../../../../Model/TablePagesAndModalModel"
import { Box, TextField, Button, MenuItem, IconButton } from "@mui/material";
import { ItemToCenter } from "../../../../Data/Style";
import { SelfLoanBookSearchInterface } from "../../../../Model/BookTableModel";
import { AllBookStatusOption, LoanBookStatusOption } from "../../../../Data/TableData";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import OptionFields from "../../../Manager/OptionFieldsManager";
import { useFilterActions } from "../../../../services/filters/filterActions";

const RecordFilter:FC<FilterInterface> = (filterData) => 
{
    const {value, searchData, onChange, Search, resetFilter} = filterData;
    
    const { optionVisiable, toggleCardVisibility } = useFilterActions();
    const Data = searchData as SelfLoanBookSearchInterface;

    return(
        <Box sx={{ padding: '25px 15%' }}>
            <Box sx={{ ...ItemToCenter, paddingBottom: '25px', alignItems: 'center' }}>
               
                <TextField label="Book Name" name="bookname" value={Data.bookname} onChange={onChange} size="small" sx={{ width: '50%', paddingRight: '10px' }}/>
                {
                    value === 0 ?
                    <TextField label="Status" name="status" value={searchData.status} onChange={onChange} size="small" sx={{ width: '15%' }} select>
                        { 
                            LoanBookStatusOption.map((option, index) => 
                            (
                                <MenuItem key={index} value={option}>{option}</MenuItem>
                            ))
                        }
                    </TextField>
                    :
                    <Fragment>
                        <TextField label="Status" name="status" value={Data.status} onChange={onChange} size="small" sx={{ width: '15%' }} select>
                        {
                            AllBookStatusOption.map((option, index) => 
                                (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                )
                            )
                        }
                        </TextField>

                        <IconButton onClick={toggleCardVisibility}>
                            {optionVisiable ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </IconButton>
                    </Fragment>

                }
                
                <Button variant='contained' sx={{marginLeft: '10px'}} onClick={Search}>Search</Button>
                <Button variant='contained' sx={{marginLeft: '10px'}} onClick={resetFilter}>Reset Filter</Button>
            </Box>


            <OptionFields value={value} type={"Record"} optionVisiable={optionVisiable} onChange={onChange} searchData={searchData}/>
        </Box>
    );
}

export default RecordFilter