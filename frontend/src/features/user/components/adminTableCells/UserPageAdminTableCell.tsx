import { FC } from "react";

import SuspendUserAdminTableCell from "./SuspendUserAdminTableCell";
import UserRecordAdminTableCell from "./UserRecordAdminTableCell";
import { ActionTableCellInterface } from "../../../../Model/TablePagesAndModalModel";

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
