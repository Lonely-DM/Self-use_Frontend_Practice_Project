import "./globals.css";

export const metadata = {
  title: "Gelato Cove | 冰淇淋菜单",
  description: "一个带有招牌口味、圣代和加料推荐的冰淇淋菜单页面。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
