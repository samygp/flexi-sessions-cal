import {
    Divider,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    List
} from "@mui/material";
import { useState } from "react";

export interface IListItemProps {
    text?: string;
    icon?: JSX.Element;
    onClick?: () => void;
    divider?: boolean;
}

interface IGenericListItemProps extends IListItemProps {
    selected?: boolean;
}

const CenteredItemsDiv = styled('div')(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    flexDirection: "row",
    gap: theme.spacing(0.7),
}));

function ListDivider({ icon, text }: IListItemProps) {
    return (
        <Divider>
            <CenteredItemsDiv>
                {icon}
                <Typography variant="body1" display={!!text ? "inline-flex" : "none"}>{text}</Typography>
            </CenteredItemsDiv>
        </Divider>
    );
};

function GenericListItem(props: IGenericListItemProps) {
    if (props.divider) return <ListDivider {...props} />;

    return (
        <ListItem disablePadding onClick={props.onClick}>
            <ListItemButton >
                <ListItemIcon sx={{ minWidth: 35 }}>{props.icon}</ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    );
}

export default function GenericList({ items }: { items: IListItemProps[] }) {
    const [selectedItem, setSelectedItem] = useState<number>();

    return (
        <List>
            {items.map((item, index) => (
                <GenericListItem key={index} {...item} selected={selectedItem === index}
                    onClick={() => {
                        if (item.onClick) {
                            setSelectedItem(index);
                            item.onClick();
                        }
                    }}
                />
            )
            )}
        </List>
    );
}