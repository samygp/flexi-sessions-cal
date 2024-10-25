import { colors } from "@mui/material";
import moment,  { Moment } from "moment";

export enum ErreLevel {
    Invisible = 1,
    Medio,
    Abarbaro,
    Unicornio,
}

export interface IMonkeh {
    id: string; // P-key
    name: string;
    email: string;
    level: ErreLevel;
    birthday: Moment;
};

export const MonkehLevelColor: Record<number, string> = Object.freeze({
    1: colors.green[300],
    2: colors.blue[300],
    3: colors.deepOrange[300],
    4: colors.deepPurple[200],
});

export const defaultDummyMonkeh: IMonkeh = Object.freeze({
    id: "",
    name: "",
    email: "",
    level: 1,
    birthday: moment('1972-01-01'),
})