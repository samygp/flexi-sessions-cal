import { CalendarIcon } from "@mui/x-date-pickers";
import SvgIcon from '@mui/material/SvgIcon';
import { Biotech, Cake, Class, MenuBook, SportsKabaddi, Face5, SettingsApplications, ManageHistory } from "@mui/icons-material";
import { getPath, PathName } from "./Routes";

export enum DrawerSection {
    Events = "events",
    Monkeh = "monkeh",
    EventConfig = "event-config"
}

export enum DrawerItem {
    Divider = 'divider',
    Calendar = 'calendar',
    Biblio = 'biblio',
    Clinic = 'clinic',
    AllMonkehs = 'all-monkehs',
    Birthdays = 'birthdays',
    EventRules = 'event-rules',
}

export interface IDrawerItemConfig {
    item: DrawerItem;
    IconComponent: typeof SvgIcon;
    path: string;
}

export const DrawerItemsConfigMap: Record<DrawerSection, IDrawerItemConfig[]> = Object.freeze({
    [DrawerSection.Events]: [
        {
            item: DrawerItem.Divider,
            IconComponent: CalendarIcon,
            path: getPath(PathName.calendar),
        },
        {
            item: DrawerItem.Calendar,
            IconComponent: CalendarIcon,
            path: getPath(PathName.calendar),
        },
        // {
        //     item: DrawerItem.Biblio,
        //     IconComponent: Class,
        //     path: getPath(PathName.calendar),
        // },
        // {
        //     item: DrawerItem.Clinic,
        //     IconComponent: Biotech,
        //     path: getPath(PathName.calendar),
        // },
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
        // {
        //     item: DrawerItem.Birthdays,
        //     IconComponent: Cake,
        //     path: getPath(PathName.monkeh),
        // },
    ],
    [DrawerSection.EventConfig]: [
        {
            item: DrawerItem.Divider,
            IconComponent: SettingsApplications,
            path: getPath(PathName.eventRules),
        },
        {
            item: DrawerItem.EventRules,
            IconComponent: ManageHistory,
            path: getPath(PathName.eventRules),
        }
    ],
})