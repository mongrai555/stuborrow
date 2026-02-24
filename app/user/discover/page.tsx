"use client";
import { useState } from "react";

// Mock Data: ข้อมูลอุปกรณ์ทั้งหมดในคลัง
const allEquipments = [
  { id: 1, name: "Sony A7 IV", category: "Camera", status: "Available", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Canon EOS R6", category: "Camera", status: "Borrowed", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "DJI Ronin RS 3", category: "Stabilizer", status: "Available", image: "https://images.unsplash.com/photo-1622615456247-f7e91eb70a1d?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Godox SL60W", category: "Lighting", status: "Available", image: "https://images.unsplash.com/photo-1582294459828-4444a86f7c9e?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "Rode Wireless GO II", category: "Audio", status: "Available", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop" },
  { id: 6, name: "Zoom H5 Recorder", category: "Audio", status: "Borrowed", image: "https://images.unsplash.com/photo-1596525547514-6ccfb5f9d268?q=80&w=400&auto=format&fit=crop" },
  { id: 7, name: "Aperture Amaran 100d", category: "Lighting", status: "Available", image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=400&auto=format&fit=crop" },
  { id: 8, name: "Tripod Manfrotto", category: "Accessory", status: "Available", image: "https://images.unsplash.com/photo-1527011045970-1aa7a1ccfccb?q=80&w=400&auto=format&fit=crop" },
];

const categories = ["All", "Camera", "Lighting", "Audio", "Stabilizer", "Accessory"];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // ฟังก์ชันกรองอุปกรณ์ตามการค้นหาและหมวดหมู่
  const filteredEquipments = allEquipments.filter((gear) => {
    const matchCategory = activeCategory === "All" || gear.category === activeCategory;
    const matchSearch = gear.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBorrowClick = (gearName: string, status: string) => {
    if (status === "Borrowed") {
      alert(`ขออภัยครับ ${gearName} ถูกยืมไปแล้ว 🥲`);
    } else {
      // อนาคตจะเปลี่ยนเป็นเปิด Modal ยืนยันการยืม
      alert(`เพิ่ม ${gearName} ลงในรายการขอหยิบยืมเรียบร้อย! 🛒`);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-fade-in font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-wide mb-2 flex items-center gap-3">
            <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
            DISCOVER <span className="text-neonBlue drop-shadow-neon">GEAR</span>
          </h1>
          <p className="text-gray-400">ค้นหาและเลือกยืมอุปกรณ์ที่ต้องการสำหรับโปรเจกต์ของคุณ</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-72 relative">
          <input 
            type="text" 
            placeholder="ค้นหาชื่ออุปกรณ์..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-darkPanel border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-800 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? "bg-neonBlue text-black shadow-neon"
                : "bg-darkPanel border border-gray-700 text-gray-400 hover:border-neonBlue hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid อุปกรณ์ */}
      {filteredEquipments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipments.map((gear) => (
            <div 
              key={gear.id} 
              className={`bg-darkPanel border rounded-2xl overflow-hidden flex flex-col transition-all duration-500 group ${
                gear.status === "Available" 
                  ? "border-gray-800 hover:border-neonBlue hover:shadow-neon" 
                  : "border-gray-800 opacity-75" // ลดความสว่างลงถ้าของไม่ว่าง
              }`}
            >
              {/* Image Section */}
              <div className="h-48 w-full relative overflow-hidden bg-gray-900">
                <img 
                  src={gear.image} 
                  alt={gear.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${gear.status === "Available" ? "group-hover:scale-110" : "grayscale"}`} 
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-20">
                  {gear.status === "Available" ? (
                    <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-2 py-1 rounded-md text-xs font-bold backdrop-blur-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                      พร้อมยืม
                    </span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-1 rounded-md text-xs font-bold backdrop-blur-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      ถูกยืมแล้ว
                    </span>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700 text-xs text-gray-300">
                  {gear.category}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-5 relative z-20">
                <h3 className={`text-xl font-bold transition-colors ${gear.status === "Available" ? "text-white group-hover:text-neonBlue" : "text-gray-400"}`}>
                  {gear.name}
                </h3>
                
                {/* ปุ่มยืม */}
                <button 
                  onClick={() => handleBorrowClick(gear.name, gear.status)}
                  disabled={gear.status !== "Available"}
                  className={`w-full py-2.5 rounded-lg font-bold transition-all flex justify-center items-center gap-2 ${
                    gear.status === "Available"
                      ? "bg-transparent border border-neonBlue text-neonBlue hover:bg-neonBlue hover:text-black hover:shadow-neon"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                  }`}
                >
                  {gear.status === "Available" ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      เพิ่มลงตะกร้า
                    </>
                  ) : (
                    "ไม่พร้อมให้บริการ"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* กรณีค้นหาแล้วไม่เจอ */
        <div className="text-center py-20 bg-darkPanel rounded-2xl border border-gray-800">
          <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-300 mb-2">ไม่พบอุปกรณ์ที่คุณค้นหา</h3>
          <p className="text-gray-500">ลองใช้คำค้นหาอื่น หรือเปลี่ยนหมวดหมู่ดูนะ</p>
        </div>
      )}

    </div>
  );
}