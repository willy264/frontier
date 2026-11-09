import "./globals.css";

export const metadata = {
  title: "FRONTIER | On-chain trading empire",
  description: "A persistent strategy and trading game on NEAR."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

