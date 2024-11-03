import { PropsWithChildren, useState } from "react";
import { useTitle } from "react-use";
import HeaderContext from "@shared/models/context/HeaderContext";

export const HeadercontextProvider = ({children}: PropsWithChildren) => {
    const [title, setTitle] = useState<string>(document.title);
    useTitle(title);

    return (
        <HeaderContext.Provider value={{ title, setTitle }}>
            {children}
        </HeaderContext.Provider>
    );
}