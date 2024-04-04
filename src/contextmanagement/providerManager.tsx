// ProviderManager.tsx
import React, { ReactNode } from "react";
import { DialogProvider } from "./dialogContext";

interface ProviderManagerProps {
  children: ReactNode;
}

const ProviderManager: React.FC<ProviderManagerProps> = ({ children }) => {
  return (
    <DialogProvider>
      {children}
    </DialogProvider>
  );
};

export default ProviderManager;
