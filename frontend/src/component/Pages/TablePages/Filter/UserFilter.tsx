
import { FC, Fragment } from "react";
import { Box, Button, IconButton, Menu, MenuItem, TextField, Typography } from "@mui/material";

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import OptionFields from "../../../Manager/OptionFieldsManager";

// Context
import { useModal } from "../../../../Context/ModalContext";

import CreateUserModal from "../../../Modal/User/CreateUserModal";

// Models
import { FilterInterface } from "../../../../Model/TablePagesAndModalModel";
import { UserDataInterface } from "../../../../Model/UserTableModel";

// data (CSS Syntax)
import { ItemToCenter } from "../../../../Data/Style";
import { useAuthContext } from "../../../../Context/User/AuthContext";
import { StatusFilterOption } from "../../../../Data/TableData";
import { useFilterActions } from "../../../../services/filters/filterActions";

const useUserFilter = (resetFilter: (() => void) | undefined) =>
{
    const { handleOpen } = useModal();

    const ActionMenu = 
    [
        {label: 'Reset Filter', clickEvent: resetFilter},
        {label: 'Create User', clickEvent: () => handleOpen(<CreateUserModal />)}
    ]

    return {ActionMenu};
}

const UserFilter:FC<FilterInterface> = (filterData) => 
{
    const {value, onChange, searchData, Search, resetFilter} = filterData;
    const {IsAdmin} = useAuthContext();

    const { ActionMenu } = useUserFilter(resetFilter);
    const { optionVisiable, toggleCardVisibility, actionMenu, handleActionMenu } = useFilterActions();

    const userData = searchData as UserDataInterface;
    
    return(
        <Box sx={{ padding: '25px 15%' }}>
            <Box sx={{...ItemToCenter, paddingBottom: '25px', alignItems: 'center'}}>

                {
                    value === 0 ?
                    <Fragment>
                        <TextField label={"Username"} value={userData.username} name="username" size="small" onChange={onChange} sx={{width: '45%'}}/>
                        <TextField label={"Status"} value={userData.status} name="status" size="small" onChange={onChange} sx={{width: '15%', marginLeft: '10px'}} select>
                            {
                                StatusFilterOption.map((option, index) => 
                                    (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    )
                                )
                            }

                        </TextField>
                    </Fragment>
                    :
                    <TextField label={"Username"} value={userData.username} name="username" size="small" onChange={onChange} sx={{width: '60%'}}/>
                }


                {
                    IsAdmin() && 
                    <IconButton onClick={toggleCardVisibility}>
                        {optionVisiable ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                    </IconButton>
                }

                
                <Button variant='contained' sx={{marginLeft: '10px'}} onClick={Search}>Search</Button>
                
                {IsAdmin() && value === 0 ?
                    <Button variant='contained' sx={{ marginLeft: '10px' }} onClick={handleActionMenu}>Action</Button> 
                    : 
                    <Button variant='contained' sx={{ marginLeft: '10px' }} onClick={resetFilter}>Reset Filter</Button> 
                }

                <Menu open={Boolean(actionMenu)} anchorEl={actionMenu} onClose={handleActionMenu}>
                    {(IsAdmin() && value === 0) &&
                        (
                            ActionMenu.map((action, index) =>
                                (
                                    <MenuItem key={index}>
                                        <Typography onClick={action.clickEvent}>{action.label}</Typography>
                                    </MenuItem>
                                )
                            )
                        )
                    }
                </Menu>
            </Box>

            <OptionFields value={value} type={"User"} optionVisiable={optionVisiable} onChange={onChange} searchData={searchData}/>
        </Box>
    );
}

export default UserFilter