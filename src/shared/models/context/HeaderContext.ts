import React from "react";

export interface IHeaderContext {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

export default React.createContext<IHeaderContext>({title: "", setTitle: () => {}});;