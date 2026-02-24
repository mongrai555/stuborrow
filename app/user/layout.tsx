"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // ================= STATES สำหรับ History Modal =================
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // 🌟 1. เพิ่ม STATE สำหรับเก็บชื่อผู้ใช้ 🌟
  const [userName, setUserName] = useState<string>("Loading...");

  const API_BOOKINGS = "http://localhost:3000/bookings";
  const API_USER = "http://localhost:3000/users/me";
   // 💡 เปลี่ยนเป็น Endpoint ดึงข้อมูล User ของคุณ (เช่น /auth/profile)

  // 🌟 2. ดึงข้อมูล User Profile เมื่อหน้าเว็บโหลด 🌟
  // 🌟 2. ดึงข้อมูล User Profile โดยการ "ถอดรหัส Token" (ไม่ต้องยิง API) 🌟
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      setUserName("Guest");
      return;
    }

    try {
      // 1. JWT จะมี 3 ส่วนคั่นด้วยจุด (.) เราจะเอาส่วนที่ 2 (Payload) มาใช้
      const payloadBase64 = token.split('.')[1];
      
      // 2. ถอดรหัส Base64 ให้กลับมาเป็น String JSON
      // (ใช้ atob ตรงๆ อาจมีปัญหาเรื่องภาษาไทย เลยต้องใช้ decodeURIComponent ช่วยครับ)
      const decodedJson = decodeURIComponent(
        atob(payloadBase64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      // 3. แปลงเป็น Object
      const payload = JSON.parse(decodedJson);
      
      console.log("ข้อมูลที่แอบแกะได้จาก Token:", payload); // 👈 ลองกด F12 ดูว่ามันมีตัวแปรชื่ออะไรบ้าง

      // 4. เอาข้อมูลมาแสดง (ลองเดาชื่อฟิลด์ยอดฮิต ถ้าไม่ใช่ต้องเปลี่ยนให้ตรงกับใน Console นะครับ)
      const displayName = payload.name || payload.username || payload.email?.split('@')[0] || "My Profile";
      
      setUserName(displayName);

    } catch (err) {
      console.error("ถอดรหัส Token ไม่สำเร็จ:", err);
      setUserName("My Profile");
    }
  }, []);

  // ฟังก์ชันดึงประวัติการยืมเฉพาะของผู้ใช้ (ใช้ /me)
  const fetchMyBookings = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(`${API_BOOKINGS}/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        const bookingsArray = Array.isArray(data) ? data : [];
        console.log("ข้อมูล User ที่ได้จาก Backend:", data);

        // จัดเรียงข้อมูลให้รายการที่เพิ่งอัปเดตล่าสุดอยู่บนสุด
        const sortedData = bookingsArray.sort((a: any, b: any) => {
          const dateA = new Date(a.updatedAt || a.borrowDate).getTime();
          const dateB = new Date(b.updatedAt || b.borrowDate).getTime();
          return dateB - dateA;
        });

        setMyBookings(sortedData);
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ฟังก์ชันเปิดกล่องและโหลดข้อมูล
  const openHistoryModal = () => {
    setIsHistoryModalOpen(true);
    fetchMyBookings(); 
  };

  // ฟังก์ชันยกเลิกการยืม
  const handleCancelBooking = async (id: string) => {
    if (!confirm("คุณต้องการยกเลิกคำขอยืมนี้ใช่หรือไม่?")) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BOOKINGS}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        alert("ยกเลิกคำขอสำเร็จ");
        fetchMyBookings(); 
      } else {
        alert("ไม่สามารถยกเลิกคำขอได้");
      }
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  const handleLogout = () => {
    const confirmLogout = confirm("ต้องการออกจากระบบใช่หรือไม่?");
    if (confirmLogout) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      router.push("/");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-darkPanel/90 backdrop-blur-md border-b border-neonBlue/30 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,243,255,0.05)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link href="/user/discover" className="text-2xl font-black tracking-widest flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
            <span className="text-neonBlue drop-shadow-neon">STUDIO</span>
            <span className="text-white">GEAR</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/user/discover"
              className={`font-bold text-sm tracking-widest uppercase transition-all ${isActive("/user/discover")
                ? "text-neonBlue drop-shadow-neon border-b-2 border-neonBlue pb-1"
                : "text-gray-400 hover:text-white"
                }`}
            >
              ยืมอุปกรณ์
            </Link>

            <div className="hidden md:block w-px h-6 bg-gray-700 mx-2"></div>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  {/* 🌟 3. นำตัวแปร userName มาแสดงตรงนี้ พร้อมใช้ truncate ป้องกันชื่อยาวเกิน 🌟 */}
                  <p className="text-sm font-bold text-neonBlue truncate max-w-[150px]">{userName}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">User Online</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-neonBlue flex items-center justify-center shadow-[0_0_10px_rgba(0,243,255,0.3)] text-lg">
                  👤
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-darkPanel border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right overflow-hidden">
                <div className="p-2 flex flex-col gap-1">

                  <button
                    onClick={openHistoryModal}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/5 hover:text-neonBlue rounded-lg transition-colors flex items-center gap-2"
                  >
                    🕒 ประวัติการยืม
                  </button>

                  <div className="h-px bg-gray-700 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors flex items-center gap-2"
                  >
                    🚪 ออกจากระบบ
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>

      {/* ================= MODAL: ประวัติการยืม (History) ================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-darkPanel border border-neonBlue/30 rounded-3xl w-full max-w-3xl overflow-hidden shadow-[0_0_40px_rgba(0,243,255,0.1)] flex flex-col max-h-[85vh] animate-fade-in">

            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wide">My Bookings</h2>
                <p className="text-xs text-neonBlue tracking-widest uppercase mt-1">ประวัติคำขอยืมของคุณ</p>
              </div>
              <button
                onClick={() => {
                  setIsHistoryModalOpen(false); 
                  window.dispatchEvent(new Event("refreshEquipments")); 
                }}
                className="text-gray-500 hover:text-white text-2xl font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-900/50">
              {loadingHistory ? (
                <div className="text-center py-20 text-neonBlue/50 animate-pulse font-mono tracking-widest text-sm">LOADING HISTORY...</div>
              ) : myBookings.length === 0 ? (
                <div className="text-center py-20 text-gray-600 italic">คุณยังไม่มีประวัติการยืมอุปกรณ์</div>
              ) : (
                <div className="grid gap-4">
                  {myBookings.map((booking) => (
                    <div key={booking?._id || Math.random()} className="bg-darkPanel border border-gray-700 hover:border-gray-500 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden transition-all group">

                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking?.status?.toLowerCase() === 'returned' ? 'bg-green-500' :
                        booking?.status?.toLowerCase() === 'approved' ? 'bg-neonBlue' : 'bg-yellow-500'
                        }`}></div>

                      <div className="flex-1 w-full pl-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${booking?.status?.toLowerCase() === 'returned' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                            booking?.status?.toLowerCase() === 'approved' ? 'border-neonBlue/50 text-neonBlue bg-neonBlue/10' :
                              'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
                            }`}>
                            {booking?.status || "Unknown"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">#{String(booking?._id).slice(-6)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-neonBlue transition-colors">{booking?.equipment?.name || "อุปกรณ์ที่ยืม"}</h3>
                        <p className="text-xs text-gray-400 mt-2 font-mono">
                          ยืม: {booking?.borrowDate ? new Date(booking.borrowDate).toLocaleDateString('th-TH') : '-'} <span className="mx-1 text-gray-600">|</span>
                          คืน: {booking?.expectedReturnDate ? new Date(booking.expectedReturnDate).toLocaleDateString('th-TH') : '-'}
                        </p>

                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          เวลานัดรับ: <span className="text-neonBlue">{booking?.pickupTime ? `${booking.pickupTime} น.` : 'ไม่ได้ระบุ'}</span>
                        </p>

                        {booking?.borrowNote && (
                          <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/5 inline-block w-full sm:w-auto">
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">หมายเหตุ:</p>
                            <p className="text-xs text-gray-300 italic">{booking.borrowNote}</p>
                          </div>
                        )}
                      </div>

                      {booking?.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-[10px] border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest shadow-lg"
                        >
                          ยกเลิกการยืม
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}