import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RightSidebarProvider } from "@/context/RightSidebarContext";
import AuthLayoutWrapper from "@/components/global/AuthLayoutWrapper";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: "DrishtiKon - College Community",
  description: "A platform for college community discussions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          <RightSidebarProvider>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          </RightSidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
