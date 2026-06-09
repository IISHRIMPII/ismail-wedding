import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "حفل زفاف إسماعيل | Ismail's Wedding",
  description: "يتشرف علي بن إسماعيل بن مسلم الزيدي بدعوتكم لحضور عقد قران نجله إسماعيل",
  openGraph: {
    title: "حفل زفاف إسماعيل | Ismail's Wedding",
    description: "الخميس ١٨/٦/٢٠٢٦ — مجلس جامع بن عمير",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a2a4a",
              color: "#f5f0e8",
              borderRadius: "12px",
              fontFamily: "'Noto Naskh Arabic', serif",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
