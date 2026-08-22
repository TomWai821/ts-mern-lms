import { ChangeEvent, FC, useContext, useState } from "react";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import ModalTemplate from "../../../Templates/ModalTemplate";

import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../Data/Style";

import { useBookContext } from "../../../../Context/Book/BookContext";
import { useModal } from "../../../../Context/ModalContext";

import { LoanBookModalInterface } from "../../../../Model/ModelForModal";

import { TabProps } from "../../../../Controller/OtherUsefulController";
import { LoanBookModalTabLabel } from "../../../../Data/TableData";

import CustomTabPanel from "../../../UIFragment/CustomTabPanel";
import SelfLoanConfirmationModalBody from "./ModalBody/SelfLoanConfirmationModalBody";
import UserLoanModalBody from "./ModalBody/UserLoanModalBody";
import UserLoanBookConfirmationModal from "./UserLoanBookConfirmModal";
import { AlertContext } from "../../../../Context/AlertContext";
import { GetResultInterface } from "../../../../Model/ResultModel";

const LoanBookConfirmationModal:FC<LoanBookModalInterface> = (LoanBookData) => 
{
    const {tabValue, qrCodeData, _id, bookname, author, language, genre, description, imageUrl} = LoanBookData;
    const {loanBook} = useBookContext();
    const { handleOpen, handleClose} = useModal();
    const alertContext = useContext(AlertContext);

    const [QrCodeData, setQrCodeData] = useState(qrCodeData ?? "");
    const [TabValue, setTabValue] = useState<number>(tabValue as number);

    const LoanBook = () => 
    {
        TabValue === 0 ? ConfirmLoanBook() : confirmUserLoanbook();
    }

    const ConfirmLoanBook = async () =>     
    {
        const response: Response = await loanBook(_id);

         const result: GetResultInterface = await response.json();
                
        if (alertContext && alertContext.setAlertConfig) 
        {
            if(!response.ok)
            {
                alertContext.setAlertConfig({ AlertType: "error", Message: result.error as string });
                return;
            }
            alertContext.setAlertConfig({ AlertType: "success", Message: result.message as string });
            setTimeout(() => { handleClose() }, 2000);
        }
    }

    const confirmUserLoanbook = () => 
    {
        if (QrCodeData) 
        {
            handleOpen(<UserLoanBookConfirmationModal qrCodeData={QrCodeData} _id={_id} bookname={bookname} author={author} language={language} genre={genre} 
                description={description} imageUrl={imageUrl}tabValue={1}/>);
        }
    };

    const onChange = (event: ChangeEvent<HTMLInputElement>) => 
    {
        const {value} = event.target;
        setQrCodeData(value);
    }
    
    const changeTabValue = (event: React.SyntheticEvent, newValue: number) =>
    {
        setTabValue(newValue);
    }

    const setSubTitle = ["Do you want to loan this book?", "Please input userID"];
    const setCancelButtonName = ["No", "Exit"];
    const setConfirmButtonName = ["Yes", "Confirm"]

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
            <Button variant='contained' sx={{ marginRight: '10px' }} onClick={LoanBook}>{setConfirmButtonName[TabValue]}</Button>
        </ModalTemplate>
    )
}

export default LoanBookConfirmationModal