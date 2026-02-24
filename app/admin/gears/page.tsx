"use client";

import React from 'react';

export default function ManageGears() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
          MANAGE <span className="text-neonBlue">GEARS</span>
        </h1>
        <button className="px-6 py-2 bg-neonBlue text-black font-bold rounded-lg hover:shadow-neon transition-all">
          + เพิ่มอุปกรณ์ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
        <div className="border-2 border-dashed border-gray-700 rounded-2xl h-64 flex flex-col items-center justify-center text-gray-500">
          <p>ส่วนนี้สำหรับแสดงรายการแก้ไขอุปกรณ์</p>
          <p className="text-xs mt-2">(รอเชื่อมต่อระบบ CRUD ในขั้นตอน Database)</p>
        </div>
      </div>
    </div>
  );
}