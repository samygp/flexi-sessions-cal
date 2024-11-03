import { Box, Typography } from "@mui/material";
import { IMonkeh } from "@shared/models/Monkeh";
import { getMonthDate } from "@shared/utils/dateHelpers";
import { startCase } from "lodash";
import MonkehTag from "@components/DataDisplay/Tags/MonkehTag";
import { Cake } from "@mui/icons-material";
import { ReactNode } from "react";

interface IMonkehDetailsProps {
    monkeh: IMonkeh;
    headerAction?: ReactNode;
    compact?: boolean;
}

const CakeIcon = () => <Cake sx={{ marginBottom: '-0.2ex', paddingTop: '0.4ex' }} />

function FullMonkehDetails({ monkeh, headerAction }: IMonkehDetailsProps) {
    return (
        <>
            <Typography variant="h4" gutterBottom justifyItems={"center"} display={"inline-flex"} gap={2}>
                <MonkehTag {...monkeh} />{monkeh.name} {headerAction}
            </Typography>
            <Typography>({monkeh.email})</Typography>
            <Typography >
                <CakeIcon /> {getMonthDate(monkeh.birthday)}
            </Typography>
        </>
    );
}

function CompactMonkehDetails({ monkeh: {name, level} }: IMonkehDetailsProps) {
    return (
        <>
            <Typography justifyItems={"center"} display={"inline-flex"} gap={2}>
                <MonkehTag level={level} compact />{startCase(name)}
            </Typography>
        </>
    );
}

export default function MonkehDetails({ compact, ...props }: IMonkehDetailsProps) {
    return (
        <Box textAlign={"center"} width={"100%"} >
            {compact ? <CompactMonkehDetails {...props} /> : <FullMonkehDetails {...props} />}

        </Box>
    );
}