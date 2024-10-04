import moment, { Moment } from "moment";

export const timestamp = (date: Date | Moment): number => {
    return moment.isMoment(date) ? date.utc().unix(): Math.floor(date.valueOf() / 1000);
}

export const beginningOf = Object.freeze({
    year: (year: number) => timestamp(moment([year]).startOf('year')),
});

export const endOf = Object.freeze({
    year: (year: number) => timestamp(moment([year]).endOf('year')),
});

const ymdFormat = 'YYY-MM-dd';
export const getDayID = (date: Moment) => date.format(ymdFormat);