import { ChangeEvent, FC, Fragment, useContext, useState } from "react";
import { Avatar, Box, Button, MenuItem, TextField, Typography } from "@mui/material";

import { BookImageFormat, displayAsRow, ModalBodySyntax, ModalSubTitleSyntax } from "../../../../Data/Style";
import ModalTemplate from "../../../Templates/ModalTemplate";


import { ReturnBookInterface } from "../../../../Model/ModelForModal";
import { countLateReturn, TransferDateToISOString } from "../../../../Controller/OtherController";
import { LoanBookInterface } from "../../../../Model/ResultModel";

import { useBookContext } from "../../../../Context/Book/BookContext";
import { useModal } from "../../../../Context/ModalContext";
import { useAuthContext } from "../../../../Context/User/AuthContext";
import { AlertContext } from "../../../../Context/AlertContext";

const ReturnBookConfirmModal:FC<ReturnBookInterface> = (returnBookModalData) => 
{
    const {modalOpenPosition, data} = returnBookModalData;
    const {IsAdmin} = useAuthContext();
    const {handleClose} = useModal();
    const {returnBook} = useBookContext();
    const alertContext = useContext(AlertContext);

    const [finesPaid, setFinesPaid] = useState<string>("Not Paid");

    const Data = data as LoanBookInterface; 

    const CalculateLateReturn = countLateReturn(Data.dueDate as string) as number;

    const ReturnBook = async () => 
    {
        const response = data.fineAmount as number > 0 ? await returnBook(data._id, finesPaid) : await returnBook(Data._id);

        if (alertContext && alertContext.setAlertConfig) 
        {
            switch(response.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: "Return Book successfully!" });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "Failed to Return book! Please try again later" });
                    break;
            }
        }
    }

    const modifyFinesPaid = (event:ChangeEvent<HTMLInputElement>) => 
    {
        const {value} = event.target;
        setFinesPaid(value);
    }

    const setTitle = () => 
    {
        return (modalOpenPosition === "AdminTableCell" && IsAdmin()) ? `Loan Book Record for ${Data.userDetails?.username}` : "Do you want to return this book?";
    }

    const ReturnBookData = 
    [
        {label: "Bookname", value: Data.bookDetails?.bookname},
        {label: "Loan Date", value: TransferDateToISOString(Data.loanDate as Date)},
        {label: "Due Date", value: TransferDateToISOString(Data.dueDate as Date)},
        {label: "Overdue", value: data.fineAmount as number > 0 ? `Yes (${CalculateLateReturn} days)` : "No"},
    ]

    return(
        <ModalTemplate title={"Return Book Confirmation"}  width="600px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{setTitle()}</Typography>

                <Box sx={{...displayAsRow, justifyContent: 'space-between'}}>
                    <Avatar src={Data.bookDetails?.image?.url} alt="Preview" variant="rounded" sx={BookImageFormat}/>

                    <Box sx={{ display: 'grid', gap: '20px 50px', width:'350px', gridTemplateColumns: '100%'}}>
                        {
                            ReturnBookData.map((data, index) => 
                                (
                                    <Typography key={index}>{data.label}: {data.value}</Typography>
                                )
                            )
                        }

                        {
                            data.fineAmount as number > 0 &&
                            <Fragment>
                                <Typography>{`Fine Amount: HKD${data.fineAmount}`}</Typography>

                                <Box sx={{...displayAsRow, alignItems: 'center'}}>
                                    <Typography sx={{paddingRight: '10px'}}>Fine Paid:</Typography>
                                    <TextField size="small" name={finesPaid} value={finesPaid} onChange={modifyFinesPaid} select>
                                        <MenuItem value={"Not Paid"}>Not Paid</MenuItem>
                                        <MenuItem value={"Paid"}>Paid</MenuItem>
                                    </TextField>
                                </Box>
                            </Fragment>
                        }
                    </Box>
                </Box>

            </Box>
            <Button variant='contained' onClick={() => ReturnBook()}>Return</Button>
        </ModalTemplate>
    )
}

export default ReturnBookConfirmModal