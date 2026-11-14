"use client";
import { Box,  Menu, Typography } from "@mui/material"

import { FC } from "react";
import { NavMenuInterface } from "../../Model/NavModel";
import { externalUserPage, adminPage, userPage } from "../../Data/MenuData";
import CustomMenuItem from "../UIFragment/CustomMenuItem";
import { useAuthContext } from "../../Context/User/AuthContext";

const NavMenu:FC<NavMenuInterface> = ({AvatarSize, anchorElNav, handleNavMenu, NavSyntax}) => 
{
    const {isLoggedIn, isAdmin} = useAuthContext(); 
    const SetNavName = isAdmin ? "Manage" : "View";

    return(
        <Box sx={{ flexGrow: 1 }}>
            <Typography onClick={handleNavMenu} width={'60px'} sx={{ fontSize: 24, ml: '20px', '&:hover': { cursor: 'pointer', color: NavSyntax.color } }}>
            {SetNavName}
            </Typography>
                <Menu
                    sx={{ mt: AvatarSize }}
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={Boolean(anchorElNav)}
                    onClose={handleNavMenu}
                >
                {
                    !isLoggedIn ? <CustomMenuItem pages={externalUserPage}/> : (isAdmin ? <CustomMenuItem pages={adminPage}/> : <CustomMenuItem pages={userPage}/>)
                }
                </Menu>
        </Box>
    )
}

export default NavMenu