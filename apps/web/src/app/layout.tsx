import "@styles/globals.css";
import ChakraProviders from "@contexts/ChakraProviders";
import ClientProvider from "@contexts/ClientProvider";
import { getServerSession } from "next-auth";
import { authOptions } from '@app/api/auth/[...nextauth]/authOptions';

// This is the root layout of the application. All route share this same layout.

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <ClientProvider session={session}>
          <ChakraProviders>{children}</ChakraProviders>
        </ClientProvider>
      </body>
    </html>
  );
}
