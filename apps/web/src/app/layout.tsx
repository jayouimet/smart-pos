import "@styles/globals.css";
import ChakraProviders from "@contexts/ChakraProviders";

// This is the root layout of the application. All route share this same layout.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProviders>{children}</ChakraProviders>
      </body>
    </html>
  );
}
