"use client";
import { useState, useEffect } from "react"; // เพิ่ม useState และ useEffect
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // --- เพิ่ม Logic ดึงจำนวนรายการค้าง ---
  const [inboxCount, setInboxCount] = useState(0);

  const fetchCount = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:3000/bookings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // กรองนับเฉพาะ Pending และ Approved
        const count = data.filter((item: any) => 
          item.status === "Pending" || item.status === "Approved"
        ).length;
        setInboxCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch inbox count", err);
    }
  };

  useEffect(() => {
    fetchCount(); // ดึงครั้งแรกที่โหลด
    const interval = setInterval(fetchCount, 30000); // อัปเดตทุก 30 วินาที
    return () => clearInterval(interval);
  }, [pathname]); // รีเช็คทุกครั้งที่เปลี่ยนหน้า
  // ----------------------------------

  const handleLogout = () => {
    const confirmLogout = confirm("ต้องการออกจากระบบ Admin ใช่หรือไม่?");
    if (confirmLogout) {
      localStorage.clear(); // ล้าง token ออกด้วย
      router.push("/");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="bg-darkPanel border-b border-neonBlue/40 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,243,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="text-xl font-bold tracking-wider cursor-pointer flex items-center gap-2" onClick={() => router.push("/admin/dashboard")}>
            <span className="text-neonBlue drop-shadow-neon">STUDIO</span>
            <span className="text-white">ADMIN</span>
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-sm animate-pulse tracking-widest">CS</span>
          </div>

          {/* Menu Links */}
          <div className="flex items-center gap-5 text-sm md:text-[13px] lg:text-base">
            <Link
              href="/admin/dashboard"
              className={`font-medium transition-all ${isActive("/admin/dashboard") ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" : "text-gray-400 hover:text-white"}`}
            >
              คลังอุปกรณ์
            </Link>

            <Link
              href="/admin/inbox"
              className={`font-medium transition-all relative ${isActive("/admin/inbox") ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" : "text-gray-400 hover:text-white"}`}
            >
              ตรวจรับของ
              {/* แสดง Badge เฉพาะเมื่อมีรายการค้างจริง (มากกว่า 0) */}
              {inboxCount > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  {inboxCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/bookings" // แก้ path จาก /admin/bookings เป็น /admin/booking ตามโครงสร้างที่คุณใช้จริง
              className={`font-medium transition-all ${isActive("/admin/bookings") ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" : "text-gray-400 hover:text-white"}`}
            >
              ประวัติการยืม
            </Link>

            <Link
              href="/admin/equipments"
              className={`font-medium transition-all ${isActive("/admin/equipments") ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" : "text-gray-400 hover:text-white"}`}
            >
              จัดการอุปกรณ์
            </Link>

            <Link
              href="/admin/user"
              className={`font-medium transition-all ${isActive("/admin/user") ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1" : "text-gray-400 hover:text-white"}`}
            >
              จัดการผู้ใช้
            </Link>

            <div className="w-px h-6 bg-gray-700 ml-2"></div>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500 hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-all font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}