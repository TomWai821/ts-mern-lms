import { Box, Typography } from "@mui/material";
import QRCode from "react-qr-code";

import ModalTemplate from "../../../../component/Templates/ModalTemplate";
import { ModalBodySyntax } from "../../../../Data/Style";
import { GetCurrentUserController } from "../../../../Controller/UserController/UserGetController";

export interface QRCodeInterface
{
    success: boolean;
    data: 
    { 
        userId: string,
        username: string,
        type: "library-member"
    }
}

export interface QRCodePayload 
{
    userId: string;
    username: string;
    type: "library-member";
}

const getQRCodeData = async () => 
{
    const response = await GetCurrentUserController("QRCode");
    const result = await response?.json() as QRCodeInterface;
    
    return result.data;
}

const DisplayQRCodeModal = () => 
{

    return(
        <ModalTemplate title={"Display QR Code"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={{...ModalBodySyntax, justifyContent: 'center', alignContent: 'center', textAlign: 'center'}}>
                <Typography sx={{fontSize: '24px', fontweight: 'bold', paddingBottom: '25px'}}>Scan To Loan Book</Typography>
                <QRCode value={JSON.stringify(getQRCodeData())}/>
            </Box>
        </ModalTemplate>
    );
}

export default DisplayQRCodeModal