import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material'

// Context
import { useModal } from '../../Context/ModalContext'

// Models
import { ViewProfileModel } from '../../Model/InputFieldModel'

// Data(CSS Syntax)
import { displayAsColumn, PageItemToCenter, PageTitleSyntax, ViewProfileButton } from '../../Data/Style';
import { ViewProfileField } from '../../Data/TextFieldsData';
import DisplayQRCodeModal from '../Modal/DisplayQRCodeModal'
import EditProfileDataModal from '../Modal/EditProfileDataModal'
import { useAuthContext } from '../../Context/User/AuthContext'

const ViewProfilePage = () => 
{
    const {handleOpen} = useModal();
    const {GetData, Credentials} = useAuthContext();
    const authToken = GetData("authToken");

    const editUserData = () => 
    {
        handleOpen(<EditProfileDataModal/>);
    }

    const displayQRCode = () => 
    {
        handleOpen(<DisplayQRCodeModal username={Credentials.username} authToken={authToken as string}/>)
    }

    return (
        <Box sx={PageItemToCenter}>
            <Card variant='outlined' sx={{ width: '600px', borderRadius: '25px' }}>
                <CardContent sx={{ padding: '3%' }}>
                    <Typography sx={ PageTitleSyntax }>Profile</Typography>
                    <Box sx={{...displayAsColumn, padding: '0 5% 0 5%', alignItems: 'center'}}>
                        <Avatar sx={{width: '150px', height: '150px'}}></Avatar>
                        {
                            ViewProfileField.map((field, index) => 
                            (
                                <Box key={index} sx={{ display: 'grid', width: '100%', gridTemplateColumns: '1fr 1fr', padding: '20px 0 20px 0'}}>
                                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{field.label}</Typography>
                                    <Typography sx={{ fontSize: '20px', textAlign: 'right' }}>{Credentials[field.name as keyof ViewProfileModel]}</Typography>
                                </Box>
                            ))
                        }
                    </Box>

                    <Box sx={{...PageItemToCenter, flexDirection: 'column', alignItems: 'center', mt: ViewProfileButton.marginTop}}>
                        <Button variant='contained' sx={{...ViewProfileButton}} onClick={displayQRCode}>Display QR Code</Button>
                        <Button variant='contained' sx={{...ViewProfileButton}} onClick={editUserData}>Edit Data</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
};

export default ViewProfilePage;
