"use client";
import { usePathname } from "next/navigation";
import AdminSidebar from "../../components/Sidebar"; // Adjust path as needed



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Use your collapsible sidebar component instead of static aside */}
      <AdminSidebar />

      {/* Main content */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div
            id="admin-page-title"
            className="text-base font-semibold text-gray-800"
          />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}