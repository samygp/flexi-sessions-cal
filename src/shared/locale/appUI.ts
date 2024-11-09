import { LocalizedText } from "@/shared/locale";
import { DrawerItem, DrawerSection } from "@/shared/models/AppUI";

export const HeaderLabels: Record<string, LocalizedText> = Object.freeze({
    Calendar: {
        en: "Calendar",
        fr: "Calendrier",
        es: "Calendario"
    },
    Monkeh: {
        en: "Monkeh",
        fr: "Monkeh",
        es: "Monkeh"
    },
    Logout: {
        en: "Logout",
        fr: "Deconnexion",
        es: "Cerrar Sesión"
    },
    EventRules: {
        en: "Event Rules",
        fr: "Conditions d'Événement",
        es: "Reglas De Eventos",
    }
});

type DrawerSectionLabels = Partial<Record<DrawerItem, LocalizedText>>;

export const DrawerLabels: Record<DrawerSection, DrawerSectionLabels> = Object.freeze({
    [DrawerSection.Sessions]: {
        [DrawerItem.Divider]: {
            en: "Sessions",
            fr: "Sessions",
            es: "Sesiones"
        },
        [DrawerItem.Calendar]: {
            en: "Calendar",
            fr: "Calendrier",
            es: "Calendario"
        },
        [DrawerItem.Biblio]: {
            en: "Biblio",
            fr: "Biblio",
            es: "Bibliograficas"
        },
        [DrawerItem.Clinic]: {
            en: "Clinic",
            fr: "Clinique",
            es: "Clinicas"
        },
    },
    [DrawerSection.Monkeh]: {
        [DrawerItem.Divider]: {
            en: "Monkehs",
            fr: "Monkehs",
            es: "Monkehs"
        },
        [DrawerItem.AllMonkehs]: {
            en: "All Monkehs",
            fr: "Tous Les Monkehs",
            es: "Todos Los Monkehs",
        },
        [DrawerItem.Birthdays]: {
            en: "Birthdays",
            fr: "Anniversaires",
            es: "Cumpleaños",
        },
    },
    [DrawerSection.EventConfig]: {
        [DrawerItem.Divider]: {
            en: "Event Config",
            fr: "Gérer Événements",
            es: "Configuración De Eventos",
        },
        [DrawerItem.EventRules]: {
            en: "Event Rules",
            fr: "Conditions d'Événement",
            es: "Reglas De Evento",
        },
    }
});