import React, { createContext, useContext } from "react";

interface BackendUrlContextType {
  backendUrl: string;
}

const BackendUrlContext = createContext<BackendUrlContextType | undefined>(
  undefined
);

interface BackendUrlProviderProps {
  children: React.ReactNode;
}

export const BackendUrlProvider: React.FC<BackendUrlProviderProps> = ({
  children,
}) => {
  const backendUrl =import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  return (
    <BackendUrlContext.Provider value={{ backendUrl }}>
      {children}
    </BackendUrlContext.Provider>
  );
};

export const useBackendUrl = (): string => {
  const context = useContext(BackendUrlContext);

  if (!context) {
    throw new Error("useBackendUrl must be used inside <BackendUrlProvider>");
  }

  return context.backendUrl;
};
