import { AppBar, Container, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CssBaseline from '@mui/material/CssBaseline';
import { MetaMaskAccountButton, TwitterAccountButton } from "./AccountButton";


type MccsBarProps = {
    title: string;
    children?: React.ReactNode;
};

export const MainLayout: React.FC<MccsBarProps> = ({ title, children }) => {

    return (
        <>
            <CssBaseline />
            <AppBar color="primary">
                <Toolbar variant="dense" sx={{ height: 52 }}>{/* variant="dense": バーを細くする */}
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>

                    <MetaMaskAccountButton />
                    <TwitterAccountButton />
                </Toolbar>
            </AppBar>

            <Container sx={{ marginTop: "52px" /* Toolbarの高さと合わせる */ }}>
                {children}
            </Container>
        </>
    );
}