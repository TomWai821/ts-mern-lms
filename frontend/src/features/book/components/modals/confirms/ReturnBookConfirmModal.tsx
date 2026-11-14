import { ChangeEvent, FC, Fragment, useContext, useState } from "react";
import { Avatar, Box, Button, MenuItem, TextField, Typography } from "@mui/material";

import { BookImageFormat, displayAsRow, ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";


import { ReturnBookInterface } from "../../../../../Model/ModelForModal";
import { getOverdueDays, TransferDateToISOString } from "../../../../../Controller/OtherController";
import { LoanBookInterface } from "../../../../../Model/ResultModel";

import { useAuthContext } from "../../../../../Context/User/AuthContext";
import { useLoanBookAction } from "../../../../../hooks/actionhook/useLoanBookAction";


const useFinesStateHandler = (Data: LoanBookInterface) => 
{
    const [finesPaid, setFinesPaid] = useState<string>("Not Paid");
    const CalculateLateReturn = getOverdueDays(Data.dueDate as string) as number;

    const modifyFinesPaid = (event:ChangeEvent<HTMLInputElement>) => 
    {
        const {value} = event.target;
        setFinesPaid(value);
    }

    return {finesPaid, CalculateLateReturn, modifyFinesPaid}
}

const pageConfig = (data: ReturnBookInterface["data"], modalOpenPosition: ReturnBookInterface["modalOpenPosition"], CalculateLateReturn: number) =>
{
    const {isAdmin} = useAuthContext();

    const setTitle = () => 
    {
        return (modalOpenPosition === "AdminTableCell" && isAdmin) ? `Loan Book Record for ${data.userDetails?.username}` : "Do you want to return this book?";
    }

    const ReturnBookData = 
    [
        {label: "Bookname", value: data.bookDetails?.bookname},
        {label: "Loan Date", value: TransferDateToISOString(data.loanDate as Date)},
        {label: "Due Date", value: TransferDateToISOString(data.dueDate as Date)},
        {label: "Overdue", value: data.fineAmount as number > 0 ? `Yes (${CalculateLateReturn} days)` : "No"},
    ]

    return {setTitle, ReturnBookData};
}

const ReturnBookConfirmModal:FC<ReturnBookInterface> = (returnBookModalData) => 
{
    const {modalOpenPosition, data} = returnBookModalData;
    
    const { finesPaid, CalculateLateReturn, modifyFinesPaid } = useFinesStateHandler(data);
    const {setTitle, ReturnBookData} = pageConfig(data, modalOpenPosition, CalculateLateReturn);
    const { ReturnBook } = useLoanBookAction();

    

    return(
        <ModalTemplate title={"Return Book Confirmation"}  width="600px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{setTitle()}</Typography>

                <Box sx={{...displayAsRow, justifyContent: 'space-between'}}>
                    <Avatar src={data.bookDetails?.image?.url} alt="Preview" variant="rounded" sx={BookImageFormat}/>

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
            <Button variant='contained' onClick={() => ReturnBook(data, finesPaid)}>Return</Button>
        </ModalTemplate>
    )
}

export default ReturnBookConfirmModal