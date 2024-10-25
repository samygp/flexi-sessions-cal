import {
    Divider,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    List
} from "@mui/material";
import { ReactNode, useState } from "react";

export interface IListItemProps {
    text?: ReactNode;
    align?: "left" | "right" | "center";
    icon?: JSX.Element;
    onClick?: () => void;
    divider?: boolean;
}

interface IGenericListItemProps extends IListItemProps {
    selected?: boolean;
}

function ListDivider({ icon, text, align }: IListItemProps) {
    return (
        <Divider textAlign={align} >
            {icon}
            <Typography variant="body1" display={!!text ? "inline-flex" : "none"}>{text}</Typography>
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