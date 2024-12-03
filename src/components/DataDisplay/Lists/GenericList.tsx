import {
    Divider,
    Typography,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    List,
    CircularProgress
} from "@mui/material";
import { ReactNode, useState } from "react";

export interface IListItemProps {
    text?: ReactNode;
    align?: "left" | "right" | "center";
    icon?: JSX.Element;
    onClick?: () => void;
    divider?: boolean;
    subtext?: ReactNode;
}

interface IGenericListItemProps extends IListItemProps {
    selected?: boolean;
}

interface IGenericListProps {
    items: IListItemProps[];
    defaultSelectedIndex?: number;
    loading?: boolean;
}

function ListDivider({ icon, text, align }: IListItemProps) {
    return (
        <Divider textAlign={align} flexItem sx={{ margin: 1 }}>
                {icon}
                <Typography variant="body1" display={!!text ? "inherit" : "none"}>{text}</Typography>
        </Divider>
    );
};

function GenericListItem(props: IGenericListItemProps) {
    if (props.divider) return <ListDivider {...props} />;

    return (
        <ListItem disablePadding onClick={props.onClick}>
            <ListItemButton >
                <ListItemIcon sx={{ minWidth: 35 }}>{props.icon}</ListItemIcon>
                <ListItemText primary={props.text} secondary={props.subtext} />
            </ListItemButton>
        </ListItem>
    );
}

export default function GenericList({ items, loading, defaultSelectedIndex }: IGenericListProps) {
    const [selectedItem, setSelectedItem] = useState<number>(0);

    return (
        <List>
            {loading
                ? <CircularProgress />
                : items.map((item, index) => (
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