import { LocalizedText } from ".";
import { IMonkeh } from "@/shared/models/Monkeh";

export const MonkehViewLabels: Record<string, LocalizedText> = Object.freeze({
    AddMonkeh: {
        en: "Add Monkeh",
        fr: "Ajouter Monkeh",
        es: "Agregar Monkeh",
    },
    RefreshMonkehs: {
        en: "Refresh Monkehs",
        fr: "Refraichir Monkehs",
        es: "Refrescar Monkehs",
    },
    SelectMonkehPlaceholder: {
        en: "Where Monkeh? (Select Monkeh)",
        fr: "Ou Monkeh? (Choisir Monkeh)",
        es: "Dónde Monkeh? (Seleccionar Monkeh)",
    }
})

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
        en: "Level (R)",
        fr: "Niveau (R)",
        es: "Erre"
    },
    birthday: {
        en: "Birthday",
        fr: "Anniversaire",
        es: "Fecha de nacimiento"
    },
})