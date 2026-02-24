"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
  const router = useRouter();
  
  // ---------------- STATE จัดการข้อมูล ----------------
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- STATE จัดการ Modal ----------------
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // ---------------- STATE จัดการ Form ----------------
  const [formData, setFormData] = useState({
    borrowDate: "",
    expectedReturnDate: "",
    pickupTime: "",
    borrowNote: "", // 🟢 1. เพิ่ม borrowNote ใน State
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. ฟังก์ชันเปิดกล่องยืมของ
  const openBorrowModal = (product: any) => {
    const token = getToken();
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการยืมอุปกรณ์");
      router.push("/");
      return;
    }
    setSelectedProduct(product);
    // รีเซ็ตค่าฟอร์มทุกครั้งที่เปิด (เพิ่ม borrowNote ด้วย)
    setFormData({ borrowDate: "", expectedReturnDate: "", pickupTime: "", borrowNote: "" });
    setIsBorrowModalOpen(true);
  };

  // 3. ฟังก์ชันกดยืนยันการยืม (POST)
  const handleBorrowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🌟 1. ดักเช็คหมายเหตุก่อนยิง API 🌟
    const note = formData.borrowNote.trim(); // ตัดช่องว่างหัวท้ายทิ้ง
    
    if (!note) {
      alert("กรุณาระบุหมายเหตุการยืมด้วยครับ");
      return; // หยุดการทำงาน ไม่ส่ง API
    }

    if (note.length < 5) {
      alert("กรุณาระบุรายละเอียดหมายเหตุให้ชัดเจนกว่านี้ (อย่างน้อย 5 ตัวอักษร)");
      return;
    }

    // Regex: อนุญาตแค่ ก-๙, a-z, A-Z, 0-9 และช่องว่าง
    const noteRegex = /^[a-zA-Z0-9ก-๙\s]+$/; 
    if (!noteRegex.test(note)) {
      alert("หมายเหตุไม่อนุญาตให้ใช้อักษรพิเศษ (ห้ามใส่ @#$%ฯลฯ)");
      return;
    }

    try {
      const token = getToken();
      
      const payload = {
        equipmentId: selectedProduct._id,
        borrowDate: formData.borrowDate,
        expectedReturnDate: formData.expectedReturnDate,
        pickupTime: formData.pickupTime, 
        borrowNote: note, // ใช้ตัวแปร note ที่เรา .trim() มาแล้ว
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
        alert("ส่งคำขอยืมสำเร็จ! สามารถตรวจสอบสถานะได้ที่ 'ประวัติการยืม'");
        setIsBorrowModalOpen(false);
        fetchProducts(); // รีเฟรชข้อมูลสินค้าใหม่ (อาจมีการเปลี่ยนสถานะ)
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = Array.isArray(errorData.message) 
          ? errorData.message.join(", ") 
          : errorData.message;
        alert(`ไม่สามารถยืมได้: ${errorMsg || "ข้อมูลไม่ถูกต้อง"}`);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="flex flex-col text-white font-sans">
      
      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        
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
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-darkPanel border-t border-gray-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-600 font-mono tracking-widest uppercase">
          © 2026 STUDIO EQUIPMENT SYSTEM. ALL RIGHTS RESERVED.
        </div>
      </footer>


      {/* ================= MODAL: ฟอร์มยืมของ ================= */}
      {isBorrowModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-darkPanel border border-neonBlue/50 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,243,255,0.15)] animate-fade-in">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-black text-neonBlue uppercase tracking-wide">ระบุรายละเอียดการยืม</h2>
              <button type="button" onClick={() => setIsBorrowModalOpen(false)} className="text-gray-500 hover:text-white text-xl font-bold">✕</button>
            </div>
            
            <form onSubmit={handleBorrowSubmit} className="p-6 flex flex-col gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-gray-800 mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">อุปกรณ์ที่เลือก:</p>
                <p className="text-lg font-bold text-white">{selectedProduct.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">วันที่ยืม *</label>
                  <input type="date" required className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-neonBlue outline-none transition-colors" 
                    value={formData.borrowDate} onChange={e => setFormData({...formData, borrowDate: e.target.value})} />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">วันที่คืน *</label>
                  <input type="date" required className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-neonBlue outline-none transition-colors" 
                    value={formData.expectedReturnDate} onChange={e => setFormData({...formData, expectedReturnDate: e.target.value})} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">เวลานัดรับ (Pickup Time) *</label>
                <input type="time" required className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-neonBlue outline-none transition-colors" 
                  value={formData.pickupTime} onChange={e => setFormData({...formData, pickupTime: e.target.value})} />
              </div>

              {/* 🟢 3. เพิ่ม Input สำหรับ borrowNote */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">หมายเหตุ (ถ้ามี)</label>
                <textarea
                required
                maxLength={500}
                  rows={2}
                  className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-neonBlue outline-none transition-colors resize-none" 
                  placeholder="เช่น ถ่ายทำโปรเจคปี 4, คืนเลทนิดหน่อย..."
                  value={formData.borrowNote} 
                  onChange={e => setFormData({...formData, borrowNote: e.target.value})} 
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setIsBorrowModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all uppercase tracking-widest">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-black text-xs bg-neonBlue text-black hover:bg-cyan-300 transition-all shadow-neon uppercase tracking-widest">ยืนยันการยืม</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}