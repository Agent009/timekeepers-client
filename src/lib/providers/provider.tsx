"use client";

import React, { createContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { LayerDocument } from "@models/layer.ts";

type Props = {
  children?: React.ReactNode;
};

interface AppContextType {
  layer?: LayerDocument;
  setLayer: React.Dispatch<React.SetStateAction<LayerDocument | undefined>>;
}

export const AppContext = createContext<AppContextType>({
  layer: undefined,
  setLayer: () => {},
});

export const Provider = ({ children }: Props) => {
  const [layer, setLayer] = useState<LayerDocument | undefined>();
  return (
    <AppContext.Provider value={{ layer, setLayer }}>
      <SessionProvider>{children}</SessionProvider>
    </AppContext.Provider>
  );
};
