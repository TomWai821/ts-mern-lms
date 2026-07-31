import { FC } from "react";

import { ActionTableCellInterface } from "../../../../../../Model/TablePagesAndModalModel";
import BookAdminTableCell from "./BookTable/BookAdminTableCell";
import LoanBookAdminTableCell from "./BookTable/LoanBookAdminTableCell";

const BookPageAdminTableCell: FC<ActionTableCellInterface> = (tableCellData) =>
{
    const { value } = tableCellData;

    if (value === 1)
    {
        return <LoanBookAdminTableCell {...tableCellData} />;
    }

    return <BookAdminTableCell {...tableCellData} />;
};

export default BookPageAdminTableCell