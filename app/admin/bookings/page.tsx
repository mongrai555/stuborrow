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
        setBookings(data);
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
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-900/80 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-800">
              <th className="p-6">ผู้ยืม (User)</th>
              <th className="p-6">อุปกรณ์ (Equipment)</th>
              <th className="p-6">วันที่ยืม (Borrow Date)</th>
              <th className="p-6 text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center animate-pulse text-gray-500">กำลังโหลด...</td></tr>
            ) : bookings.length > 0 ? (
              bookings.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-all">
                  {/* แสดงชื่อผู้ใช้จาก item.user.name */}
                  <td className="p-6">
                    <div className="font-bold text-gray-100">
                      {item.user?.name || <span className="text-gray-600 italic">ไม่มีข้อมูลผู้ใช้</span>}
                    </div>
                    <div className="text-[10px] text-neonBlue/70">
                      {item.user?.department || "-"}
                    </div>
                  </td>

                  {/* แสดงชื่ออุปกรณ์จาก item.equipment.name */}
                  <td className="p-6">
                    <div className="text-sm text-gray-200 font-semibold">
                      {item.equipment?.name || <span className="text-gray-600 italic">ไม่ระบุอุปกรณ์</span>}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {item.equipment?.serialNumber || ""}
                    </div>
                  </td>

                  {/* วันที่ยืม */}
                  <td className="p-6 text-xs text-gray-400">
                    {item.borrowDate ? new Date(item.borrowDate).toLocaleDateString('th-TH') : "-"}
                  </td>

                  {/* สถานะ */}
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded text-[9px] font-black uppercase border ${
                      item.status === 'Returned' 
                        ? 'border-green-500/40 text-green-400 bg-green-500/5' 
                        : 'border-yellow-500/40 text-yellow-500 bg-yellow-500/5'
                    }`}>
                      {item.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-20 text-center text-gray-600 italic">ไม่มีรายการในระบบ</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}