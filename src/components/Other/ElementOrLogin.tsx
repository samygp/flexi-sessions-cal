import { Navigate } from "react-router-dom";
import { useSessionContext } from "@hooks/useCustomContext";
import { getPath, PathName } from "@shared/models/Routes";

interface IElementOrLoginProps {
    element: JSX.Element;
}
export default function ElementOrLogin({ element }: IElementOrLoginProps) {
    const {isAuthenticated} = useSessionContext();
    if (isAuthenticated) return element;
    return <Navigate replace to={getPath(PathName.login)} />
}