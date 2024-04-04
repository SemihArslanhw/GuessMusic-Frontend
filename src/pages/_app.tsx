// pages/_app.tsx
import React from "react";
import ProviderManager from "../contextmanagement/providerManager";
import "../styles/globals.css"; // Assuming you have global styles

interface AppProps {
  Component: React.ComponentType;
  pageProps: any; // You can specify more specific types if you have them
}

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ProviderManager>
      <Component {...pageProps} />
    </ProviderManager>
  );
}

export default MyApp;