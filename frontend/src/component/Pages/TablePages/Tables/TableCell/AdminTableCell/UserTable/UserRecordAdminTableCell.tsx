import { FC } from "react";

import { IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Block as BlockIcon, Search as SearchIcon } from "@mui/icons-material";
import TableCell from "@mui/material/TableCell/TableCell";

import { ImportantActionButtonSyntax } from "../../../../../../../Data/Style";

import { useUserContext } from "../../../../../../../Context/User/UserContext";
import { useModal } from "../../../../../../../Context/ModalContext";

import { StatusDetection } from "../../../../../../../Controller/OtherUsefulController";
import DeleteUserConfirmModal from "../../../../../../Modal/Confirmation/User/DeleteUserConfirmModal";

import { UserResultDataInterface } from "../../../../../../../Model/ResultModel";
import { ActionTableCellInterface } from "../../../../../../../Model/TablePagesAndModalModel";
import SuspendUserModal from "../../../../../../Modal/User/SuspendUserModal";
import EditUserModal from "../../../../../../Modal/User/EditUserModal";

const UserRecordAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { value, Information, changeValue, setSearchUserData, searchUserData } = tableCellData;
    const { fetchUser } = useUserContext();
    const { handleOpen } = useModal();

    const userData = Information as UserResultDataInterface;

    const actionsForUserRecord = 
    [
        { 
            title: "Edit", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: () => OpenEditModal(), 
            icon: <EditIcon /> 
        },
        { 
            title: "View Suspend History", syntax: { "&:hover": { backgroundColor: "lightGray" } }, clickEvent: () => viewSuspendRecord(), 
            icon: <SearchIcon /> 
        },
        { 
            title: "Suspend User", syntax: ImportantActionButtonSyntax, clickEvent: () => OpenAnotherModal("Suspend"), icon: <BlockIcon />, 
            disable: StatusDetection(userData.status, "Suspend") 
        },
        { 
            title: "Delete User", syntax: ImportantActionButtonSyntax, clickEvent: () => OpenAnotherModal("DeleteUser"), icon: <DeleteIcon />, 
            disable: StatusDetection(userData.status, "Suspend") 
        },
    ];

    const OpenEditModal = () =>
    {
        handleOpen(<EditUserModal value={value} editData={userData} compareData={userData} />);
    };

    const viewSuspendRecord = () =>
    {
        if (changeValue && setSearchUserData)
        {
            fetchUser("SuspendUser", { username: userData.username, role: "", status: "", gender: "" });
            changeValue("Tab", 1);
            const currentSearchUserData = searchUserData ?? { username: "", role: "", status: "", gender: "" };
            setSearchUserData({ ...currentSearchUserData, username: userData.username });
        }
    };

    const OpenAnotherModal = (type: string) =>
    {
        switch (type)
        {
            case "Suspend":
                handleOpen(<SuspendUserModal {...userData} />);
                break;

            case "DeleteUser":
                handleOpen(<DeleteUserConfirmModal value={value} _id={userData._id} data={userData} />);
                break;
                
            default:
                break;
        }
    }

    return (
        <TableCell sx={{ marginLeft: "20px" }}>
            {
                actionsForUserRecord.map((action, index) => (
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

export default UserRecordAdminTableCell;