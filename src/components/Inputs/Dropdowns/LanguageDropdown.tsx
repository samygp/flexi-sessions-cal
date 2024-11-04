import { ISelectOption } from "@shared/models/Data";
import GenericDropdown from "@components/Inputs/Dropdowns/GenericDropdown";
import { useSessionContext } from "@hooks/useCustomContext";
import { SupportedLocale, SupportedLocaleLabels } from "@shared/locale";

const getOption = (loc: SupportedLocale) =>  ({value: loc, label: SupportedLocaleLabels[loc]});
const options: ISelectOption<SupportedLocale>[] = Object.values(SupportedLocale).map(getOption);

export default function LanguageDropdown() {
    const {locale: value, setLocale: onChange} = useSessionContext();
    return <GenericDropdown label="Language" {...{ options, value, onChange }} />;
}