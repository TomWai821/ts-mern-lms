import { FC } from "react";
import { Box } from "@mui/material";

import ModalTemplate from "../../Templates/ModalTemplate";

import { DisplayDataModalInterface } from "../../../Model/ModelForModal";

// Another Component
import AllUserDataBody from "./DisplayUserDataBody/AllUserDataBody";
import BannedUserDataBody from "./DisplayUserDataBody/BannedUserDataBody";

// Models
import { UserResultDataInterface } from "../../../Model/ResultModel";

import { ModalBodySyntax } from "../../../ArraysAndObjects/Style";


const DisplayUserDataModal:FC<DisplayDataModalInterface> = (displayUserData) => 
{
    const {value, data} = displayUserData;

    const setTitle = () => 
    {
        let displayData = {title:"", displayBody:<></>}
        switch(value)
        {
            case 0:
                displayData.title = "User Information";
                displayData.displayBody = <AllUserDataBody data={data as UserResultDataInterface}/>;
                break;

            case 1:
                displayData.title = "Suspend User Information";
                displayData.displayBody = <BannedUserDataBody data={data as UserResultDataInterface}/>;
                break;
        }
        return displayData;
    }

    return(
        <ModalTemplate title={setTitle().title as string} width="400px" cancelButtonName={"Exit"} >
            <Box id="modal-description" sx={ModalBodySyntax}>
                {setTitle().displayBody}
            </Box>
        </ModalTemplate>
    );
}

export default DisplayUserDataModal;