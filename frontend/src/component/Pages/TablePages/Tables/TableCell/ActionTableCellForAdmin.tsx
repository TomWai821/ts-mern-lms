import { FC } from "react";

import { ActionTableCellInterface } from "../../../../../Model/TablePagesAndModalModel";
import BookPageAdminTableCell from "./AdminTableCell/BookPageAdminTableCell";
import ContactPageAdminTableCell from "./AdminTableCell/ContactPageAdminTableCell";
import UserPageAdminTableCell from "./AdminTableCell/UserPageAdminTableCell";

const ActionTableCellForAdmin: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { TableName } = tableCellData;

    switch (TableName)
    {
        case "Book":
            return <BookPageAdminTableCell {...tableCellData} />;

        case "Contact":
            return <ContactPageAdminTableCell {...tableCellData} />;

        case "User":
            return <UserPageAdminTableCell {...tableCellData} />;

        default:
            return null;
    }
};

export default ActionTableCellForAdmin;