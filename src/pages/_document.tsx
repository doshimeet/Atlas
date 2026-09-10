import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased min-h-screen bg-wbg-porcelain">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
