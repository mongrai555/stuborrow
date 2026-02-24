"use client";
import { useState, useEffect } from "react";

interface Equipment {
  _id: string;
  name: string;
  category: string;
  serialNumber: string;
  imageUrl?: string;
  note?: string;
}

export default function InventoryDashboardPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "http://localhost:3000/equipments";

  const fetchEquipments = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      } else {
        console.error("Failed to fetch equipments.");
      }
    } catch (error) {
      console.error("Error fetching equipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12 text-white bg-background animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
              <div className="w-2 h-10 bg-neonBlue shadow-[0_0_20px_#00f3ff]"></div>
              INVENTORY <span className="text-neonBlue ">GALLERY</span>
            </h1>
            <p className="text-gray-500 text-sm mt-3 ml-6 tracking-wide">
              คลังรายการอุปกรณ์ทั้งหมดของสตูดิโอ
            </p>
          </div>
          
          {/* จำนวนรายการ */}
          {!isLoading && (
            <div className="bg-darkPanel border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total Items</span>
              <span className="text-2xl font-black text-neonBlue">{items.length}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-neonBlue rounded-full animate-spin shadow-[0_0_15px_#00f3ff]"></div>
            <p className="text-gray-500 font-mono text-xs tracking-[0.3em] animate-pulse">
              LOADING INVENTORY...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-darkPanel border border-dashed border-gray-800 rounded-3xl p-32 flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-6 grayscale opacity-20">📦</span>
            <h3 className="text-xl font-bold text-gray-400 mb-2">ไม่พบอุปกรณ์ในคลัง</h3>
            <p className="text-sm text-gray-600">ยังไม่มีการเพิ่มรายการอุปกรณ์ใดๆ ลงในระบบ</p>
          </div>
        ) : (
          /* Grid Layout สำหรับการ์ด */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items.map((item) => (
              <div 
                key={item._id} 
                className="group bg-darkPanel border border-white/5 rounded-3xl overflow-hidden hover:border-neonBlue/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,243,255,0.05)] transition-all duration-300 flex flex-col"
              >
                {/* รูปภาพ (ด้านบน) */}
                <div className="h-56 bg-[#0a0a0a] relative overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-800 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black">
                      <span className="text-4xl mb-2">📷</span>
                      <span className="text-[10px] tracking-widest font-bold">NO IMAGE</span>
                    </div>
                  )}
                  
                  {/* Badge หมวดหมู่ (แปะบนรูป) */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] text-gray-300 border border-white/10 uppercase tracking-widest font-bold shadow-xl">
                    {item.category}
                  </div>
                </div>

                {/* รายละเอียด (ด้านล่าง) */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-black text-gray-100 uppercase tracking-tight mb-1 group-hover:text-neonBlue transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <div className="text-[11px] text-gray-500 font-mono tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    SN: <span className="text-gray-300">{item.serialNumber}</span>
                  </div>

                  {/* เว้นพื้นที่ให้ Note ดันลงไปด้านล่างเสมอ */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                    {item.note ? (
                      <p className="text-[11px] text-gray-400 italic line-clamp-2 leading-relaxed">
                        "{item.note}"
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-700 font-medium uppercase tracking-widest">
                        No additional notes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}