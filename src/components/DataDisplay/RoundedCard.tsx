import { Card, styled } from "@mui/material";

const RoundedCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: '1ex',
}))

export default RoundedCard;