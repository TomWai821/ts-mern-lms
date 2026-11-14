"use client";
import React, { useState } from 'react';

import { AppBar, Box, Button, Toolbar } from '@mui/material';

import ProfileMenu from './ProfileMenu';
import NavMenu from './NavMenu';
import { NavColor, AvatarSize, NavSyntax, MenuItemSyntax } from '../../Data/Style';

const NavBar = () => 
{
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

    const navBarStyling = {bgcolor: NavColor.background, color: NavColor.word};

    const handleNavMenu = (event: React.MouseEvent<HTMLElement>) => 
    {
        setAnchorElNav(anchorElNav ? null : event?.currentTarget);
    };

    const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => 
    {
        setAnchorElUser(anchorElUser ? null : event?.currentTarget);
    };

    return (
        <AppBar position="static" sx={{ bgcolor: navBarStyling.bgcolor }}>
            <Toolbar>
                <Box>
                    <Button sx={{ fontSize: 32, marginRight: 3, bgcolor: navBarStyling.bgcolor, color: navBarStyling.color }} href="./">Library</Button>
                </Box>

                <NavMenu AvatarSize={AvatarSize} NavSyntax={NavSyntax} anchorElNav={anchorElNav} MenuItemSyntax={MenuItemSyntax} handleNavMenu={handleNavMenu}/>

                <ProfileMenu AvatarSize={AvatarSize} NavSyntax={NavSyntax}MenuItemSyntax={MenuItemSyntax} anchorElUser={anchorElUser} handleUserMenu={handleUserMenu}/>

            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
