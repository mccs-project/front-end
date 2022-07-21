import { ReactElement, useCallback, useState } from "react";
import { AppBar, Box, Container, Drawer, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DvrIcon from '@mui/icons-material/Dvr';

import { MetaMaskAccountButton, TwitterAccountButton } from "./AccountButton";

type MainPopupMenuProps = {
    children?: React.ReactNode;
};
const MainSideMenuIcon: React.FC<MainPopupMenuProps> = ({ children }) => {
    const navigation = useNavigate();
    const [state, setState] = useState<boolean>(false);
    const toggleDrawer = (open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            if (event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }

            setState(open);
        }
    ;


    const createMenuItems = useCallback(() => {

        const menuItems: { text: string, path: string, icon: ReactElement }[] = [
            { text: "Home", path: "/", icon: <HomeIcon /> },
            { text: "Eldorado", path: "/eldorado", icon: <DvrIcon /> },
            { text: "Shop", path: "/shop", icon: <StoreIcon /> },
        ];

        return (
            <Box
                sx={{ width: 200 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                {menuItems.map(menuItem => {
                    return (
                        <ListItem key={menuItem.text} disablePadding>
                            <ListItemButton onClick={()=>{ navigation(menuItem.path); }}>
                                <ListItemIcon>
                                    {menuItem.icon}
                                </ListItemIcon>
                                <ListItemText primary={menuItem.text} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </Box>

        );
    }, []);

    return (
        <>
            <IconButton onClick={toggleDrawer(true)}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor={"left"}
                open={state}
                onClose={toggleDrawer(false)}
            >
                {createMenuItems()}
            </Drawer>
        </>
    )
};

type MccsBarProps = {
    title: string;
    children?: React.ReactNode;
};

export const MainLayout: React.FC<MccsBarProps> = ({ title, children }) => {

    const toolbarHeight = 52;   //  本来はテーマから取得する
    return (
        <>
            {/* <CssBaseline /> */}
            <AppBar color="primary">
                <Toolbar variant="dense" disableGutters={true} sx={{ height: toolbarHeight, paddingLeft: "12px" }}>{/* variant="dense": バーを細くする */}
                    <MainSideMenuIcon />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>

                    <MetaMaskAccountButton />
                    <TwitterAccountButton />
                </Toolbar>
            </AppBar>

            <Container sx={{ marginTop: `${toolbarHeight}px` /* Toolbarの高さと合わせる */ }}>
                {children}
            </Container>
        </>
    );
}
