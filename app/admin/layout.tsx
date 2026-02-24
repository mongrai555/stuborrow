"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = confirm("ต้องการออกจากระบบ Admin ใช่หรือไม่?");
    if (confirmLogout) {
      router.push("/"); // กลับไปหน้า Login
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Admin Navbar เรืองแสง */}
      <nav className="bg-darkPanel border-b border-neonBlue/40 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,243,255,0.08)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo ฝั่ง Admin */}
          <div className="text-xl font-bold tracking-wider cursor-pointer flex items-center gap-2" onClick={() => router.push("/admin/dashboard")}>
            <span className="text-neonBlue drop-shadow-neon">STUDIO</span>
            <span className="text-white">ADMIN</span>
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-sm animate-pulse tracking-widest">CS</span>
          </div>

          {/* Menu Links */}
          <div className="flex items-center gap-6 text-sm md:text-base">
            <Link 
              href="/admin/dashboard" 
              className={`font-medium transition-all ${
                isActive("/admin/dashboard") 
                  ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              คลังอุปกรณ์ (Dashboard)
            </Link>
            <Link 
              href="/admin/inbox" 
              className={`font-medium transition-all relative ${
                isActive("/admin/inbox") 
                  ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ตรวจรับของ (Inbox)
              {/* จุดแดงแจ้งเตือน (จำลอง) */}
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]">1</span>
            </Link>
            
            {/* เส้นคั่น */}
            <div className="w-px h-6 bg-gray-700 ml-2"></div>

            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-all font-medium"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}