import moment, { Moment } from "moment";

export const timestamp = (date: Moment): number => {
    return date.utc().unix();
}

export const beginningOf = Object.freeze({
    year: (year: number) => timestamp(moment([year]).startOf('year')),
});

export const endOf = Object.freeze({
    year: (year: number) => timestamp(moment([year]).endOf('year')),
});

const ymdFormat = 'YYY-MM-dd';
export const getDayID = (date: Moment) => date.format(ymdFormat);

export const readableDateTime = (date: Moment) => date.toLocaleString();

export const destructureDate = (date: Moment) => {
    return {
        year: date.year(),
        month: date.month(),
        day: date.date(),
    }
}