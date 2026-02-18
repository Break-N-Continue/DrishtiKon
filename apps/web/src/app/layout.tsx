import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthHeader from "@/components/auth/AuthHeader";

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
          <AuthHeader />
          <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
