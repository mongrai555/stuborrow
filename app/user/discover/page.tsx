"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DiscoverPage() {
  const router = useRouter();
  
  // ---------------- STATE จัดการข้อมูล ----------------
  const [products, setProducts] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- STATE จัดการ Modal ----------------
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // ---------------- STATE จัดการ Form ----------------
  // ปรับให้ตรงกับ DTO: มีแค่วันที่ยืม และ วันที่คืน
  const [formData, setFormData] = useState({
    borrowDate: "",
    expectedReturnDate: "",
  });

  const API_PRODUCTS = "http://localhost:3000/equipments";
  const API_BOOKINGS = "http://localhost:3000/bookings";

  // ดึง Token
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // 1. ดึงข้อมูลสินค้าทั้งหมด
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_PRODUCTS);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. ดึงประวัติการยืมของผู้ใช้
  const fetchMyBookings = async () => {
    try {
      const token = getToken();
      if (!token) return;
      // Use the /me route to get bookings for the current user
      const res = await fetch(`${API_BOOKINGS}/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMyBookings();
  }, []);

  // 3. ฟังก์ชันเปิดกล่องยืมของ
  const openBorrowModal = (product: any) => {
    const token = getToken();
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการยืมอุปกรณ์");
      router.push("/");
      return;
    }
    setSelectedProduct(product);
    // รีเซ็ตค่าฟอร์ม
    setFormData({ borrowDate: "", expectedReturnDate: "" });
    setIsBorrowModalOpen(true);
  };

  // 4. ฟังก์ชันกดยืนยันการยืม (POST) - ส่งข้อมูลตาม DTO เป๊ะๆ
  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getToken();
      
      // Payload นี้ตรงกับ CreateBookingDto 100%
      const payload = {
        equipmentId: selectedProduct._id,
        borrowDate: formData.borrowDate,
        expectedReturnDate: formData.expectedReturnDate,
      };

      const res = await fetch(API_BOOKINGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("ส่งคำขอยืมสำเร็จ! รายการของคุณอยู่ในประวัติการยืมแล้ว");
        setIsBorrowModalOpen(false);
        fetchMyBookings(); // โหลดประวัติใหม่ทันที
      } else {
        const errorData = await res.json().catch(() => ({}));
        // แปลง Array Error จาก Class Validator ให้อ่านง่าย
        const errorMsg = Array.isArray(errorData.message) 
          ? errorData.message.join(", ") 
          : errorData.message;
        alert(`ไม่สามารถยืมได้: ${errorMsg || "ข้อมูลไม่ถูกต้อง"}`);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  // 5. ฟังก์ชันยกเลิกการยืม (DELETE)
  const handleCancelBooking = async (id: string) => {
    if (!confirm("คุณต้องการยกเลิกคำขอยืมนี้ใช่หรือไม่?")) return;
    try {
      const token = getToken();
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

  // 6. ฟังก์ชัน Logout
  const handleLogout = () => {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white font-sans">
      
      {/* ================= NAVBAR ================= */}
      <nav className="bg-darkPanel/80 backdrop-blur-md border-b border-neonBlue/40 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,243,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/discover" className="text-2xl font-black tracking-widest flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
            <span className="text-neonBlue drop-shadow-neon">STUDIO</span>
            <span className="text-white">EQUIPMENT</span>
          </Link>

          <div className="relative group">
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-neonBlue">My Profile</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">User Online</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-neonBlue flex items-center justify-center shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                👤
              </div>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-darkPanel border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-gray-200 hover:bg-white/5 hover:text-neonBlue rounded-lg transition-colors"
                >
                  🕒 ประวัติการยืม
                </button>
                <div className="h-px bg-gray-700 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wide uppercase mb-2">
            Explore <span className="text-neonBlue drop-shadow-neon">Equipments</span>
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">เลือกอุปกรณ์ที่ต้องการใช้งานจากคลังของเรา</p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="p-20 text-center animate-pulse text-neonBlue/50 font-mono tracking-widest">CONNECTING TO DATABASE...</div>
        ) : products.length === 0 ? (
          <div className="bg-darkPanel border border-dashed border-gray-800 rounded-3xl p-20 text-center text-gray-600 italic">ไม่พบสินค้าในระบบ</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((item) => (
              <div key={item?._id || Math.random()} className="bg-darkPanel border border-white/5 rounded-3xl overflow-hidden hover:border-neonBlue/40 transition-all hover:shadow-[0_10px_30px_rgba(0,243,255,0.08)] flex flex-col group">
                
                <div className="aspect-video bg-gray-900 relative overflow-hidden flex items-center justify-center">
                  {item?.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-gray-700 font-mono text-xs tracking-widest">NO IMAGE</span>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      item?.status === 'Available' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'
                    }`}>
                      {item?.status || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-100 mb-2">{item?.name || "ไม่ระบุชื่อ"}</h3>
                  <p className="text-xs text-gray-400 italic line-clamp-2 mb-4 flex-1">
                    {item?.note || item?.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                  </p>
                  
                  <button 
                    onClick={() => openBorrowModal(item)}
                    disabled={item?.status !== 'Available'}
                    className={`w-full py-3 rounded-xl font-black text-xs tracking-widest uppercase transition-all ${
                      item?.status === 'Available' 
                        ? 'bg-neonBlue text-black shadow-neon hover:bg-cyan-300 hover:scale-[1.02]' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item?.status === 'Available' ? 'ยืมใช้งาน' : 'ไม่พร้อมใช้งาน'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-darkPanel border-t border-gray-800 py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-600 font-mono tracking-widest uppercase">
          © 2026 STUDIO EQUIPMENT SYSTEM. ALL RIGHTS RESERVED.
        </div>
      </footer>


      {/* ================= MODAL: ฟอร์มยืมของ ================= */}
      {isBorrowModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-darkPanel border border-neonBlue/50 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,243,255,0.15)] animate-fade-in">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-black text-neonBlue uppercase tracking-wide">ระบุวันที่ต้องการยืม</h2>
              <button onClick={() => setIsBorrowModalOpen(false)} className="text-gray-500 hover:text-white text-xl font-bold">✕</button>
            </div>
            
            <form onSubmit={handleBorrowSubmit} className="p-6 flex flex-col gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-gray-800 mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">อุปกรณ์ที่เลือก:</p>
                <p className="text-lg font-bold text-white">{selectedProduct.name}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">วันที่ยืม (Borrow Date) *</label>
                <input type="date" required className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-neonBlue outline-none transition-colors" 
                  value={formData.borrowDate} onChange={e => setFormData({...formData, borrowDate: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">วันที่คาดว่าจะคืน (Return Date) *</label>
                <input type="date" required className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-neonBlue outline-none transition-colors" 
                  value={formData.expectedReturnDate} onChange={e => setFormData({...formData, expectedReturnDate: e.target.value})} />
              </div>

              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setIsBorrowModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all uppercase tracking-widest">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-black text-xs bg-neonBlue text-black hover:bg-cyan-300 transition-all shadow-neon uppercase tracking-widest">ยืนยันการยืม</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL: ประวัติการยืม (History) ================= */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-darkPanel border border-gray-700 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-wide">My Bookings</h2>
                <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">ประวัติคำขอยืมของคุณ</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-500 hover:text-white text-2xl font-bold">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-900/50">
              {myBookings.length === 0 ? (
                <div className="text-center py-10 text-gray-600 italic">คุณยังไม่มีประวัติการยืมอุปกรณ์</div>
              ) : (
                <div className="grid gap-4">
                  {myBookings.map((booking) => (
                    <div key={booking?._id || Math.random()} className="bg-darkPanel border border-gray-700 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking?.status?.toLowerCase() === 'pending' ? 'bg-yellow-500' : booking?.status?.toLowerCase() === 'approved' ? 'bg-green-500' : 'bg-neonBlue'}`}></div>
                      
                      <div className="flex-1 w-full pl-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                            booking?.status?.toLowerCase() === 'pending' ? 'border-yellow-500/50 text-yellow-500' : 
                            booking?.status?.toLowerCase() === 'approved' ? 'border-green-500/50 text-green-500' :
                            'border-neonBlue/50 text-neonBlue'
                          }`}>
                            {booking?.status || "Unknown"}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">#{String(booking?._id).slice(-6)}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{booking?.equipment?.name || "อุปกรณ์ที่ยืม"}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          ยืม: {booking?.borrowDate ? new Date(booking.borrowDate).toLocaleDateString('th-TH') : '-'} | 
                          คืน: {booking?.expectedReturnDate ? new Date(booking.expectedReturnDate).toLocaleDateString('th-TH') : '-'}
                        </p>
                      </div>

                      {booking?.status?.toLowerCase() === 'pending' && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-[10px] border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
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