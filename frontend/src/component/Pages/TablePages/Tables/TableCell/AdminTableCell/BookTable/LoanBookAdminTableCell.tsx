import { FC } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import { History as HistoryIcon, AttachMoney as AttachMoneyIcon } from "@mui/icons-material";

import { ImportantActionButtonSyntax } from "../../../../../../../Data/Style";
import { ActionTableCellInterface } from "../../../../../../../Model/TablePagesAndModalModel";
import { BookDataInterface, LoanBookInterface } from "../../../../../../../Model/ResultModel";
import { useModal } from "../../../../../../../Context/ModalContext";
import { DisableValidationForLoanBook } from "../../../../../../../Controller/OtherUsefulController";

import ReturnBookConfirmModal from "../../../../../../Modal/Confirmation/Book/ReturnBookConfirmModal";
import SubmitFinesConfirmModal from "../../../../../../Modal/Confirmation/Book/SubmitFineConfirmation";

const LoanBookAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { handleOpen } = useModal();
    const { Information } = tableCellData;
    const bookData = Information as BookDataInterface;

    const openAnotherModal = (type: string) =>
    {
        switch (type)
        {
            case "ReturnBook":
                handleOpen(<ReturnBookConfirmModal data={bookData as unknown as LoanBookInterface} modalOpenPosition={"AdminTableCell"} />);
                break;

            case "SubmitFines":
                handleOpen(<SubmitFinesConfirmModal modalOpenPosition={""} data={bookData as unknown as LoanBookInterface} />);
                break;

            default:
                break;
        }
    };

    const actions = 
    [
        { title: "Return Book", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("ReturnBook"), icon: <HistoryIcon />, disable: DisableValidationForLoanBook(bookData as unknown as LoanBookInterface) },
        { title: "Submit fines", syntax: ImportantActionButtonSyntax, clickEvent: () => openAnotherModal("SubmitFines"), icon: <AttachMoneyIcon />, disable: !(bookData.status === "Returned(Late)") },
    ];

    return (
        <TableCell sx={{ marginLeft: "20px" }}>
            {
                actions.map((action, index) => (
                    <Tooltip title={action.title} key={index} arrow>
                        <IconButton sx={action.syntax} onClick={action.clickEvent} disabled={action.disable}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </TableCell>
    );
};

export default LoanBookAdminTableCell;
