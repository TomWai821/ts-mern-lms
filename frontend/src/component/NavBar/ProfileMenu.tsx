"use client";
import { FC } from 'react';
import { Avatar, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material"
import { ProfileMenuInterface } from '../../Model/NavModel';
import { settings } from '../../Data/MenuData';
import { useAuthContext } from '../../Context/User/AuthContext';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const ProfileMenu:FC<ProfileMenuInterface> = (navData) => 
{
    const { user, isLoggedIn, handleLogout } = useAuthContext();
    const { AvatarSize, anchorElUser, handleUserMenu, NavSyntax, MenuItemSyntax } = navData;

    return(
        isLoggedIn ?
        <Box>
            <IconButton onClick={handleUserMenu}>
                <Avatar src={""} sx={{ width: AvatarSize, height: AvatarSize }} />
            </IconButton>
            <Menu
                sx={{ mt: AvatarSize }}
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleUserMenu}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', padding: '10px 0 10px 0' }}>
                    <Avatar alt="" src={""} sx={{ width: AvatarSize, height: AvatarSize, margin: '0 5px 0 10px' }} />
                    <Box sx={{ display: 'block', flexDirection: 'column', marginRight: '20%' }}>
                        <Typography sx={{ fontWeight: 'bold'}}>{user?.username}</Typography>
                        <Typography>{user?.role}</Typography>
                    </Box>
                </Box>
                
                <Divider/>

                {settings.map((setting) => (
                    <MenuItem key={setting.label} onClick={(event: React.MouseEvent<HTMLElement>) => { handleUserMenu(event); setting.clickEvent(); }} sx={{ MenuItemSyntax, NavSyntax }}>
                        <ListItemIcon>
                            {setting.icon}
                        </ListItemIcon>
                        <Typography width={'100%'}>{setting.label}</Typography>
                    </MenuItem>
                ))}
                
                <MenuItem onClick={(event: React.MouseEvent<HTMLElement>) => { handleUserMenu(event); handleLogout(); }} sx={{ MenuItemSyntax, NavSyntax }}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <Typography width={'100%'}>Logout</Typography>
                    </MenuItem>
            </Menu>
        </Box>
        :
        <Box>
            <Button sx={{ ...NavSyntax, mr: '30px' }} href="./login">Login</Button>
            <Button sx={NavSyntax} href="./register">Register</Button>
        </Box>
    )
}

export default ProfileMenu