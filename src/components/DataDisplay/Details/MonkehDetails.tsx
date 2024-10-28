import { Box, Typography } from "@mui/material";
import { IMonkeh } from "../../../shared/models/Monkeh";
import { getMonthDate } from "../../../shared/utils/dateHelpers";
import { startCase } from "lodash";
import MonkehTag from "../Tags/MonkehTag";
import { Cake } from "@mui/icons-material";
import { ReactNode } from "react";

interface IMonkehDetailsProps {
    monkeh: IMonkeh;
    headerAction?: ReactNode;
}

const CakeIcon = () => <Cake sx={{ marginBottom: '-0.2ex', paddingTop: '0.4ex' }} />

export default function MonkehDetails({ monkeh, headerAction }: IMonkehDetailsProps) {
    return (
        <Box textAlign={"center"} width={"100%"} >
            <Typography variant="h4" gutterBottom justifyItems={"center"} display={"inline-flex"} gap={2}>
                <MonkehTag {...monkeh} />{startCase(monkeh.name)} {headerAction}
            </Typography>
            <Typography>({monkeh.email})</Typography>
            <Typography >
                <CakeIcon /> {getMonthDate(monkeh.birthday)}
            </Typography>

        </Box>
    );
}