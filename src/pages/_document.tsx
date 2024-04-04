import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <style jsx global>{`
        #__next {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
        `}</style>

      </body>
    </Html>
  );
}
