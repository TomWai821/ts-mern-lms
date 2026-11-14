import { FC, ReactElement } from "react";
import { TableCell } from "@mui/material";

// Another Modal
import DisplayUserDataModal from "../../features/user/components/modals/actions/DisplayUserDataModal";

// Context
import { useModal } from "../../Context/ModalContext";

// Models
import { ContentTableCellProps } from "../../Model/ContextAndProviderModel";
import { BookDataInterface, UserResultDataInterface } from "../../Model/ResultModel";
import DisplayBookDataModal from "../../features/book/components/modals/dataDisplay/DisplayBookDataModal";

const ContentTableCell:FC<ContentTableCellProps> = (contentTableCellData) => 
{
    const {children, TableName, value, textColor, Information} = contentTableCellData;
    const {handleOpen} = useModal();
    
    const onClick = () => 
    {
        const ModalMap:Record<string, ReactElement> =
        {
            "User": <DisplayUserDataModal value={value} data={Information as UserResultDataInterface} />,
            "Book": <DisplayBookDataModal position={"Table"} value={value} data={Information as BookDataInterface}/>
        }

        if(!ModalMap[TableName])
        {
            console.log(`Modal with type ${TableName} are not created`)
            return;
        }

        handleOpen(ModalMap[TableName])
    }
    
    return(
        <TableCell sx={{ fontSize: '16px', color: textColor , "&:hover": {cursor: "pointer"}}} onClick={onClick}>
            {children}
        </TableCell>
    );
}

export default ContentTableCell