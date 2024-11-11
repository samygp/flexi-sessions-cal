import moment, { Moment } from "moment";

export const timestamp = (date: Moment): number => {
    return date.utc().unix();
}

export const beginningOf = Object.freeze({
    month: (year: number, month: number) => timestamp(moment({year, month}).startOf('month')),
    year: (year: number) => timestamp(moment([year]).startOf('year')),
});

export const endOf = Object.freeze({
    month: (year: number, month: number) => timestamp(moment({year, month}).endOf('month')),
    year: (year: number) => timestamp(moment([year]).endOf('year')),
});

const ymdFormat = 'YYYY-MM-DD';
export const getDayID = (date: Moment) => date.format(ymdFormat);

export const readableDateTime = (date: Moment) => date.local(true).format('ddd YYYY-MM-DD');

export const destructureDate = (date: Moment) => {
    return {
        year: date.year(),
        month: date.month(),
        day: date.date(),
    }
}

export const getMonthDate = (date: Moment) => date.local(true).format('MMM-DD (dddd)');

export const nowSeconds = () => Math.floor(Date.now() / 1000);

export const secondsSince = (date: Moment) => nowSeconds() - date.unix();

export const getDayOfWeekName = (dayOfWeekNumber: number, locale?: string) => {
    return moment().weekday(dayOfWeekNumber).locale(locale ?? true).format('ddd');
}