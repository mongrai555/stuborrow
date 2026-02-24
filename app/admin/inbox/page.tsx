"use client";
import { useState, useEffect } from "react";

export default function AdminInboxPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const API_URL = "http://localhost:3000/bookings";

  // ฟังก์ชันดึง Token แบบกลาง
  const getAuthHeader = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    return { "Authorization": `Bearer ${token}` };
  };

  const fetchInboxData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();
      if (!headers) {
        alert("ไม่พบรหัสเข้าใช้งาน กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const res = await fetch(API_URL, { headers });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // ดึงเฉพาะ Pending และ Approved มาโชว์ใน Inbox
          const initialFiltered = data.filter((item: any) => 
            item && (item.status === "Pending" || item.status === "Approved" || item.status === "approved")
          );
          setBookings(initialFiltered);
        }
      } else {
        console.error("Fetch failed with status:", res.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, itemName: string, currentStatus: string) => {
    if (!id) return;

    // แก้ไขตรงนี้: ลองเปลี่ยน 'Approved' เป็น 'approved' (ตัวเล็ก) หากยังขึ้น 400
    const nextStatus = (currentStatus === "Pending" || currentStatus === "pending") ? "Approved" : "Returned";
    
    if (!confirm(`ยืนยันการเปลี่ยนสถานะ [${itemName}] เป็น ${nextStatus}?`)) return;

    try {
      const authHeader = getAuthHeader();
      if (!authHeader) {
        alert("Session หมดอายุ กรุณา Login ใหม่");
        return;
      }

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeader
        },
        body: JSON.stringify({ status: nextStatus })
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("อัปเดตสถานะสำเร็จ");
        fetchInboxData();
      } else {
        // ถ้าขึ้น 400 alert นี้จะบอกสาเหตุที่ Backend บ่นมาครับ
        console.error("Update failed:", result);
        alert(`อัปเดตไม่สำเร็จ (${res.status}): ${result.message || "ข้อมูลไม่ถูกต้องหรือรูปแบบ ID ผิด"}`);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const handleReject = async (id: string, itemName: string) => {
    if (!id || !confirm(`ยืนยันการปฏิเสธคำขอ [${itemName}]?`)) return;
    try {
      const authHeader = getAuthHeader();
      if (!authHeader) return;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader
      });

      if (res.ok) {
        alert("ลบรายการสำเร็จ");
        fetchInboxData();
      } else {
        const result = await res.json().catch(() => ({}));
        alert(`ลบไม่สำเร็จ: ${result.message || "ไม่มีสิทธิ์ลบรายการนี้"}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => { fetchInboxData(); }, []);

  const displayedBookings = bookings.filter(item => 
    item && (filterStatus === "All" || item.status === filterStatus)
  );

  return (
    <div className="min-h-screen p-6 md:p-12 text-white bg-background">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-neonBlue drop-shadow-neon tracking-wide">ADMIN INBOX</h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">จัดการรายการรอยืนยันและรับคืน</p>
          </div>

          <div className="flex items-center gap-3">
            <select 
              className="bg-darkPanel border border-gray-700 rounded-xl px-4 py-2 text-sm focus:border-neonBlue outline-none cursor-pointer text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">ทั้งหมด</option>
              <option value="Pending">รออนุมัติ</option>
              <option value="Approved">กำลังยืม</option>
            </select>
          </div>
        </div>

        {/* List Section */}
        <div className="grid gap-6">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-gray-600 font-mono italic text-sm">
              [ SYSTEM CONNECTING... ]
            </div>
          ) : displayedBookings.length === 0 ? (
            <div className="bg-darkPanel border border-gray-800 rounded-3xl p-20 text-center text-gray-600 italic">
              ไม่พบรายการที่ต้องจัดการในขณะนี้
            </div>
          ) : (
            displayedBookings.map((item) => (
              <div key={item?._id || Math.random()} className="bg-darkPanel border border-white/5 rounded-2xl p-6 flex flex-col gap-4 transition-all hover:bg-white/[0.02]">
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Status Indicator Line */}
                  <div className={`hidden md:block w-1 self-stretch rounded-full ${
                    (item?.status === 'Pending' || item?.status === 'pending') ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-neonBlue shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  }`}></div>

                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                        (item?.status === 'Pending' || item?.status === 'pending') ? 'border-yellow-500/50 text-yellow-500' : 'border-neonBlue/50 text-neonBlue'
                      }`}>
                        {item?.status || "UNKNOWN"}
                      </span>
                      <span className="text-[10px] text-gray-600 font-mono">
                        #{item?._id ? String(item._id).slice(-6).toUpperCase() : "------"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-100 uppercase tracking-tight">
                      {item?.equipment?.name || <span className="text-gray-600 italic font-normal">ไม่มีข้อมูลอุปกรณ์</span>}
                    </h3>
                    
                    {/* 🌟 ปรับปรุง Grid แสดงข้อมูลตรงนี้ 🌟 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-3 text-xs text-gray-400 font-medium">
                      <p>👤 ผู้ยืม: <span className="text-gray-200">{item?.user?.name || "ไม่ระบุชื่อ"}</span></p>
                      <p>📦 S/N: <span className="text-gray-200 font-mono">{item?.equipment?.serialNumber || "-"}</span></p>
                      <p>📅 วันที่รับ: <span className="text-gray-200">
                        {item?.borrowDate ? new Date(item.borrowDate).toLocaleDateString('th-TH') : "-"}
                      </span></p>
                      <p>🔙 วันที่คืน: <span className="text-gray-200">
                        {item?.expectedReturnDate ? new Date(item.expectedReturnDate).toLocaleDateString('th-TH') : "-"}
                      </span></p>
                      <p className="sm:col-span-2">⏰ เวลานัดรับ: <span className="text-neonBlue font-bold">{item?.pickupTime ? `${item.pickupTime} น.` : "ไม่ได้ระบุ"}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => handleUpdateStatus(item?._id, item?.equipment?.name || "อุปกรณ์", item?.status)}
                      className={`flex-1 md:w-40 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all shadow-lg active:scale-95 ${
                        (item?.status === 'Pending' || item?.status === 'pending')
                          ? 'bg-white text-black hover:bg-green-500' 
                          : 'bg-neonBlue text-black shadow-neon hover:bg-cyan-300'
                      }`}
                    >
                      {(item?.status === 'Pending' || item?.status === 'pending') ? 'APPROVE' : 'RECEIVE RETURN'}
                    </button>
                    {(item?.status === 'Pending' || item?.status === 'pending') && (
                      <button 
                        onClick={() => handleReject(item?._id, item?.equipment?.name || "รายการ")} 
                        className="px-4 py-2 text-[10px] font-bold text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      >
                        REJECT
                      </button>
                    )}
                  </div>
                </div>

                {/* 🌟 ปรับกล่องหมายเหตุให้ชัดเจนขึ้นสำหรับ Admin 🌟 */}
                {item?.borrowNote && (
                  <div className="mt-2 p-3 bg-neonBlue/5 border-l-2 border-neonBlue rounded-r-lg">
                    <p className="text-[10px] text-neonBlue uppercase font-black mb-1 tracking-widest">📝 หมายเหตุจากผู้ยืม:</p>
                    <p className="text-xs text-gray-200 italic leading-relaxed">"{item.borrowNote}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}