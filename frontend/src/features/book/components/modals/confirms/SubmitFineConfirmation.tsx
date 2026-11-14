import { FC } from "react";
import { Box, Button, Typography } from "@mui/material";

import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";


import { ReturnBookInterface } from "../../../../../Model/ModelForModal";
import { LoanBookInterface } from "../../../../../Model/ResultModel";

import { getOverdueDays } from "../../../../../Controller/OtherController";
import { useLoanBookAction } from "../../../../../hooks/actionhook/useLoanBookAction";

const SubmitFinesConfirmModal:FC<ReturnBookInterface> = (returnBookModalData) => 
{
    const {data} = returnBookModalData;

    const Data = data as LoanBookInterface; 
    const { ReturnBook } = useLoanBookAction();

    return(
        <ModalTemplate title={"Submit Fines Confirmation"}  width="400px" cancelButtonName={"No"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Does {Data.userDetails?.username} submit fines now?</Typography>
                <Typography>Fines Per Day: HKD$1.5</Typography>
                <Typography>OverDue: {getOverdueDays(Data.dueDate as string , data.returnDate as string)} days</Typography>
                <Typography>Total: HKD${Data.fineAmount} </Typography>
            </Box>
            <Button variant='contained' onClick={() => ReturnBook(Data, "Paid")}>Yes</Button>
        </ModalTemplate>
    )
}

export default SubmitFinesConfirmModal