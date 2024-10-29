import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface ILoadingButtonProps extends ButtonProps {
    loading?: boolean
}

export default function LoadingButton(props: ILoadingButtonProps) {
    const { loading, children, disabled, ...rest } = props;
    return (
        <Button disabled={loading || disabled} {...rest} >
            {loading ? <CircularProgress /> : children}
        </Button>
    )    
}