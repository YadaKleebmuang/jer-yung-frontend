import type { Metadata } from "next";
import {
  Geist_Mono,
  Noto_Sans_Thai,
} from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "เจอยัง | Jer-Yung",
    template: "%s | เจอยัง",
  },
  description:
    "ระบบติดตามของหายและสิ่งของที่พบ มหาวิทยาลัยราชภัฏบุรีรัมย์",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
