import { Box, TextField, Typography } from "@mui/material"
import { displayAsRow } from "../../../../../../Data/Style"
import { FC } from "react"
import { UserLoanBookModalBodyInterface } from "../../../../../../Model/ModelForModal"

const UserLoanModalBody:FC<UserLoanBookModalBodyInterface> = (SelfLoanBookData) => 
{
    const {qrCodeData, bookname, onChange } = SelfLoanBookData;

    return(
        <Box sx={{ display: 'grid', gap: '10px', gridTemplateRows: '50px 50px' }}>

            <Typography>Bookname: {bookname}</Typography>

            <Box sx={{...displayAsRow, alignItems: 'center' }}>
                <Typography>QRCode Data:</Typography>
                <TextField sx={{ paddingLeft: '10px' }} size="small" name="QRCodeData" type={'password'} value={qrCodeData} onChange={onChange} />
            </Box>
        </Box>
    )
}

export default UserLoanModalBody