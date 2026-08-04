import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import AuthGate from "@/components/AuthGate";

const serifKr = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const sansKr = IBM_Plex_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "필사와 변주",
  description:
    "매일 좋은 가사를 필사하고 내 문장으로 변주하는 작사 루틴 기록장",
  appleWebApp: {
    capable: true,
    title: "필사와 변주",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0e13",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${serifKr.variable} ${sansKr.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthGate>
          <main className="mx-auto min-h-dvh max-w-md px-5 pb-32 pt-6">
            {children}
          </main>
        </AuthGate>
      </body>
    </html>
  );
}
