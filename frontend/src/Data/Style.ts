import { NavSyntaxInterface } from "../Model/NavModel";

// For View Profile Button
const ViewProfileButton = {width: '75%', marginTop: '15px'};

// For all button font color
const buttonFontColor = "white";

// FOr all Delete Button
const DeleteButton = {color: buttonFontColor, backgroundColor: 'rgb(230, 0, 0)', '&:hover': {backgroundColor: 'rgb(210, 0, 0)'}}

// For all items/tables
const flex =  { display: 'flex' };

const ItemToCenter = { ...flex, justifyContent: 'center' };

const displayAsRow = { ...flex, flexDirection: 'row' };

const displayAsColumn = {...flex, flexDirection: 'column'};

const PageItemToCenter = {...ItemToCenter, marginTop: 5};

// Navbar syntax
const NavColor = { background: "#00796B", word: buttonFontColor, wordHover: "#B2DFDB" };
const NavButtonTransition = "color 1s, background-color 1s";

const NavSyntax: NavSyntaxInterface = { fontSize: 24, transition: NavButtonTransition, bgcolor: NavColor.background, color: buttonFontColor, '&:hover': { color: NavColor.wordHover } };
const MenuItemSyntax = { margin: 0, padding: 0 };

// For Avatar in Navbar
const AvatarSize = "42px";

// For all page title
const PageTitleSyntax = { fontSize: '32px', marginBottom: '3px' }

// For modal
const ModalSyntax = 
{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '20px',
    borderRadius: '16px',
    BorderStyle: 'none'
};

const ModalTitleSyntax = 
{ 
    fontSize: '24px', 
    marginBottom: '5px' 
}

const ModalRemarkSyntax = 
{
    fontWeight: 'bold'
}

const ModalSubTitleSyntax = 
{
    fontSize: '18px',
    ...ModalRemarkSyntax
}

const ModalBodySyntax = 
{
    padding: '15px 10px 30px 10px',
    display: 'grid', 
    gap:"20px 50px"
}

// For Action Table Cell
const ImportantActionButtonSyntax = { color: 'red', "&:hover": { color: DeleteButton.backgroundColor, backgroundColor: 'lightGray' } };

const BookImageFormat = { minHeight: '225px', maxHeight: '350px', width: '225px', height: '100%', objectFit: 'contain' };

const BookImageFormatForEdit = { width: '250px', height: '350px', borderRadius: '10px' };

const BookDescriptionDisplayFormat = { display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'normal',  wordWrap: 'break-word', maxWidth: '100%', textOverflow: 'ellipsis'};

const optionFieldSlotProps = {select: { MenuProps: { PaperProps: { sx: { maxHeight: 'clamp(300px, 50vh, 500px)', overflowY: 'auto' }}}}};


export {ViewProfileButton, buttonFontColor, DeleteButton, ItemToCenter, displayAsRow, displayAsColumn, PageItemToCenter, NavColor, NavButtonTransition, NavSyntax, AvatarSize, MenuItemSyntax, PageTitleSyntax, ModalTitleSyntax, ModalSubTitleSyntax, ModalSyntax, ModalRemarkSyntax, ModalBodySyntax, ImportantActionButtonSyntax, BookImageFormat, BookImageFormatForEdit, BookDescriptionDisplayFormat, optionFieldSlotProps}