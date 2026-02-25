import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
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
<<<<<<< HEAD
          <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
=======
          <AuthHeader />
          <main>{children}</main>
>>>>>>> fb28570 (feat: implement user profile page with activity and post management)
        </AuthProvider>
      </body>
    </html>
  );
}
