import { createContext, ReactNode, useContext, useMemo } from "react";
import type { FeelbackStoreType } from "@feelback/js";


type FeelbackContext = Readonly<{
  endpoint?: string
  store?: FeelbackStoreType | "none";
}>


const ReactFeelbackContext = createContext<FeelbackContext | undefined>(undefined);

export function useFeelbackContext() {
  return useContext(ReactFeelbackContext);
}


export type FeelbackProviderProps = FeelbackContext & {
  children: ReactNode
}

export function FeelbackProvider(props: FeelbackProviderProps) {
  const {
    endpoint,
    store,
    children,
  } = props;

  const context = useMemo(() => ({
    endpoint,
    store,
  }), [endpoint, store]);

  return (
    <ReactFeelbackContext.Provider value={context}>
      {children}
    </ReactFeelbackContext.Provider>
  );
}
