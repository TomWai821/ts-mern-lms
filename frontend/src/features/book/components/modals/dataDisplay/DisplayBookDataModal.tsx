"use client";

import { FC } from "react";
import { Box } from "@mui/material";

import ModalTemplate from "../../../../../component/Templates/ModalTemplate";

import { DisplayDataModalInterface } from "../../../../../Model/ModelForModal";

import { ModalBodySyntax } from '../../../../../Data/Style';
import AllBookDataBody from "./DisplayBookDataBody/AllBookDataBody";
import LoanBookDataBody from "./DisplayBookDataBody/LoanBookDataBody";
import { BookDataInterface } from "../../../../../Model/ResultModel";

const DisplayBookDataModal:FC<DisplayDataModalInterface> = (displayUserData) => 
{
    const {value, data} = displayUserData;
    const width = '600px';

    const setTitle = () => 
    {
        let displayData = {title:"", displayBody:<></>}
        switch(value)
        {
            case 0:
                displayData.title = "Book Information";
                displayData.displayBody = <AllBookDataBody data={data as BookDataInterface}/>
                break;

            case 1:
                displayData.title = "Loan Book Information";
                displayData.displayBody = <LoanBookDataBody data={data as BookDataInterface}/>
                break;

        }
        return displayData;
    }

    return(
        <ModalTemplate title={setTitle().title as string} width={width} cancelButtonName={"Exit"} >
            <Box id="modal-description" sx={ModalBodySyntax}>
                {setTitle().displayBody}
            </Box>
        </ModalTemplate>
    );
}

export default DisplayBookDataModal;