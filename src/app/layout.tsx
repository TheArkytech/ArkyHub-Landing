import "./globals.css";

/**
 * Bare pass-through root layout. The actual <html>/<body> shell lives in
 * [locale]/layout.tsx where the locale param is available for lang="…".
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
