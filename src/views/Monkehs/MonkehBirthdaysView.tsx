import BaseViewLayout from "@/views/BaseViewLayout";
import { useLocale } from "@/hooks/useLocale";
import { HeaderLabels } from "@/shared/locale/appUI";
import MonkehTable from "@/components/DataDisplay/Tables/MonkehTable";

export default function MonkehBirthdaysView() {
    const { MonkehBirthday: birthdayHeaderTitle } = useLocale<string>(HeaderLabels);
    
    return (
        <BaseViewLayout headerTitle={birthdayHeaderTitle}>
            <MonkehTable  />
        </BaseViewLayout>
    );
}