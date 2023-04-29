import { useState, createContext, useContext } from "react";
import type { ReactNode, Dispatch } from "react";

type SidebarContextType = [boolean, Dispatch<React.SetStateAction<boolean>>];

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function SidebarProvider({ children }: { children: ReactNode }) {
  const [closed, setClosed] = useState(true);

  return <SidebarContext.Provider value={[closed, setClosed]}>{children}</SidebarContext.Provider>;
}

function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export { SidebarProvider, useSidebar };
