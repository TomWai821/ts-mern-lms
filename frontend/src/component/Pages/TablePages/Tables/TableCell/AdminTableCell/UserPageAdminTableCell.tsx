import { FC } from "react";
import { ActionTableCellInterface } from "../../../../../../Model/TablePagesAndModalModel";
import SuspendUserAdminTableCell from "./UserTable/SuspendUserAdminTableCell";
import UserRecordAdminTableCell from "./UserTable/UserRecordAdminTableCell";

const UserPageAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { value } = tableCellData;

    if (value === 1)
    {
        return <SuspendUserAdminTableCell {...tableCellData} />;
    }

    return <UserRecordAdminTableCell {...tableCellData} />;
};

export default UserPageAdminTableCell;
