export enum SupportedLocale {
    EN = 'en',
    ES = 'es',
    FR = 'fr',
}

export const SupportedLocaleLabels: Record<SupportedLocale, string> = Object.freeze({
    [SupportedLocale.EN]: "English",
    [SupportedLocale.ES]: "Español",
    [SupportedLocale.FR]: "Français",
});

export type LocalizedText = Record<SupportedLocale, string>;