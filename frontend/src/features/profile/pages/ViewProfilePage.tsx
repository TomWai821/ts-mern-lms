"use client";
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material'
import { useModal } from '../../../Context/ModalContext';
import { useAuthContext } from '../../../Context/User/AuthContext';
import { PageItemToCenter, PageTitleSyntax, displayAsColumn, ViewProfileButton } from '../../../Data/Style';
import { ViewProfileField } from '../../../Data/TextFieldsData';
import { ViewProfileModel } from '../../../Model/InputFieldModel';

import DisplayQRCodeModal from '../components/modals/DisplayQRCodeModal';
import EditProfileDataModal from '../components/modals/EditProfileDataModal';
import { useEffect } from 'react';
import { ChangePage } from '../../../Controller/OtherController';

const ViewProfilePage = () => 
{
    const { handleOpen } = useModal();
    const { isAuthLoading, isLoggedIn, user } = useAuthContext();

    const editUserData = () => 
    {
        handleOpen(<EditProfileDataModal/>);
    }

    const displayQRCode = () => 
    {
        handleOpen(<DisplayQRCodeModal/>)
    }

    useEffect(() => 
    {
        if(isAuthLoading) return;
    
        if(!isLoggedIn)
        {
            ChangePage('/');
        }
    },[isLoggedIn])

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
                                    <Typography sx={{ fontSize: '20px', textAlign: 'right' }}>{user?.[field.name as keyof ViewProfileModel] ?? ''}</Typography>
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