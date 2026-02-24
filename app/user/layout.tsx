"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = confirm("ต้องการออกจากระบบใช่หรือไม่?");
    if (confirmLogout) {
      // อนาคตสามารถเพิ่มคำสั่งลบ Token หรือ LocalStorage ที่นี่ได้
      router.push("/"); // เด้งกลับไปหน้า Login
    }
  };

  // ฟังก์ชันเช็กว่าตอนนี้อยู่หน้าไหน เพื่อทำไฮไลต์สีเมนู
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar เรืองแสง */}
      <nav className="bg-darkPanel border-b border-neonBlue/30 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,243,255,0.05)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="text-xl font-bold tracking-wider cursor-pointer" onClick={() => router.push("/user/discover")}>
            <span className="text-neonBlue drop-shadow-neon">STUDIO</span>
            <span className="text-white">GEAR</span>
          </div>

          {/* Menu Links */}
          <div className="flex items-center gap-8">
            <Link 
              href="/user/discover" 
              className={`font-medium transition-all ${
                isActive("/user/discover") 
                  ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ยืมอุปกรณ์
            </Link>
            <Link 
              href="/user/history" 
              className={`font-medium transition-all ${
                isActive("/user/history") 
                  ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ประวัติของฉัน
            </Link>
            
            {/* เส้นคั่น */}
            <div className="w-px h-6 bg-gray-700"></div>

            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-all font-medium text-sm"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content (เนื้อหาของหน้า discover หรือ history จะมาแทรกตรงนี้) */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}