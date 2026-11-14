"use client";
import { FC } from "react"
import { DisplayDataModalBody } from "../../../../../../Model/ModelForModal"
import { Avatar, Box, Typography } from "@mui/material";
import { BookImageFormat, displayAsRow} from "../../../../../../Data/Style";
import { LoanBookInterface } from "../../../../../../Model/ResultModel";
import { TransferDateToISOString } from "../../../../../../Controller/OtherController";
import { setLoanBookDataTextColor } from "../../../../../../Controller/SetTextController";

const LoanBookDataBody:FC<DisplayDataModalBody> = (AllUserData) => 
{
    const {data} = AllUserData;
    const LoanData = data as LoanBookInterface;

    const imageUrl = LoanData.bookDetails?.image?.url;

    const CalculateExpired = "";
    const CalculateLateReturn = "";

    const BookData: Record<string,{label:string, data:any}> = 
    {
        "bookname": {label: "Bookname", data:LoanData.bookDetails?.bookname},
        "username": {label: "Username", data:LoanData.userDetails?.username},
        "loanDate": {label: "Loan Date", data:TransferDateToISOString(LoanData.loanDate as Date)},
        "dueDate": {label: "Due Date", data:TransferDateToISOString(LoanData.dueDate as Date)},
    };

    return(
        <Box sx={{...displayAsRow, justifyContent: 'space-between'}}>
            <Avatar src={imageUrl} alt="Preview" variant="rounded" sx={BookImageFormat}/>
            
            <Box sx={{ display: 'grid', gap: '20px 50px', width:'350px', gridTemplateColumns: '100%'}}>
                {
                    Object.entries(BookData).map(([key, data], index) => 
                        (
                            <Typography key={index}>{data.label}: {data.data}</Typography>
                        )
                    )
                }

                {
                    <Typography>
                        Status: <Box component={"span"} color={ setLoanBookDataTextColor(LoanData.status as string)}>{LoanData.status}</Box>
                        <Typography component="span" sx={{color: 'rgb(230, 0, 0)'}}>
                            { CalculateExpired && ` (Overdue by ${CalculateLateReturn} Day)`}
                        </Typography>
                    </Typography>
                }

                    <Typography>Fines: <Box component={"span"} color={ setLoanBookDataTextColor(LoanData.finesPaid as string)}>
                            { CalculateExpired && LoanData.finesPaid === " Not Fine Needed" ? " Not Paid" : LoanData.finesPaid} {LoanData.fineAmount as number > 0 && `(HKD$ ${LoanData.fineAmount})`}
                        </Box>
                    </Typography>

                {
                    LoanData.status !== "Loaned" && <Typography>Return Date: {LoanData.returnDate === null ? "N/A" : TransferDateToISOString(LoanData.returnDate as Date)}</Typography>
                }
            </Box>
        </Box>
    );
}

export default LoanBookDataBody