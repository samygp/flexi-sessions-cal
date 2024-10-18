import { useCallback, useMemo, useState } from "react";
import RefreshDialog from './login/RefreshDialog';
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SxProps, Toolbar, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSessionContext } from "../hooks/useCustomContext";
import { CalendarIcon } from "@mui/x-date-pickers";
import Face5Icon from '@mui/icons-material/Face5';
import { Biotech, Cake, Class, MenuBook, Snowshoeing, SportsKabaddi } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPath, PathName } from "../shared/models/Routes";

// ******** STYLES ********

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 240,
        boxSizing: 'border-box',
    },
}));

const CenteredItemsDiv = styled('div')(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    flexDirection: "row",
    gap: theme.spacing(0.7),
}));

// ******** INTERFACES ********

interface IDrawerDividerProps {
    icon: JSX.Element;
    text: string;
}

interface IDrawerProps {
    open?: boolean;
    onClick: () => void;
}

interface IHeaderMenuItemProps {
    text: string;
    icon: JSX.Element;
    onClick?: () => void;
}

// ******** COMPONENTS ********
function DrawerButton({ onClick, open }: IDrawerProps) {
    const sx = useMemo<SxProps>(() => [{ mr: 2 }, open ? { display: 'none' } : {}], [open]);
    return (
        <IconButton aria-label="open drawer" edge="start"{...{ onClick, sx }}>
            <MenuIcon />
        </IconButton>
    );
}


function DrawerDivider({ icon, text }: IDrawerDividerProps) {
    return (
        <Divider>
            <CenteredItemsDiv>
                {icon}
                <Typography variant="body1" display={"inline-flex"}>{text}</Typography>
            </CenteredItemsDiv>
        </Divider>
    );
};

function HeaderMenuItem({ text, icon, onClick }: IHeaderMenuItemProps) {
    return (
        <ListItem disablePadding onClick={onClick}>
            <ListItemButton >
                <ListItemIcon sx={{ minWidth: 35 }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
}

function HeaderDrawer({ onClick, open }: IDrawerProps) {
    const theme = useTheme();
    const navigate = useNavigate();
    const onCalendarClick = useCallback(() => navigate(getPath(PathName.calendar)), [navigate]);
    const onMonkehClick = useCallback(() => navigate(getPath(PathName.monkeh)), [navigate]);
    
    return (
        <StyledDrawer variant="persistent" anchor="left" open={open}>
            <DrawerHeader>
                <IconButton onClick={onClick}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <DrawerDivider icon={<MenuBook />} text="Sesiones" />
            <List>
                <HeaderMenuItem text="Calendario" icon={<CalendarIcon />} onClick={onCalendarClick} />
                <HeaderMenuItem text="Bibliográficas" icon={<Class />} onClick={onCalendarClick} />
                <HeaderMenuItem text="Clínicas" icon={<Biotech />} onClick={onCalendarClick} />
            </List>
            <DrawerDivider icon={<Face5Icon />} text="Monkehs" />
            <List>
                <HeaderMenuItem text="All Monkehs" icon={<SportsKabaddi />} onClick={onMonkehClick} />
                <HeaderMenuItem text="One Monkeh" icon={<Snowshoeing />} onClick={onMonkehClick}/>
                <HeaderMenuItem text="Cumpleaños" icon={<Cake />} onClick={onMonkehClick}/>
            </List>
        </StyledDrawer>
    );
}


export default function Header() {
    const { isAuthenticated, logout } = useSessionContext();
    const onLogoutClick = useCallback((e: any) => {
        e.preventDefault();
        if (window.confirm("logout?")) logout();
    }, [logout]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const onDrawerButtonClick = useCallback(() => setDrawerOpen(prev => !prev), [setDrawerOpen]);

    return (
        <Box sx={{ display: isAuthenticated ? 'flex' : 'none' }}>
            <AppBar position="static" color="transparent" >
                <RefreshDialog />
                <Toolbar>
                    {<DrawerButton onClick={onDrawerButtonClick} open={drawerOpen} />}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Calendarios medicosos
                    </Typography>
                    {isAuthenticated && <Button variant="contained" onClick={onLogoutClick}>Logout</Button>}
                </Toolbar>
            </AppBar >
            <HeaderDrawer open={drawerOpen} onClick={onDrawerButtonClick} />
        </Box>
    );
}