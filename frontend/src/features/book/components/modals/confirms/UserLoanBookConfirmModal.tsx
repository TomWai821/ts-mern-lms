import { FC } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

import { BookImageFormat, displayAsColumn, displayAsRow, ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";

import { useModal } from "../../../../../Context/ModalContext";

import { UserLoanBookModalBodyInterface } from "../../../../../Model/ModelForModal";

import LoanBookConfirmationModal from "./LoanBookConfirmationModal";
import ExpandableTypography from "../../../../../component/UIFragment/ExpandableTypography";
import { useLoanBookAction } from "../../../../../hooks/actionhook/useLoanBookAction";
import { QRCodePayload } from "../../../../profile/components/modals/DisplayQRCodeModal";


const UserLoanBookConfirmationModal:FC<UserLoanBookModalBodyInterface> = (LoanBookData) => 
{
    const { qrCodeData, _id, bookname, author, language, genre, description, imageUrl } = LoanBookData;
    const { handleOpen } = useModal();
    const { LoanBookByLibrarian } = useLoanBookAction();

    const handleScanData = () =>
    {
        if(!qrCodeData)
        {
            return {username: "", userId: "", type: ""};
        }

        const parseData = JSON.parse(qrCodeData) as QRCodePayload;
        return {username: parseData.username, userId: parseData.userId, type: parseData.type}
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
            <Button variant='contained' onClick={() => LoanBookByLibrarian(_id, handleScanData().userId)}>Yes</Button>
        </ModalTemplate>
    )
}

export default UserLoanBookConfirmationModal