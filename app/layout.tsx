export const metadata = {
  title: '心理测评系统',
  description: '专业心理测评问卷系统',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}