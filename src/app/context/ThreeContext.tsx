"use client";

import { createContext, ReactNode, useContext } from "react";

type ThreeContextType = {
  ready: boolean;
};
const ThreeContext = createContext<ThreeContextType>({
  ready: false,
});

type Props = {
  children: ReactNode;
};
export default function ThreeContextProvider({ children }: Props) {
  return (
    <ThreeContext.Provider value={{ ready: true }}>
      {children}
    </ThreeContext.Provider>
  );
}

export const useThreeContext = () => useContext(ThreeContext);
