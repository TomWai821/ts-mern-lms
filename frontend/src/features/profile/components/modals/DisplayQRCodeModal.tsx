import { Box, Typography } from "@mui/material";
import QRCode from "react-qr-code";

import ModalTemplate from "../../../../component/Templates/ModalTemplate";
import { ModalBodySyntax } from "../../../../Data/Style";
import { GetCurrentUserController } from "../../../../Controller/UserController/UserGetController";
import { useEffect, useState } from "react";

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

const DisplayQRCodeModal = () => 
{
    const [qrCodePayload, setQrCodePayload] = useState<QRCodePayload | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        let cancelled = false;

        const loadQRCode = async () => 
        {
            try 
            {
                const response = await GetCurrentUserController("QRCode");

                if (!response?.ok) 
                {
                    throw new Error("QR code request failed");
                }

                const result = await response.json() as QRCodeInterface;

                if (!result.success || !result.data?.userId) 
                {
                    throw new Error("QR code data is unavailable");
                }

                if (!cancelled) setQrCodePayload(result.data);
            }
            catch (err) 
            {
                console.error("Failed to load member QR code:", err);
                if (!cancelled) setError("Member QR code is unavailable");
            } 
            finally 
            {
                if (!cancelled) setLoading(false);
            }
        };

        void loadQRCode();
        return () => { cancelled = true; };
    }, []);

    return(
        <ModalTemplate title={"Display QR Code"} width="400px" cancelButtonName={"Exit"}>
            <Box id="modal-description" sx={{...ModalBodySyntax, justifyContent: 'center', alignContent: 'center', textAlign: 'center'}}>
                <Typography sx={{fontSize: '24px', fontweight: 'bold', paddingBottom: '25px'}}>Scan To Loan Book</Typography>
                {loading ? 
                    (<Typography>Loading QR code...</Typography>) 
                    : 
                    qrCodePayload ? 
                    (<QRCode value={JSON.stringify(qrCodePayload)} />) 
                    : 
                    (<Typography role="alert">{error ?? "Member QR code is unavailable"}</Typography>)}
            </Box>
        </ModalTemplate>
    );
}

export default DisplayQRCodeModal