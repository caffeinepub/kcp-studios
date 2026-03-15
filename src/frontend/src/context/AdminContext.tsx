import { createContext, useContext, useEffect, useState } from "react";

const PASSCODE = "122567891k7364738276shjhfhfjhsh";

interface AdminContextType {
  isAdmin: boolean;
  isShutdown: boolean;
  concertMode: boolean;
  doubleLuck: boolean;
  extraLives: boolean;
  login: (code: string) => boolean;
  logout: () => void;
  toggleShutdown: () => void;
  toggleConcertMode: () => void;
  toggleDoubleLuck: () => void;
  toggleExtraLives: () => void;
  earlyAccess: Record<string, boolean>;
  toggleEarlyAccess: (gameId: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

function ls<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => ls("admin_isAdmin", false));
  const [isShutdown, setIsShutdown] = useState(() =>
    ls("admin_isShutdown", false),
  );
  const [concertMode, setConcertMode] = useState(() =>
    ls("admin_concertMode", false),
  );
  const [doubleLuck, setDoubleLuck] = useState(() =>
    ls("admin_doubleLuck", false),
  );
  const [extraLives, setExtraLives] = useState(() =>
    ls("admin_extraLives", false),
  );
  const [earlyAccess, setEarlyAccess] = useState<Record<string, boolean>>(() =>
    ls("admin_earlyAccess", {}),
  );

  useEffect(() => {
    localStorage.setItem("admin_isAdmin", JSON.stringify(isAdmin));
  }, [isAdmin]);
  useEffect(() => {
    localStorage.setItem("admin_isShutdown", JSON.stringify(isShutdown));
  }, [isShutdown]);
  useEffect(() => {
    localStorage.setItem("admin_concertMode", JSON.stringify(concertMode));
  }, [concertMode]);
  useEffect(() => {
    localStorage.setItem("admin_doubleLuck", JSON.stringify(doubleLuck));
  }, [doubleLuck]);
  useEffect(() => {
    localStorage.setItem("admin_extraLives", JSON.stringify(extraLives));
  }, [extraLives]);
  useEffect(() => {
    localStorage.setItem("admin_earlyAccess", JSON.stringify(earlyAccess));
  }, [earlyAccess]);

  const login = (code: string): boolean => {
    if (code === PASSCODE) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    window.location.hash = "";
  };

  const toggleShutdown = () => setIsShutdown((p) => !p);
  const toggleConcertMode = () => setConcertMode((p) => !p);
  const toggleDoubleLuck = () => setDoubleLuck((p) => !p);
  const toggleExtraLives = () => setExtraLives((p) => !p);

  const toggleEarlyAccess = (gameId: string) => {
    setEarlyAccess((prev) => ({ ...prev, [gameId]: !prev[gameId] }));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isShutdown,
        concertMode,
        doubleLuck,
        extraLives,
        login,
        logout,
        toggleShutdown,
        toggleConcertMode,
        toggleDoubleLuck,
        toggleExtraLives,
        earlyAccess,
        toggleEarlyAccess,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
