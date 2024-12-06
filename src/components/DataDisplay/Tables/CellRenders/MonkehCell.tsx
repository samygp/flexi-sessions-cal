import { styled } from "@mui/material";
import MonkehTag from "@/components/DataDisplay/Tags/MonkehTag";
import { IMonkeh } from "@/shared/models/Monkeh";

const MonkehDiv = styled('div')(() => ({ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }));

export const MonkehCell = ({ name, level }: IMonkeh) => {
    return <MonkehDiv> <MonkehTag level={level} compact /> {name} </MonkehDiv>;
}