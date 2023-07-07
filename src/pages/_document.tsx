import { ThemeProvider } from "@/components/theme-provider";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-screen">
      <Head />
      <body className="h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Main />
          <NextScript />
        </ThemeProvider>
      </body>
    </Html>
  );
}
