import { FC, Fragment, useContext } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material"

import HistoryIcon from '@mui/icons-material/History';
import StarIcon from "@mui/icons-material/Star"

import { useModal } from "../../../../../Context/ModalContext";

// Other Modals
import ReturnBookConfirmModal from "../../../../Modal/Confirmation/Book/ReturnBookConfirmModal";

// Models
import { LoanBookInterface } from "../../../../../Model/ResultModel";
import { RecordTableCellInterface } from "../../../../../Model/TablePagesAndModalModel";

// Controllers
import { DisableValidationForLoanBook } from "../../../../../Controller/OtherUsefulController";


import { ImportantActionButtonSyntax } from "../../../../../Data/Style";
import { AlertContext } from "../../../../../Context/AlertContext";
import { useSelfBookRecordContext } from "../../../../../Context/Book/SelfBookRecordContext";


const RecordBookTableCell:FC<RecordTableCellInterface> = (returnBookTableCellData) => 
{
    const {value, Information} = returnBookTableCellData;

    const {handleOpen} = useModal();
    const {unfavouriteBook} = useSelfBookRecordContext();
    const alertContext = useContext(AlertContext);

    const openReturnBookModal = () => 
    {
        handleOpen(<ReturnBookConfirmModal data={Information as LoanBookInterface} modalOpenPosition={"LoanBookTableCell"}/>);
    }

    const unfavourite = async () => 
    {
        const response =  await unfavouriteBook(Information._id);
        
        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                     alertContext.setAlertConfig({ AlertType: "success", Message: "Unfavourite successfully!" });
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "Failed to Unfavourite! Please try again" });
                    break;
            }
        }
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
                        <Tooltip title={"Unfavourite"} arrow>
                            <IconButton sx={{color: "gold"}} onClick={unfavourite}>
                                <StarIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </Fragment>
            }
        </TableCell>
    )
}

export default RecordBookTableCell