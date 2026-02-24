"use client";
import { useState } from "react";

export default function HistoryPage() {
  // Mock ประวัติการยืม
  const [myBookings, setMyBookings] = useState([
    { id: "B001", gear: "Sony A7 IV", date: "2024-03-20", status: "PENDING" },
    { id: "B002", gear: "DJI Ronin RS 3", date: "2024-03-15", status: "APPROVED" },
    { id: "B003", gear: "Godox SL60W", date: "2024-03-10", status: "RETURNED" },
  ]);

  const cancelBooking = (id: string) => {
    if (confirm("คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?")) {
      setMyBookings(myBookings.filter(b => b.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
        MY <span className="text-neonBlue">HISTORY</span>
      </h1>

      <div className="bg-darkPanel border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-sm uppercase">
              <th className="p-4 font-semibold">อุปกรณ์</th>
              <th className="p-4 font-semibold">วันที่</th>
              <th className="p-4 font-semibold">สถานะ</th>
              <th className="p-4 font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {myBookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{b.gear}</td>
                <td className="p-4 text-gray-400">{b.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                      b.status === "APPROVED" ? "bg-green-500/20 text-green-500" :
                        "bg-gray-500/20 text-gray-400"
                    }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4">
                  {b.status === "PENDING" && (
                    <button onClick={() => cancelBooking(b.id)} className="text-red-400 hover:text-red-300 text-sm underline transition-all">
                      ยกเลิกจอง
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} //อันนี้คือที่มีอยู่