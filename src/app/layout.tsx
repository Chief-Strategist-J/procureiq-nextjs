import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobilesidebar";

export const metadata: Metadata = {
  title: "ProcureIQ",
  description: "ProcureIQ Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Sidebar />
        <MobileSidebar />
        <main className="md:ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}