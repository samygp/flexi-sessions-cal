import { CalendarIcon } from "@mui/x-date-pickers";
import SvgIcon from '@mui/material/SvgIcon';
import { Biotech, Cake, Class, MenuBook, SportsKabaddi, Face5 } from "@mui/icons-material";
import { getPath, PathName } from "./Routes";

export enum DrawerSection {
    Sessions = "sessions",
    Monkeh = "monkeh",
}

export enum DrawerItem {
    Divider = 'divider',
    Calendar = 'calendar',
    Biblio = 'biblio',
    Clinic = 'clinic',
    AllMonkehs = 'all-monkehs',
    Birthdays = 'birthdays',
}

export interface IDrawerItemConfig {
    item: DrawerItem;
    IconComponent: typeof SvgIcon;
    path: string;
}

export const DrawerItemsConfigMap: Record<DrawerSection, IDrawerItemConfig[]> = Object.freeze({
    [DrawerSection.Sessions]: [
        {
            item: DrawerItem.Divider,
            IconComponent: MenuBook,
            path: getPath(PathName.calendar),
        },
        {
            item: DrawerItem.Calendar,
            IconComponent: CalendarIcon,
            path: getPath(PathName.calendar),
        },
        {
            item: DrawerItem.Biblio,
            IconComponent: Class,
            path: getPath(PathName.calendar),
        },
        {
            item: DrawerItem.Clinic,
            IconComponent: Biotech,
            path: getPath(PathName.calendar),
        },
    ],
    [DrawerSection.Monkeh]: [
        {
            item: DrawerItem.Divider,
            IconComponent: Face5,
            path: getPath(PathName.monkeh),
        },
        {
            item: DrawerItem.AllMonkehs,
            IconComponent: SportsKabaddi,
            path: getPath(PathName.monkeh),
        },
        {
            item: DrawerItem.Birthdays,
            IconComponent: Cake,
            path: getPath(PathName.monkeh),
        },
    ]
})