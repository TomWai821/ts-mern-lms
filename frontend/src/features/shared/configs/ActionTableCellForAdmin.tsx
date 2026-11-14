import { FC, ReactElement } from "react";

import { ActionTableCellInterface } from "../../../Model/TablePagesAndModalModel";

import ContactPageAdminTableCell from "../../contact/components/adminTableCells/ContactPageAdminTableCell";
import BookPageAdminTableCell from "../../book/components/adminTableCells/BookPageAdminTableCell";
import UserPageAdminTableCell from "../../user/components/adminTableCells/UserPageAdminTableCell";

export type tableNameType = "Book" | "Contact" | "User";

const ActionTableCellForAdmin: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { TableName } = tableCellData;

    const AdminActionTableCellConfig: Record<tableNameType, ReactElement> =
    {
        Book: <BookPageAdminTableCell {...tableCellData} />,
        Contact: <ContactPageAdminTableCell {...tableCellData} />,
        User: <UserPageAdminTableCell {...tableCellData} />
    }

    return AdminActionTableCellConfig[TableName as keyof typeof AdminActionTableCellConfig];
};

export default ActionTableCellForAdmin;