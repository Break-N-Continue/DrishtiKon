import "./globals.css";

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
        <header className="border-b border-border bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">
              DrishtiKon
            </h1>
            <span className="text-sm text-muted-foreground">
              College Community Platform
            </span>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
