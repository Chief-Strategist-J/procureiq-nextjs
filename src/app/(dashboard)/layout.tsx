import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobilesidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />

      <div className="md:ml-64">
        <MobileSidebar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}