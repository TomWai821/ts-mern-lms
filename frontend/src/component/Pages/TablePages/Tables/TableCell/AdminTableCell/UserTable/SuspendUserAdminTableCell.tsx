import { FC } from "react";

import TableCell from "@mui/material/TableCell/TableCell";
import { Edit as EditIcon, LockOpen as LockOpenIcon } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { ImportantActionButtonSyntax } from "../../../../../../../Data/Style";
import { DetailsInterfaceForSuspend, UserResultDataInterface } from "../../../../../../../Model/ResultModel";
import { useModal } from "../../../../../../../Context/ModalContext";


import { StatusDetection } from "../../../../../../../Controller/OtherUsefulController";
import { ActionTableCellInterface } from "../../../../../../../Model/TablePagesAndModalModel";

import EditSuspendUserModal from "../../../../../../Modal/User/EditSuspendUserModal";
import UnsuspendUserActivityModal from "../../../../../../Modal/Confirmation/User/UnsuspendUserActivityModal";

const SuspendUserAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { value, Information } = tableCellData;
    const { handleOpen } = useModal();

    const userData = Information as UserResultDataInterface;
    
    const actionsForSuspendRecord = 
    [
        { 
            title: "Edit", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: () => OpenAnotherModal("EditSuspendData"), 
            icon: <EditIcon />, disable: StatusDetection(userData.suspendedDetails?.status as string, "Unsuspend") 
        },
        {
            title: "Unsuspend User", syntax: ImportantActionButtonSyntax, clickEvent: () => OpenAnotherModal("UnsuspendUser"), 
            icon: <LockOpenIcon />, disable: StatusDetection(userData.suspendedDetails?.status as string, "Unsuspend") 
        }
    ];

    const OpenAnotherModal = (type: string) =>
    {
        switch (type)
        {
            case "EditSuspendData":
                handleOpen(<EditSuspendUserModal value={value} editData={userData.suspendedDetails as DetailsInterfaceForSuspend}
                    compareData={userData.suspendedDetails as DetailsInterfaceForSuspend} />);
                break;

            case "UnsuspendUser":
                handleOpen(<UnsuspendUserActivityModal _id={userData._id} data={userData} />);
                break;

            default:
                break;
        }
    }

    return (
        <TableCell sx={{ marginLeft: "20px" }}>
            {
                actionsForSuspendRecord.map((action, index) => (
                    <Tooltip title={action.title} key={index} arrow>
                        <IconButton sx={action.syntax} onClick={action.clickEvent} disabled={action.disable}>
                            {action.icon}
                        </IconButton>
                    </Tooltip>
                ))
            }
        </TableCell>
    );
}

export default SuspendUserAdminTableCell;