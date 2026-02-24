"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock Data: รายการที่นักศึกษากด "คืนอุปกรณ์" แล้ว รอแอดมินยืนยัน
const initialPendingReturns = [
  {
    bookingId: "BK002",
    studentId: "6704101325",
    studentName: "สมชาย ใจดี",
    itemId: "EQ004",
    itemName: "Rode Wireless GO II",
    borrowDate: "2026-02-18",
    returnDate: "2026-02-23", // วันที่กดคืน
    proofImage: "📸 (รูปถ่ายหลักฐานวางไมค์ไว้บนโต๊ะ)", 
    status: "Pending"
  }
];

export default function AdminInboxPage() {
  const router = useRouter();
  const [pendingReturns, setPendingReturns] = useState(initialPendingReturns);

  // ฟังก์ชันเมื่อแอดมินกด "คืนแล้ว" (Approve Return)
  const handleApproveReturn = (bookingId: string, itemName: string) => {
    const confirmApprove = confirm(`ยืนยันการรับคืน ${itemName} ใช่หรือไม่?\nระบบจะเปลี่ยนสถานะของเป็น "ว่าง" และบันทึกประวัติว่า "คืนแล้ว"`);
    
    if (confirmApprove) {
      // เอาออกจากรายการที่ต้องรอยืนยัน
      setPendingReturns(pendingReturns.filter(item => item.bookingId !== bookingId));
      
      // TODO: ยิง API ไปหลังบ้านเพื่อ:
      // 1. อัปเดต Booking Collection ให้ status = "Returned"
      // 2. อัปเดต Item Collection ให้ status = "Available"
      
      alert(`✅ ยืนยันการรับคืน ${itemName} สำเร็จ!`);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-neonBlue drop-shadow-neon tracking-wide">
              ADMIN INBOX
            </h1>
            <p className="text-gray-400 mt-2">รายการรอตรวจสอบและยืนยันการคืนอุปกรณ์</p>
          </div>
        </div>

        {/* Inbox List */}
        {pendingReturns.length === 0 ? (
          <div className="bg-darkPanel border border-gray-800 rounded-xl p-10 text-center">
            <p className="text-gray-500 text-lg">🎉 ไม่มีรายการรอยืนยันในขณะนี้</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingReturns.map((item) => (
              <div key={item.bookingId} className="bg-darkPanel border border-neonBlue/30 shadow-[0_0_15px_rgba(0,243,255,0.1)] rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center transition-all">
                
                {/* Mock รูปภาพหลักฐาน */}
                <div className="w-full md:w-48 h-32 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                  {item.proofImage}
                </div>

                {/* รายละเอียด */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{item.itemName}</h3>
                    <span className="bg-blue-900/30 text-neonBlue border border-neonBlue px-3 py-1 rounded-full text-xs shadow-neon">
                      กำลังรอยืนยัน
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-400">
                    <p>ผู้ยืม: <span className="text-gray-200">{item.studentName} ({item.studentId})</span></p>
                    <p>รหัสรายการ: <span className="text-gray-200">{item.bookingId}</span></p>
                    <p>วันที่ยืม: <span className="text-gray-200">{item.borrowDate}</span></p>
                    <p>วันที่แจ้งคืน: <span className="text-gray-200">{item.returnDate}</span></p>
                  </div>
                </div>

                {/* ปุ่ม Action */}
                <div className="w-full md:w-auto flex flex-col gap-3">
                  <button 
                    onClick={() => handleApproveReturn(item.bookingId, item.itemName)}
                    className="w-full md:w-32 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:shadow-neon-hover hover:bg-cyan-300 transition-all"
                  >
                    คืนแล้ว
                  </button>
                  <button className="w-full md:w-32 py-2 bg-transparent border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm">
                    ปฏิเสธ/รูปไม่ชัด
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}