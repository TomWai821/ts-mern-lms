import { FC, Fragment } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material"

import HistoryIcon from '@mui/icons-material/History';
import StarIcon from "@mui/icons-material/Star"

import { useModal } from "../../../Context/ModalContext";

// Other Modals
import ReturnBookConfirmModal from "../../book/components/modals/confirms/ReturnBookConfirmModal";

// Models
import { LoanBookInterface } from "../../../Model/ResultModel";
import { RecordTableCellInterface } from "../../../Model/TablePagesAndModalModel";

// Controllers
import { DisableValidationForLoanBook } from "../../../Controller/OtherUsefulController";


import { ImportantActionButtonSyntax } from "../../../Data/Style";
import { useFavouriteBookAction } from "../../../hooks/actionhook/useBookFavouriteAction";


const SelfRecordBookTableCell:FC<RecordTableCellInterface> = (returnBookTableCellData) => 
{
    const { value, Information } = returnBookTableCellData;

    const { NoLongerFavouriteBook } = useFavouriteBookAction();
    const { handleOpen } = useModal();

    const openReturnBookModal = () => 
    {
        handleOpen(<ReturnBookConfirmModal data={Information as LoanBookInterface} modalOpenPosition={"LoanBookTableCell"}/>);
    }

    return(
        <TableCell>
            {
                value === 0 &&
                <Tooltip title={"Return Book"} arrow>
                    <IconButton disabled={DisableValidationForLoanBook(Information)} sx={ImportantActionButtonSyntax} onClick={openReturnBookModal}>
                        <HistoryIcon />
                    </IconButton>
                </Tooltip>
            }

            {
                value === 1 &&
                <Fragment>
                    {
                        <Tooltip title={"No Longer Favourite"} arrow>
                            <IconButton sx={{color: "gold"}} onClick={() => NoLongerFavouriteBook(Information._id)}>
                                <StarIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </Fragment>
            }
        </TableCell>
    )
}

export default SelfRecordBookTableCell