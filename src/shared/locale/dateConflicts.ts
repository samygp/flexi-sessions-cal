import { LocalizedText } from ".";
import { EventConflict } from "../models/EventRules";

export const DateConflictLabels: Record<EventConflict, LocalizedText> = Object.freeze({
    [EventConflict.PastDate]: {
        en: "Past Date",
        fr: "Date Passée",
        es: "Fecha Pasada"
    },
    [EventConflict.MaxDailyEvents]: {
        en: "Max Daily Events",
        fr: "Max Evénements Journaliers",
        es: "Max Eventos Diarios"
    },
    [EventConflict.BlockingEvent]: {
        en: "Blocking Event",
        fr: "Evénement Bloqué",
        es: "Evento Bloqueado"
    },
    [EventConflict.PushesEntireDay]: {
        en: "Pushes Entire Day",
        fr: "Pousse Toute La Journee",
        es: "Empuja Todo El Día"
    },
    [EventConflict.PushesNextEvent]: {
        en: "Pushes Next Event",
        fr: "Pousse L'Événement Suivant",
        es: "Empuja El Evento Siguiente"
    },
    [EventConflict.PersonalEvent]: {
        en: "Personal Event",
        fr: "Evénement Personnel",
        es: "Evento Personal"
    },
    [EventConflict.WeekDayNotAllowed]: {
        en: "Week Day Not Allowed",
        fr: "Jour de la Semaine Non Autorisé",
        es: "Día De La Semana No Permitido"
    },
});