import { FC, Fragment } from "react";
import { Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import OptionFields from "../../../Manager/OptionFieldsManager";

// Context
import { useModal } from "../../../../Context/ModalContext";

// Another Modal
import CreateBookModal from "../../../Modal/Book/CreateBookModal";

// Models
import { FilterInterface } from "../../../../Model/TablePagesAndModalModel";
import { BookTableDataInterface } from "../../../../Model/BookTableModel";

// Data(CSS Syntax and dropdown data)
import { ItemToCenter } from "../../../../Data/Style";
import { AllBookStatusOption, LoanBookStatusOption } from "../../../../Data/TableData";
import { useAuthContext } from "../../../../Context/User/AuthContext";
import { useFilterActions } from "../../../../services/filters/filterActions";

const useBookFilter = (resetFilter: (() => void) | undefined, IsAdmin: () => boolean, IsLoggedIn: () => boolean) =>
{
    const { handleOpen } = useModal();

    const ActionMenu =
    [
        { label: 'Reset Filter', clickEvent: resetFilter },
        { label: 'Create book', clickEvent: () => handleOpen(<CreateBookModal />) }
    ]

    return { ActionMenu, IsAdmin, IsLoggedIn };
}


const BookFilter: FC<FilterInterface> = (filterData) => 
{
    const { value, searchData, onChange, Search, resetFilter } = filterData;
    const bookData = searchData as unknown as BookTableDataInterface;

    const { IsAdmin, IsLoggedIn } = useAuthContext();
    const { ActionMenu } = useBookFilter(resetFilter, IsAdmin, IsLoggedIn);
    const { optionVisiable, toggleCardVisibility, actionMenu, handleActionMenu } = useFilterActions();

    return (
        <Box sx={{ padding: '25px 15%' }}>
            <Box sx={{ ...ItemToCenter, paddingBottom: '25px', alignItems: 'center' }}>

                {
                    value === 0 ?
                        <Fragment>
                            <TextField label="Book Name" name="bookname" value={bookData.bookname} onChange={onChange} size="small" sx={{ width: '45%' }} />
                            {
                                IsLoggedIn() &&
                                <TextField label="Status" name="status" value={searchData.status} onChange={onChange} size="small" sx={{ marginLeft: '10px', width: '15%' }} select>
                                    {
                                        AllBookStatusOption.map((option, index) =>
                                        (
                                            <MenuItem key={index} value={option}>{option}</MenuItem>
                                        ))
                                    }
                                </TextField>
                            }
                        </Fragment>
                        :
                        <Fragment>
                            <TextField label="Book Name" name="bookname" value={bookData.bookname} onChange={onChange} size="small" sx={{ width: '45%' }} />
                            <TextField label="Status" name="status" value={searchData.status} onChange={onChange} size="small" sx={{ marginLeft: '10px', width: '15%' }} select>
                                {
                                    LoanBookStatusOption.map((option, index) =>
                                    (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </Fragment>
                }


                <IconButton onClick={toggleCardVisibility}>
                    {optionVisiable ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>

                <Button variant="contained" sx={{ ml: 1 }} onClick={Search}>Search</Button>

                {
                    IsAdmin() ? 
                    (
                        <Fragment>
                            {
                                value === 0 
                                ? 
                                (<Button variant="contained" sx={{ ml: 1 }} onClick={handleActionMenu}>Action</Button>) 
                                :
                                (<Button variant="contained" sx={{ ml: 1 }} onClick={resetFilter}>Reset Filter</Button>)
                            }

                            <Menu open={Boolean(actionMenu)} anchorEl={actionMenu} onClose={handleActionMenu}>
                                {
                                    ActionMenu.map((action, index) => 
                                    (
                                    <MenuItem key={index} onClick={action.clickEvent}>
                                        <Typography>{action.label}</Typography>
                                    </MenuItem>
                                    ))
                                }
                            </Menu>
                        </Fragment>
                    ) 
                    :
                    (
                        <Button variant="contained" sx={{ ml: 1 }} onClick={resetFilter}>Reset Filter</Button>
                    )
                }
            </Box>

            <OptionFields value={value} type={"Book"} optionVisiable={optionVisiable} onChange={onChange} searchData={searchData} />
        </Box>
    );
}

export default BookFilter;
