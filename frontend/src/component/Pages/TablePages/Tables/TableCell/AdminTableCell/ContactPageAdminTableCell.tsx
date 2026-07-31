import { FC } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { ImportantActionButtonSyntax } from "../../../../../../Data/Style";
import { ActionTableCellInterface } from "../../../../../../Model/TablePagesAndModalModel";
import { ContactInterface } from "../../../../../../Model/ResultModel";
import { useModal } from "../../../../../../Context/ModalContext";


import DeleteContactConfirmModal from "../../../../../Modal/Confirmation/Contact/DeleteContactConfirmModal";
import EditContactModal from "../../../../../Modal/Contact/EditContactModal";

const ContactPageAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
   const { handleOpen } = useModal();
   const { value, Information } = tableCellData;
   const contactData = Information as ContactInterface;

   const openEditModal = () =>
   {
      handleOpen(<EditContactModal value={value} editData={contactData} compareData={contactData} />);
   };

   const openDeleteContactModal = () =>
   {
      handleOpen(<DeleteContactConfirmModal value={value} _id={contactData._id} data={contactData} />);
   };

   const actionsToRender = value === 1 ? 
   [
      { title: "Edit", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: openEditModal, icon: <EditIcon /> },
      { title: "Delete Publisher", syntax: ImportantActionButtonSyntax, clickEvent: openDeleteContactModal, icon: <DeleteIcon /> },
   ]
   : 
   [
      { title: "Edit", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: openEditModal, icon: <EditIcon /> },
      { title: "Delete Author", syntax: ImportantActionButtonSyntax, clickEvent: openDeleteContactModal, icon: <DeleteIcon /> },
   ];

    return (
        <TableCell sx={{ marginLeft: "20px" }}>
            {
               actionsToRender.map((action, index) => 
               (
                  <Tooltip title={action.title} key={index} arrow>
                     <IconButton sx={action.syntax} onClick={action.clickEvent}>
                           {action.icon}
                     </IconButton>
                  </Tooltip>
               ))
            }
        </TableCell>
    );
};

export default ContactPageAdminTableCell;
