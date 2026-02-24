"use client";

import React, { useState, useEffect } from 'react';

// กำหนด Interface เพื่อให้ TypeScript ไม่งอแง (และช่วยให้เราจำได้ว่ามี Field อะไรบ้าง)
interface GearItem {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'borrowed' | 'broken';
}

export default function ManageGears() {
  const [gears, setGears] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลจาก Backend (ยึดหลังบ้านเป็นหลัก)
  useEffect(() => {
    const fetchGears = async () => {
      try {
        // เปลี่ยน URL เป็น Path ของหลังบ้านคุณ เช่น http://localhost:5000/api/gears
        const response = await fetch('http://localhost:5000/api/gears'); 
        const data = await response.json();
        setGears(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch gears:", error);
        setLoading(false);
      }
    };

    fetchGears();
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-2 h-8 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
          MANAGE <span className="text-cyan-400">GEARS</span>
        </h1>
        
        {/* ปุ่มเพิ่มอุปกรณ์ (ในอนาคตเชื่อมกับ Modal) */}
        <button className="px-6 py-2 bg-cyan-400 text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all active:scale-95">
          + เพิ่มอุปกรณ์ใหม่
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">กำลังดึงข้อมูลจากฐานข้อมูล...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gears.length > 0 ? (
            gears.map((item) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-cyan-400/50 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
                    item.status === 'available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {item.status === 'available' ? 'พร้อมใช้งาน' : 'ถูกยืม'}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg text-sm">แก้ไข</button>
                  <button className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 py-2 rounded-lg text-sm">ลบ</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full border-2 border-dashed border-gray-800 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-500">
              <p>ไม่พบข้อมูลอุปกรณ์ในระบบ</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}