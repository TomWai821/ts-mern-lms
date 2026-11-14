import { FC } from 'react'
import { Box, Button,  Typography} from '@mui/material';

// Template
import ModalTemplate from '../../../../../component/Templates/ModalTemplate';
import DeleteTypography from '../../../../../component/UIFragment/DeleteTypography';

// Model
import { BookDataInterfaceForDelete } from '../../../../../Model/BookTableModel';

// Data (CSS Syntax)
import { DeleteButton, ModalBodySyntax, ModalSubTitleSyntax } from '../../../../../Data/Style';
import { useBookAction } from '../../../../../hooks/actionhook/useBookAction';


const DeleteBookModal:FC<BookDataInterfaceForDelete> = ({...bookData}) => 
{  
    const { bookID, bookname, language, genre, author, publisher } = bookData;
    const {DeleteBook} = useBookAction();

    const fieldData = 
    [   
        {label:"BookName", data: bookname},
        {label:"Language", data: language},
        {label:"Genre", data: genre},
        {label:"Author", data: author},
        {label:"Publisher", data: publisher},
    ]
        
    return(
        <ModalTemplate title={"Delete Book Record Confirmation"} width="400px" cancelButtonName="No">
            <Box id="modal-description" sx={ModalBodySyntax}>
                <Typography sx={ModalSubTitleSyntax}>Do you want to delete this book record?</Typography>
                {
                    fieldData.map((field, index) => 
                        (
                            <Typography key={index}>{field.label}: {field.data}</Typography>
                        )
                    )
                }
            </Box>

            <DeleteTypography/>
            <Button variant='contained' sx={{...DeleteButton}} onClick={() => DeleteBook(bookID)}>Yes</Button>
              
        </ModalTemplate>
    );
}

export default DeleteBookModal;