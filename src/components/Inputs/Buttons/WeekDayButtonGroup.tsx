import { useSessionContext } from "@/hooks/useCustomContext";
import { getDayOfWeekName } from "@/shared/utils/dateHelpers";
import { ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { useCallback, useMemo } from "react";


interface IWeekDayButtonGroupProps {
    value: number[];
    onChange: (days: number[]) => void;
    disabled?: boolean;

}
export default function WeekDayButtonGroup({ value, onChange, disabled}: IWeekDayButtonGroupProps) {
    const { locale } = useSessionContext();
    const onClick = useCallback((day: number) => {
        const newValue = value.includes(day) ? value.filter(d => d !== day) : [...value, day];
        if (newValue.length > 0) onChange(newValue);
    }, [value, onChange]);
    const dayLabels = useMemo<string[]>(() => {
        return Array.from({ length: 7 }, (_, i) => getDayOfWeekName(i, locale));
    }, [locale]);

    return (
        <Box>
            <ToggleButtonGroup disabled={false}>
                {dayLabels.map((label, day) => {
                    return <ToggleButton
                        key={day}
                        value={day}
                        disabled={disabled}
                        selected={value.includes(day)}
                        onClick={() => onClick(day)}
                    >
                        {label}
                    </ToggleButton>
                }
                )}
            </ToggleButtonGroup>
            
        </Box>
    );
}