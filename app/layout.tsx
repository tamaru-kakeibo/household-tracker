import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '家事カレンダー',
  description: '毎日の家事メンテナンスをカレンダーで管理。1日30分〜1時間で貯まる家計へ。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${noto.variable} font-sans`}>{children}</body>
    </html>
  );
}
