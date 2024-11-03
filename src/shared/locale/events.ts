import { LocalizedText } from ".";
import { CalendarEvent, EventCategory, EventType } from "../models/CalendarEvents";

export const EventViewFieldLabels: Record<string, LocalizedText> = Object.freeze({

});

export const EventTypeLabels: Record<EventType, LocalizedText> = Object.freeze({
    [EventType.Biblio]: {
        en: "Biblio Session",
        fr: "Session Biblio",
        es: "Sesión Bibliográfica"
    },
    [EventType.Clinic]: {
        en: "Clinic Session",
        fr: "Session Clinique",
        es: "Sesión Clinica"
    },
    [EventType.Rotation]: {
        en: "Rotation",
        fr: "Rotation",
        es: "Rotación"
    },
    [EventType.Vacation]: {
        en: "Vacation",
        fr: "Vacances",
        es: "Vacaciones"
    },
    [EventType.Holiday]: {
        en: "Holiday",
        fr: "Congé",
        es: "Feriado"
    },
    [EventType.Consultation]: {
        en: "Consultation",
        fr: "Consultation",
        es: "Consulta"
    },
    [EventType.Override]: {
        en: "Override",
        fr: "Override",
        es: "Override"
    },
})

export const EventCategoryLabels: Record<EventCategory, LocalizedText> = Object.freeze({
    [EventCategory.Personal]: {
        en: "Personal",
        fr: "Personnel",
        es: "Personal"
    },
    [EventCategory.Session]: {
        en: "Session",
        fr: "Session",
        es: "Sesión"
    },
    [EventCategory.Blocked]: {
        en: "Blocked",
        fr: "Bloqué",
        es: "Bloqueado"
    },
})

export const CalendarEventFieldLabels: Record<keyof CalendarEvent, LocalizedText> = Object.freeze({
    id: {
        en: "ID",
        fr: "ID",
        es: "ID"
    },
    date: {
        en: "Date",
        fr: "Date",
        es: "Fecha"
    },
    title: {
        en: "Title",
        fr: "Titre",
        es: "Título"
    },
    eventType: {
        en: "Event Type",
        fr: "Type d'événement",
        es: "Tipo de evento"
    },
    monkehId: {
        en: "Monkeh",
        fr: "Monkeh",
        es: "Monkeh"
    },
})