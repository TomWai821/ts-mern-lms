import { FC } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material";


import { UserActionTableCellInterface } from "../../../Model/TablePagesAndModalModel";
import { BookDataInterface } from "../../../Model/ResultModel";

import { useFavouriteBookHandler } from "../../book/components/adminTableCells/BookAdminTableCell";


const BookFavouriteActionCell:FC<UserActionTableCellInterface> = (actionTableCellData) => 
{
    const {Information} = actionTableCellData;
    const {favouriteIconConfig, favouriteHandler} = useFavouriteBookHandler(Information as BookDataInterface);

    return(
        <TableCell sx={{marginLeft: '20px'}}>
            <Tooltip title={favouriteIconConfig.toolTip} arrow>
                <IconButton onClick={() => favouriteHandler()} sx={favouriteIconConfig.syntax}>
                    {favouriteIconConfig.icon}
                </IconButton>
            </Tooltip>
        </TableCell>
    );
}

export default BookFavouriteActionCell;