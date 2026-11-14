"use client";
import { FC } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

// Context
import { useModal } from "../../Context/ModalContext";

// Models
import { ModalTemplateProps } from "../../Model/ContextAndProviderModel";

// Data(CSS Syntax)
import { ModalSyntax, ModalTitleSyntax } from "../../Data/Style";
import { widthSyntaxType } from "../../Model/OtherModel";

const ModalTemplate:FC <ModalTemplateProps> = (templateData) => 
{
    const {children, minWidth, maxWidth, width, title, cancelButtonName, cancelButtonEvent} = templateData;

    const {open, handleClose} = useModal();

    const widthSyntax = () => 
    {
        let WidthSyntax:widthSyntaxType = {};

        if(maxWidth)
        {
            WidthSyntax.maxWidth =  `${maxWidth}`;
        }

        if(minWidth)
        {
            WidthSyntax.minWidth = `${minWidth}`;
        }

        WidthSyntax.width = `${width}`;

        return WidthSyntax;
    }

    const ButtonEvent = () =>
    {
        cancelButtonEvent ? cancelButtonEvent() : handleClose();
    }
    
    return(
        <Modal open={open} onClose={handleClose} >
            <Box sx={{...ModalSyntax, ...widthSyntax()}}>
                <Typography id="modal-title" sx={ModalTitleSyntax}>{title}</Typography>
                    {children}
                <Button onClick={ButtonEvent}>{cancelButtonName}</Button>
            </Box>
        </Modal>
    );
}

export default ModalTemplate