import { LocalizedText } from ".";
import { CalendarEvent, EventCategory, EventType } from "../models/CalendarEvents";
import { IEventRule } from "../models/EventRules";

export const EventViewLabels: Record<string, LocalizedText> = Object.freeze({
    RefreshEvents: {
        en: "Refresh Events",
        fr: "Refraichir Événements",
        es: "Refrescar Eventos"
    },
    AddEvent: {
        en: "New Event",
        fr: "Ajouter Événement",
        es: "Agregar Evento"
    },
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
        en: "Type",
        fr: "Type",
        es: "Tipo"
    },
    monkehIds: {
        en: "Monkeh(s)",
        fr: "Monkeh(s)",
        es: "Monkeh(s)"
    },
});

export const EventRuleViewLabels: Record<string, LocalizedText> = Object.freeze({
    RefreshEventRules: {
        en: "Refresh Event Rules",
        fr: "Refraichir Conditions d'Événement",
        es: "Refrescar Reglas De Eventos"
    }
})

export const EventRuleFieldLabels: Record<keyof IEventRule, LocalizedText> = Object.freeze({
    id: {
        en: "ID",
        fr: "ID",
        es: "ID"
    },
    eventType: {
        en: "Type",
        fr: "Type",
        es: "Tipo"
    },
    maxDailyEvents: {
        en: "Max Daily Events",
        fr: "Maximal Événements Par Jour",
        es: "Maxima Cantidad De Eventos Por Dia"
    },
    daysOfWeek: {
        en: "Days of Week",
        fr: "Jours de la Semaine",
        es: "Días De La Semana"
    },
});