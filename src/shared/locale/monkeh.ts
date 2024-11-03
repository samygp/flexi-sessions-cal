import { LocalizedText } from ".";
import { IMonkeh } from "../models/Monkeh";


export const MonkehFieldLabels: Record<keyof IMonkeh, LocalizedText> = Object.freeze({
    id: {
        en: "ID",
        fr: "ID",
        es: "ID"
    },
    name: {
        en: "Name",
        fr: "Nom",
        es: "Nombre"
    },
    email: {
        en: "Email",
        fr: "Email",
        es: "Email"
    },
    level: {
        en: "Level",
        fr: "Niveau",
        es: "Nivel"
    },
    birthday: {
        en: "Birthday",
        fr: "Anniversaire",
        es: "Fecha de nacimiento"
    },
})