import { useSessionContext } from "@hooks/useCustomContext";
import { LocalizedText } from "@shared/locale";
import { useMemo } from "react";


export function useLocale<K extends string>(localizedTextMap: Partial<Record<K, LocalizedText>>): Record<K, string> {
    const { locale } = useSessionContext();

    const localizedTexts = useMemo(() => {
        return Object.entries(localizedTextMap).reduce((acc, [key, value]) => {
            acc[key] = (value as LocalizedText)[locale];
            return acc;
        }, {} as Record<any, string>)
    }, [localizedTextMap, locale]);

    return localizedTexts;
}