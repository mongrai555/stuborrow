"use client";
import { useState, useEffect } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000/bookings"; 

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        
        // --- ส่วนที่เพิ่มเข้ามา: เรียงลำดับข้อมูล (Sort) ---
        // เรียงจากอัปเดตล่าสุดไปเก่าสุด (โดยใช้ updatedAt หรือ borrowDate)
        const sortedData = data.sort((a: any, b: any) => {
          const dateA = new Date(a.updatedAt || a.borrowDate).getTime();
          const dateB = new Date(b.updatedAt || b.borrowDate).getTime();
          return dateB - dateA; // เอาค่ามาก (ใหม่สุด) ไว้บนสุด
        });

        setBookings(sortedData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full text-white">
      <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
        <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
        BOOKINGS <span className="text-neonBlue">HISTORY</span>
      </h1>

      <div className="bg-darkPanel border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/80 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-800">
                <th className="p-6 whitespace-nowrap">ผู้ยืม (User)</th>
                <th className="p-6 whitespace-nowrap">อุปกรณ์ (Equipment)</th>
                <th className="p-6 whitespace-nowrap">วันที่ยืม (Borrow Date)</th>
                <th className="p-6 text-center whitespace-nowrap">สถานะ (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center animate-pulse text-gray-500 font-mono text-sm tracking-widest">
                    LOADING DATA...
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* แสดงชื่อผู้ใช้ */}
                    <td className="p-6">
                      <div className="font-bold text-gray-100 group-hover:text-neonBlue transition-colors">
                        {item.user?.name || item.user?.firstName || <span className="text-gray-600 italic">ไม่มีข้อมูลผู้ใช้</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-1">
                        ID: {item.user?.studentId || "---"}
                      </div>
                    </td>

                    {/* แสดงชื่ออุปกรณ์ */}
                    <td className="p-6">
                      <div className="text-sm text-gray-200 font-semibold line-clamp-1">
                        {item.equipment?.name || <span className="text-gray-600 italic">ไม่ระบุอุปกรณ์</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono mt-1">
                        S/N: {item.equipment?.serialNumber || "---"}
                      </div>
                    </td>

                    {/* วันที่ยืม */}
                    <td className="p-6 text-xs text-gray-400">
                      {item.borrowDate ? new Date(item.borrowDate).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      }) : "-"}
                    </td>

                    {/* สถานะ */}
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        item.status === 'Returned' || item.status === 'returned'
                          ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                          : item.status === 'Approved' || item.status === 'approved'
                          ? 'border-neonBlue/30 text-neonBlue bg-neonBlue/10'
                          : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'
                      }`}>
                        {item.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-600 italic">
                    ไม่มีรายการในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}