import { ChangeEvent, FC, useContext, useState } from "react";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";

import { useModal } from "../../../../../Context/ModalContext";

import { LoanBookModalInterface } from "../../../../../Model/ModelForModal";

import { TabProps } from "../../../../../Controller/OtherUsefulController";
import { LoanBookModalTabLabel } from "../../../../../Data/TableData";

import CustomTabPanel from "../../../../../component/UIFragment/CustomTabPanel";
import SelfLoanConfirmationModalBody from "./ModalBody/SelfLoanConfirmationModalBody";
import UserLoanModalBody from "./ModalBody/UserLoanModalBody";
import UserLoanBookConfirmationModal from "./UserLoanBookConfirmModal";
import { useLoanBookAction } from "../../../../../hooks/actionhook/useLoanBookAction";
import { AlertContext } from "../../../../../Context/AlertContext";

const usePageConfigHandler = (tabValue: number) => 
{
    const setSubTitle = ["Do you want to loan this book?", "Please input QR Code Data"];
    const setCancelButtonName = ["No", "Exit"];
    const setConfirmButtonName = ["Yes", "Confirm"];

    const [TabValue, setTabValue] = useState<number>(tabValue);

    const changeTabValue = (event: React.SyntheticEvent, newValue: number) =>
    {
        setTabValue(newValue);
    }

    return {setSubTitle, setCancelButtonName, setConfirmButtonName, TabValue, changeTabValue}
}

const useQRCodeDataHandler = (qrCodeData: string | undefined) => 
{
    const [QrCodeData, setQrCodeData] = useState(qrCodeData ?? "");

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {value} = event.target;
        setQrCodeData(value);
    }

    return {QrCodeData, onChange};
}

const QRCodeDataValidation = (QRCodeData: string) => 
{
    try
    {
        const payload = JSON.parse(QRCodeData);

        const isValid =
            typeof payload.userId === "string" &&
            typeof payload.username === "string" &&
            payload.type === "library-member";

        return { isValid };
    }
    catch
    {
        return { isValid: false };
    }
}

const LoanBookConfirmationModal:FC<LoanBookModalInterface> = (LoanBookData) => 
{
    const { tabValue, qrCodeData, _id, bookname, author, language, genre, description, imageUrl } = LoanBookData;

    const { setSubTitle, setCancelButtonName, setConfirmButtonName, TabValue, changeTabValue } = usePageConfigHandler(tabValue as number);
    const { QrCodeData, onChange }  = useQRCodeDataHandler(qrCodeData);
    const { SelfLoanBook } = useLoanBookAction();
    const { handleOpen } = useModal();
    const alertContext = useContext(AlertContext);

    const handleConfirm = () =>
    {
        if (TabValue === 0)
        {
            void SelfLoanBook(_id);
            return;
        }

        if (TabValue === 1)
        {
            const { isValid } = QRCodeDataValidation(QrCodeData);

            if (!isValid)
            {
                alertContext?.setAlertConfig({ AlertType: "error", Message: "Please Input Valid QR Code" });
                return;
            }

            handleOpen(<UserLoanBookConfirmationModal qrCodeData={QrCodeData} _id={_id} bookname={bookname} author={author} language={language} genre={genre}
                description={description} imageUrl={imageUrl} tabValue={1}/>);
        }
    }

    return(
        <ModalTemplate title={"Loan Book Modal"} width="600px" cancelButtonName={setCancelButtonName[TabValue]}>
            <Tabs value={TabValue} onChange={changeTabValue} sx={{paddingBottom: '25px', width: '500px'}}>
                {
                    LoanBookModalTabLabel.map((tab, index) => 
                    (
                        <Tab key={index} label={tab.label} {...TabProps(index)}/>
                    ))
                }
            </Tabs>

            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{setSubTitle[TabValue]}</Typography>

                <CustomTabPanel index={TabValue} value={0}>
                    <SelfLoanConfirmationModalBody bookname={bookname} author={author} language={language} genre={genre} description={description} imageUrl={imageUrl} _id={_id}/>
                </CustomTabPanel>

                <CustomTabPanel index={TabValue} value={1}>
                    <UserLoanModalBody qrCodeData={QrCodeData} bookname={bookname} author={author} language={language} genre={genre} description={description} imageUrl={imageUrl} _id={_id} onChange={onChange}/>
                </CustomTabPanel>
               
            </Box>
            <Button variant='contained' sx={{ marginRight: '10px' }} 
                onClick={handleConfirm}
            >
                {setConfirmButtonName[TabValue]}
            </Button>
        </ModalTemplate>
    )
}

export default LoanBookConfirmationModal