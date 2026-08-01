import { FC } from "react"
import { Box, TextField, Button, Menu, Typography, MenuItem } from "@mui/material";
import { ContactFilterInterface } from "../../../../Model/TablePagesAndModalModel"

import { ItemToCenter } from "../../../../Data/Style";

import CreateContextModal from "../../../Modal/Contact/CreateContactModal";
import { useModal } from "../../../../Context/ModalContext";
import { ContactSearchInterface } from "../../../../Model/BookTableModel";
import { useFilterActions } from "../../../../services/filters/filterActions";

const useContactFilter = (value: number, searchData: ContactSearchInterface, resetFilter: (() => void) | undefined) => 
{
    const { handleOpen } = useModal();

    const dataForTextField = 
    [
        {label: "Author", name: "author", value: searchData.author},
        {label: "Publisher", name: "publisher", value: searchData.publisher}
    ]

    const ActionMenu = 
    [
        {label: 'Reset Filter', clickEvent: resetFilter},
        {label: `Create ${value === 0 ? "Author" : "Publisher"}`, clickEvent: () => handleOpen(<CreateContextModal value={value}/>)}
    ]

    return {dataForTextField, ActionMenu};
}


const ContactFilter:FC<ContactFilterInterface> = (filterData) => 
{
    const { value, searchData, onChange, Search, resetFilter } = filterData;

    const { dataForTextField, ActionMenu } = useContactFilter(value, searchData, resetFilter);
    const { actionMenu, handleActionMenu } = useFilterActions();
    
    return(
        <Box sx={{ padding: '25px 15%' }}>
            <Box sx={{ ...ItemToCenter, paddingBottom: '25px', alignItems: 'center' }}>
               
                <TextField label={dataForTextField[value].label} name={dataForTextField[value].name} value={dataForTextField[value].value} 
                    onChange={onChange} size="small" sx={{ width: '60%', paddingRight: '10px' }}/>
                
                <Button variant='contained' sx={{marginLeft: '10px'}} onClick={Search}>Search</Button>
                <Button variant='contained' sx={{ marginLeft: '10px' }} onClick={handleActionMenu}>Action</Button>
                <Menu open={Boolean(actionMenu)} anchorEl={actionMenu} onClose={handleActionMenu}>
                    {
                        ActionMenu.map((action, index) =>(
                            <MenuItem key={index}>
                                <Typography onClick={action.clickEvent}>{action.label}</Typography>
                            </MenuItem>
                            )
                        )
                    }
                </Menu> 
                
            </Box>
        </Box>
    );
}

export default ContactFilter
