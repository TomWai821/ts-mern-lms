import { FC, useContext } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import ModalTemplate from "../../../Templates/ModalTemplate";

import { BookImageFormat, displayAsColumn, displayAsRow, ModalBodySyntax, ModalSubTitleSyntax } from "../../../../Data/Style";

import { useBookContext } from "../../../../Context/Book/BookContext";
import { useModal } from "../../../../Context/ModalContext";

import { QRCodeInterface, UserLoanBookModalBodyInterface } from "../../../../Model/ModelForModal";

import LoanBookConfirmationModal from "./LoanBookConfirmationModal";
import { AlertContext } from "../../../../Context/AlertContext";
import ExpandableTypography from "../../../UIFragment/ExpandableTypography";
import { errorResponse } from "../../../../Model/ResultModel";


const UserLoanBookConfirmationModal:FC<UserLoanBookModalBodyInterface> = (LoanBookData) => 
{
    const {qrCodeData, _id, bookname, author, language, genre, description, imageUrl} = LoanBookData;
    const {loanBook} = useBookContext();
    const {handleOpen, handleClose} = useModal();
    const alertContext = useContext(AlertContext);

    const handleScanData = () =>
    {
        if(!qrCodeData)
        {
            return {username: "", authToken: ""};
        }

        const parseData = JSON.parse(qrCodeData) as QRCodeInterface;
        return {username: parseData.username, authToken: parseData.authToken}
    }

    const ConfirmLoanBook = async () => 
    {
        const response: Response  = await loanBook(_id, handleScanData().authToken);

        if (alertContext && alertContext.setAlertConfig) 
        {   
            switch (response?.status)
            {
                case 200:
                    alertContext.setAlertConfig({ AlertType: "success", Message: `Loan book to ${handleScanData().username} successfully!` });
                    setTimeout(() => { handleClose() }, 2000);
                    break;

                case 401:
                    const result = response.json() as Promise<errorResponse>;
                    alertContext.setAlertConfig({ AlertType: "error", Message: (await result).error });
                    break;

                default:
                    alertContext.setAlertConfig({ AlertType: "error", Message: "Unable to loan book to the user! Please try again later" });
                    break;
            }
             
        }
    }

    const returnUserLoanBookModal = () => 
    {
        handleOpen(<LoanBookConfirmationModal qrCodeData={qrCodeData} _id={_id} bookname={bookname} author={author} language={language}
        genre={genre} description={description} imageUrl={imageUrl} tabValue={1} />);
    }

    const bookData = 
    [
        {label: "Username", value: handleScanData().username},
        {label: "Bookname", value: bookname},
        {label: "Author", value: author},
        {label: "Language", value: language},
        {label: "Genre", value: genre}
    ]
    
    return(
        <ModalTemplate title={"Loan Book Modal"} width="600px" cancelButtonName={"No"} cancelButtonEvent={() => returnUserLoanBookModal()}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Loan Book Confirmation</Typography>
                    <Box sx={displayAsRow}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Avatar src={imageUrl} alt="Preview" variant="rounded" sx={BookImageFormat}/>
                        </Box>

                        <Box sx={{...displayAsColumn, margin: '10px 0 0 20px', gap:"20px 50px"}}>
                        {
                            bookData.map((data, index) => 
                                (
                                    <Typography key={index}>{data.label}: {data.value}</Typography>
                                )
                            )
                        }
                        
                        <ExpandableTypography title={"Description"}>{description}</ExpandableTypography>
                     </Box>
                 </Box>
            </Box>
            <Button variant='contained' onClick={ConfirmLoanBook}>Yes</Button>
        </ModalTemplate>
    )
}

export default UserLoanBookConfirmationModal