import { useCallback, useMemo, useState } from "react";
import RefreshDialog from './Modals/RefreshDialog';
import { AppBar, Box, Button, Drawer, IconButton, SxProps, Toolbar, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useSessionContext } from "../../hooks/useCustomContext";
import { CalendarIcon } from "@mui/x-date-pickers";
import Face5Icon from '@mui/icons-material/Face5';
import { Biotech, Cake, Class, MenuBook, SportsKabaddi } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getPath, PathName } from "../../shared/models/Routes";
import GenericList, { IListItemProps } from "../DataDisplay/Lists/GenericList";

// ******** INTERFACES ********

interface IDrawerProps {
    open?: boolean;
    onClick: () => void;
}

interface IHeaderListItem {
    icon?: JSX.Element;
    path: string;
}

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

// ******** DATA ********

const sessionsListItemMap: Record<string, IHeaderListItem> = Object.freeze({
    "Calendario": {
        icon: <CalendarIcon />,
        path: getPath(PathName.calendar),
    },
    "Bibliograficas": {
        icon: <Class />,
        path: getPath(PathName.calendar),
    },
    "Clínicas": {
        icon: <Biotech />,
        path: getPath(PathName.calendar),
    },
});

const monkehsListItemMap: Record<string, IHeaderListItem> = Object.freeze({
    "Todos los Monkehs": {
        icon: <SportsKabaddi />,
        path: getPath(PathName.monkeh),
    },
    "Cumpleaños": {
        icon: <Cake />,
        path: getPath(PathName.monkeh),
    },
});

// ******** COMPONENTS ********

function DrawerButton({ onClick, open }: IDrawerProps) {
    const sx = useMemo<SxProps>(() => [{ mr: 2 }, open ? { display: 'none' } : {}], [open]);
    return (
        <IconButton aria-label="open drawer" edge="start"{...{ onClick, sx }}>
            <MenuIcon />
        </IconButton>
    );
}

function HeaderDrawer({ onClick, open }: IDrawerProps) {
    const theme = useTheme();
    const navigate = useNavigate();

    const navigateAndCloseDrawerCallback = useCallback((path: string) => {
        return () => {
            navigate(path);
            onClick();
        };
    }, [navigate, onClick]);

    const getListEntries = useCallback((itemMap: Record<string, IHeaderListItem>) => {
        return Object.entries(itemMap).map(([text, { icon, path }]) => {
            return {text, icon, onClick: navigateAndCloseDrawerCallback(path)};
        });
    }, [navigateAndCloseDrawerCallback]);

    const sessionsList = useMemo<IListItemProps[]>(() => {
        const sessionsDivider = { text: "Sesiones", icon: <MenuBook />, divider: true };
        return [sessionsDivider, ...getListEntries(sessionsListItemMap)];
    }, [getListEntries]);

    const monkehsList = useMemo<IListItemProps[]>(() => {
        const monkehsDivider = { text: "Monkehs", icon: <Face5Icon />, divider: true };
        return [monkehsDivider, ...getListEntries(monkehsListItemMap)];
    }, [getListEntries]);

    
    return (
        <StyledDrawer variant="persistent" anchor="left" open={open} onClose={onClick}>
            <DrawerHeader >
                <IconButton onClick={onClick}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <GenericList items={sessionsList} />
            <GenericList items={monkehsList} />
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
                {isAuthenticated && <Toolbar>
                    <DrawerButton onClick={onDrawerButtonClick} open={drawerOpen} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Calendarios medicosos
                    </Typography>
                    <Button variant="contained" onClick={onLogoutClick}>Logout</Button>
                </Toolbar>}
            </AppBar >
            <HeaderDrawer open={drawerOpen} onClick={onDrawerButtonClick} />
        </Box>
    );
}