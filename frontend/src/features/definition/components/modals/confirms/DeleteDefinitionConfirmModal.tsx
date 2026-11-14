import { FC } from "react";
import { Box, Typography } from "@mui/material";

// Models
import { DeleteModalInterface } from "../../../../../Model/ModelForModal";
import { DefinitionInterface } from "../../../../../Model/ResultModel";

// UI Fragment
import ModalTemplate from "../../../../../component/Templates/ModalTemplate";
import ModalConfirmButton from "../../../../../component/UIFragment/ModalConfirmButton";
import DeleteTypography from "../../../../../component/UIFragment/DeleteTypography";

// Useful Object/Array Data
import { ModalBodySyntax, ModalSubTitleSyntax } from "../../../../../Data/Style";
import { useDefinitionAction } from "../../../../../hooks/actionhook/useDefinitionAction";

const DeleteDefinitionConfirmModal:FC<DeleteModalInterface> = (deleteData) =>
{
    const { type, data } = deleteData;

    const Data = data as DefinitionInterface;
    const { DeleteDefinition } = useDefinitionAction();

    const setTitle = () => 
    {
        let setTitle = {title: "", subTitle: ""};
        
        setTitle.title = `Delete ${type} Definition`;
        setTitle.subTitle = "Do you want to delete this definition?"

        return setTitle;
    }

    return( 
        <ModalTemplate title={setTitle().title} width="400px"  cancelButtonName={"No"}>
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>{setTitle().subTitle}</Typography>
                {
                    Data.genre ? <Typography>Genre: {Data.genre}</Typography> : <Typography>Langauge: {Data.language}</Typography>
                }
                <Typography>Short Name: {Data.shortName}</Typography>
            </Box>
            
            <DeleteTypography/>
            <ModalConfirmButton clickEvent={() => DeleteDefinition(type as string, data)} name={"Yes"} buttonType={"Important"}/>
        </ModalTemplate>
    );
}

export default DeleteDefinitionConfirmModal