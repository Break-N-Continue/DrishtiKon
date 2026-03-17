import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RightSidebarProvider } from "@/context/RightSidebarContext";
import AuthLayoutWrapper from "@/components/global/AuthLayoutWrapper";

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
    <html lang="en">
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
