import { useCallback, useMemo, useState } from "react";
import RefreshDialog from '@components/Layout/Modals/RefreshDialog';
import { AppBar, Box, Button, Drawer, IconButton, Paper, SxProps, Toolbar, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useHeaderContext, useSessionContext } from "@hooks/useCustomContext";
import { useNavigate } from "react-router-dom";
import GenericList from "@components/DataDisplay/Lists/GenericList";
import { useLocale } from "@hooks/useLocale";
import { DrawerLabels, HeaderLabels } from "@shared/locale/appUI";
import { DrawerItem, DrawerItemsConfigMap, DrawerSection } from "@shared/models/AppUI";
import LanguageDropdown from "@components/Inputs/Dropdowns/LanguageDropdown";

// ******** INTERFACES ********

interface IDrawerProps {
    open?: boolean;
    onClick: () => void;
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
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        minWidth: 'max-content',
        width: '32ex',
        boxSizing: 'border-box',
    },
}));


// ******** COMPONENTS ********

function DrawerButton({ onClick }: IDrawerProps) {
    const sx = useMemo<SxProps>(() => [{ mr: 2 }], []);
    return (
        <IconButton aria-label="open drawer" edge="start"{...{ onClick, sx }}>
            <MenuIcon />
        </IconButton>
    );
}

function useDrawerItems(onClick: () => void) {
    const navigate = useNavigate();
    const sessionLabels = useLocale<DrawerItem>(DrawerLabels[DrawerSection.Sessions]);
    const monkehsLabels = useLocale<DrawerItem>(DrawerLabels[DrawerSection.Monkeh]);
    const eventCfgLabels = useLocale<DrawerItem>(DrawerLabels[DrawerSection.EventConfig]);
    const labels = useMemo<Record<DrawerSection, Record<DrawerItem, string>>>(() => {
        return {
            [DrawerSection.Sessions]: sessionLabels,
            [DrawerSection.Monkeh]: monkehsLabels,
            [DrawerSection.EventConfig]: eventCfgLabels,
        };
    }, [sessionLabels, monkehsLabels, eventCfgLabels]);

    const navigateCallback = useCallback((path: string) => {
        return () => {
            navigate(path);
            onClick();
        };
    }, [navigate, onClick]);

    const getSectionItems = useCallback((section: DrawerSection) => {
        const sectionLabels = labels[section];
        return DrawerItemsConfigMap[section].map(({ item, IconComponent, path }) => {
            const divider = item === DrawerItem.Divider;
            const onClick = divider ? undefined : navigateCallback(path);
            return {
                divider,
                text: sectionLabels[item],
                icon: <IconComponent />,
                onClick,
                path,
            }
        });
    }, [navigateCallback, labels]);

    const items = useMemo(() => Object.values(DrawerSection).flatMap(getSectionItems), [getSectionItems]);

    return items;
}

function HeaderDrawer({ onClick, open }: IDrawerProps) {
    const theme = useTheme();
    const drawerItems = useDrawerItems(onClick);

    return (
        <StyledDrawer variant="persistent" anchor="left" open={open} onClose={onClick}>
            <DrawerHeader >
                <IconButton onClick={onClick}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <GenericList items={drawerItems} />
        </StyledDrawer>
    );
}


export default function Header() {
    const { isAuthenticated, logout } = useSessionContext();
    const {Logout: logoutLabel} = useLocale<string>(HeaderLabels);
    const onLogoutClick = useCallback((e: any) => {
        e.preventDefault();
        if (window.confirm(`${logoutLabel}?`)) logout();
    }, [logout, logoutLabel]);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const onDrawerButtonClick = useCallback(() => setDrawerOpen(prev => !prev), [setDrawerOpen]);
    const { title } = useHeaderContext();

    return (
        <Box sx={{ display: isAuthenticated ? 'flex' : 'none' }} marginX={2} component={Paper}>
            <AppBar position="static" color="transparent" >
                <RefreshDialog />
                {isAuthenticated && <Toolbar sx={{ paddingY: 2.5, gap: 2 }}>
                    <DrawerButton onClick={onDrawerButtonClick} open={drawerOpen} />
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <LanguageDropdown />
                    <Button variant="outlined" color="secondary" onClick={onLogoutClick}>{logoutLabel}</Button>
                </Toolbar>}
                
            </AppBar >
            <HeaderDrawer open={drawerOpen} onClick={onDrawerButtonClick} />
        </Box>
    );
}