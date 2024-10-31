import { colors } from "@mui/material";
import { startCase } from "lodash";
import moment, { Moment, unix } from "moment";

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

interface ISerializedMonkeh extends Omit<IMonkeh, 'birthday'> {
    birthday: string;
}


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

export interface IMonkehRequest extends Partial<Omit<IMonkeh, 'id' | 'birthday'>> {
    id?: string;
    birthday?: number;
}

export interface IMonkehResponse extends Omit<IMonkeh, 'birthday'> {
    birthday: number;
}

export const toMonkehRequest = (monkeh: Partial<IMonkeh>): IMonkehRequest => {
    return { ...monkeh, birthday: monkeh.birthday?.unix() };
}

export const parseMonkehResult = (monkeh: IMonkehResponse): IMonkeh => {
    const name = startCase(monkeh.name);
    return { ...monkeh, name, birthday: unix(monkeh.birthday!) };
}

export const deserializeMonkehs = (monkehString: string): IMonkeh[] => {
    const monkeh = JSON.parse(monkehString) as ISerializedMonkeh[];
    return monkeh.map(m => ({ ...m, birthday: moment(m.birthday) }));
}

export const getMonkehSortId = ({level, name}: IMonkeh) => `R${level}-${name}`;