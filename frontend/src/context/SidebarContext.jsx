import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = (event) => {
      const nextIsDesktop = event.matches;
      setIsDesktop(nextIsDesktop);
      if (nextIsDesktop) {
        setMobileOpen(false);
      }
    };

    syncViewport(mediaQuery);
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const toggleSidebar = () => {
    if (isDesktop) {
      setCollapsed((prev) => !prev);
      return;
    }

    setMobileOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        mobileOpen,
        isDesktop,
        toggleSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
