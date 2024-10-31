import { FormGroup } from "@mui/material";
import moment from "moment";
import { Moment } from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ISelectOption } from "../../../shared/models/Data";
import GenericDropdown from "./GenericDropdown";

interface IMonthDayPickerProps {
    value: Moment;
    onChange: (date: Moment) => void;
    label?: string;
}

const monthOptions: ISelectOption<number>[] = Array.from({ length: 12 }, (_, i) => ({ label: moment({ month: i }).format('MMMM'), value: i + 1 }));

export default function MonthDayPicker({ label, value: originalValue, onChange: setValue }: IMonthDayPickerProps) {
    const [date, setDate] = useState<Moment>(originalValue);
    useEffect(() => { setValue(date) }, [date, setValue]);

    const dayOptions = useMemo<ISelectOption<number>[]>(() => {
        const daysInMonth = date.daysInMonth();
        return Array.from({ length: daysInMonth }, (__, i) => ({ value: i + 1 }));
    }, [date]);

    const onMonthChange = useCallback((v: number) => {
        setDate(prev => moment({ month: v - 1, year: prev.year(), date: 1 }));
    }, [setDate]);

    const onDayChange = useCallback((date: number) => {
        setDate(prev => moment({ year: prev.year(), month: prev.month(), date }));
    }, [setDate]);

    return (
        <FormGroup row>
            <GenericDropdown<number> label={label} typeSafeValue={Number} value={date.month() + 1} onChange={onMonthChange} options={monthOptions} sx={{ minWidth: '15ex' }} />
            <GenericDropdown<number> typeSafeValue={Number} value={date.date()} onChange={onDayChange} options={dayOptions}  sx={{ minWidth: '7.5ex' }} />
        </FormGroup>
    );
}