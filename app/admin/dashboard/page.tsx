"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([
    { id: 1, user: "สมชาย รักษ์ดี", gear: "Sony A7 IV", type: "BORROW", status: "PENDING" },
    { id: 2, user: "สมหญิง สายลุย", gear: "Canon EOS R6", type: "RETURN", status: "PENDING" },
  ]);

  const handleAction = (id: number, action: string) => {
    alert(`ทำการ ${action} รายการที่ ${id} เรียบร้อย (Mock Action)`);
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <div className="w-2 h-8 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
        ADMIN <span className="text-purple-500">REQUESTS</span>
      </h1>

      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-darkPanel border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-purple-500/50 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.type === "BORROW" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"}`}>
                  {req.type}
                </span>
                <span className="text-gray-500 text-xs">ID: #{req.id}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{req.user}</h3>
              <p className="text-gray-400 text-sm">ต้องการ{req.type === "BORROW" ? "ยืม" : "คืน"}: <span className="text-purple-400">{req.gear}</span></p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => handleAction(req.id, "REJECT")} className="flex-1 md:px-6 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">ปฏิเสธ</button>
              <button onClick={() => handleAction(req.id, "APPROVE")} className="flex-1 md:px-6 py-2 rounded-lg bg-purple-500 text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">อนุมัติ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}