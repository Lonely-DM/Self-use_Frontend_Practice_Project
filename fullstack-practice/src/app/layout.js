import "./globals.css";
import { SettingsProvider } from "@/components/settings-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
