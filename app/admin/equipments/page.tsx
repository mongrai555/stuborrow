"use client";
import { useState, useEffect } from "react";

// กำหนด Schema ให้ตรงกับหลังบ้าน
interface Equipment {
  _id?: string;
  name: string;
  category: string;
  serialNumber: string;
  status: "Available" | "Borrowed" | "Maintenance" | "Disabled";
  imageUrl?: string;
  note?: string;
}

export default function EquipmentManagement() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Default Form State
  const initialForm: Equipment = {
    name: "",
    category: "Camera",
    serialNumber: "",
    status: "Available",
    imageUrl: "",
    note: "",
  };
  const [form, setForm] = useState<Equipment>(initialForm);

  const API_URL = "http://localhost:3000/equipments";

  // ฟังก์ชันช่วยเหลือสำหรับดึง Token เพื่อแนบไปกับ Header
  const getAuthHeaders = () => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  // 1. ดึงข้อมูลทั้งหมด (GET)
  const fetchEquipments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(), // แนบ Token
      });
      
      if (res.ok) {
        const data = await res.json();
        // เรียงลำดับให้อันล่าสุดอยู่ด้านบน
        const sortedData = Array.isArray(data) ? [...data].reverse() : data;
        setItems(sortedData);
      } else {
        console.error("Failed to fetch equipments. Token might be invalid or expired.");
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

  // 2. บันทึกข้อมูล (POST สำหรับสร้างใหม่ / PATCH สำหรับแก้ไข)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    // --- แก้ไข: สร้าง Payload ใหม่ที่ดึงเฉพาะฟิลด์ที่ต้องการ โดยไม่ให้มี _id ---
    const payload = {
      name: form.name,
      category: form.category,
      serialNumber: form.serialNumber,
      status: form.status,
      imageUrl: form.imageUrl || "", // เผื่อกรณีไม่ได้กรอก ให้เป็น String ว่าง
      note: form.note || ""
    };

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(), // แนบ Token ด้วยเสมอเมื่อจะเพิ่ม/แก้ไข
        body: JSON.stringify(payload), // ส่ง payload ที่คลีนแล้ว
      });

      if (res.ok) {
        alert(editingId ? "แก้ไขอุปกรณ์สำเร็จ!" : "เพิ่มอุปกรณ์สำเร็จ!");
        closeModal();
        fetchEquipments(); // โหลดข้อมูลใหม่
      } else {
        const err = await res.json().catch(() => ({}));
        
        // กรณี Unauthorized (401, 403)
        if (res.status === 401 || res.status === 403) {
          alert("ไม่ได้รับอนุญาต (Unauthorized) กรุณาเข้าสู่ระบบใหม่ในฐานะ Admin");
        } else {
          // แจ้ง Error ละเอียดขึ้น (เพื่อวิเคราะห์ปัญหา 400)
          const errorMsg = Array.isArray(err.message) ? err.message.join(", ") : err.message;
          alert(`เกิดข้อผิดพลาด (${res.status}): ${errorMsg || "ไม่สามารถบันทึกข้อมูลได้"}`);
        }
      }
    } catch (error) {
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    }
  };

  // 3. ลบข้อมูล (DELETE)
  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์นี้? ข้อมูลจะไม่สามารถกู้คืนได้")) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(), // แนบ Token เพื่อยืนยันสิทธิ์ลบ
        });

        if (res.ok) {
          alert("ลบอุปกรณ์สำเร็จ");
          fetchEquipments();
        } else {
          if (res.status === 401 || res.status === 403) {
            alert("สิทธิ์ของคุณไม่เพียงพอในการลบอุปกรณ์นี้");
          } else {
            alert("ลบอุปกรณ์ไม่สำเร็จ");
          }
        }
      } catch (error) {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      }
    }
  };

  // --- แก้ไข: ดึงข้อมูลเดิมมาใส่ Form ---
  const openModal = (item: Equipment | null = null) => {
    if (item) {
      setEditingId(item._id || null);
      // setForm แบบระบุครบทุก Field ป้องกัน undefined
      setForm({ 
        name: item.name || "",
        category: item.category || "Camera",
        serialNumber: item.serialNumber || "",
        status: item.status || "Available",
        imageUrl: item.imageUrl || "",
        note: item.note || ""
      }); 
    } else {
      setEditingId(null);
      setForm(initialForm); 
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full text-white animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
          MANAGE <span className="text-neonBlue">EQUIPMENTS</span>
        </h1>
        <button 
          onClick={() => openModal()} 
          className="px-6 py-3 bg-neonBlue text-black font-bold rounded-xl hover:shadow-neon transition-all active:scale-95"
        >
          + เพิ่มอุปกรณ์ใหม่
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-darkPanel border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900/80 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-800">
                <th className="p-5">รูปภาพ</th>
                <th className="p-5">ชื่ออุปกรณ์ / S/N</th>
                <th className="p-5">หมวดหมู่</th>
                <th className="p-5">สถานะ</th>
                <th className="p-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 animate-pulse">
                    กำลังตรวจสอบสิทธิ์และโหลดข้อมูล...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item._id || Math.random()} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <div className="w-16 h-16 bg-black rounded-xl overflow-hidden border border-gray-700 relative">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-lg text-white mb-1">{item.name}</div>
                      <div className="text-xs text-neonBlue font-mono">S/N: {item.serialNumber}</div>
                      {item.note && <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">{item.note}</div>}
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-300 border border-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]' :
                        item.status === 'Borrowed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        item.status === 'Maintenance' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(item)} className="text-neonBlue hover:text-white text-sm transition-colors">
                          แก้ไข
                        </button>
                        <span className="text-gray-700">|</span>
                        <button onClick={() => handleDelete(item._id!)} className="text-red-500 hover:text-red-400 text-sm transition-colors">
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    ไม่พบข้อมูลอุปกรณ์ในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-darkPanel border border-gray-700 w-full max-w-2xl rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-bold mb-6 text-neonBlue flex items-center gap-3">
              <div className="w-1.5 h-6 bg-neonBlue"></div>
              {editingId ? "แก้ไขข้อมูลอุปกรณ์" : "เพิ่มอุปกรณ์ใหม่"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* แถวที่ 1: ชื่อ และ S/N */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest ml-1 mb-1 block">ชื่ออุปกรณ์ *</label>
                  <input required type="text" placeholder="เช่น Sony A7IV"
                    className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-neonBlue outline-none text-white transition-all"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Serial Number *</label>
                  <input required type="text" placeholder="ระบุหมายเลข S/N"
                    className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-neonBlue outline-none text-white transition-all"
                    value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})} 
                  />
                </div>

                {/* แถวที่ 2: หมวดหมู่ และ สถานะ */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest ml-1 mb-1 block">หมวดหมู่ *</label>
                  <select required
                    className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-neonBlue outline-none text-white transition-all"
                    value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  >
                    <option value="Camera">Camera</option>
                    <option value="Mic">Mic</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-widest ml-1 mb-1 block">สถานะปัจจุบัน</label>
                  <select 
                    className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-neonBlue outline-none text-white transition-all"
                    value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}
                  >
                    <option value="Available">Available (พร้อมใช้งาน)</option>
                    <option value="Borrowed">Borrowed (ถูกยืม)</option>
                    <option value="Maintenance">Maintenance (ส่งซ่อม)</option>
                    <option value="Disabled">Disabled (ชำรุด/เลิกใช้งาน)</option>
                  </select>
                </div>

                {/* แถวที่ 3: URL รูปภาพ (เต็มบรรทัด) */}
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 uppercase tracking-widest ml-1 mb-1 block">URL รูปภาพ (Optional)</label>
                  <input type="text" placeholder="https://example.com/image.jpg"
                    className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-neonBlue outline-none text-white transition-all"
                    value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} 
                  />
                </div>

                {/* แถวที่ 4: หมายเหตุ (เต็มบรรทัด) */}
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-400 uppercase tracking-widest ml-1 mb-1 block">หมายเหตุ (Note)</label>
                  <textarea rows={3} placeholder="รายละเอียดเพิ่มเติม หรือตำหนิของอุปกรณ์"
                    className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-neonBlue outline-none text-white transition-all resize-none"
                    value={form.note} onChange={e => setForm({...form, note: e.target.value})} 
                  />
                </div>
              </div>

              {/* ปุ่ม Action */}
              <div className="flex gap-4 pt-4 mt-2 border-t border-gray-800">
                <button type="submit" className="flex-1 bg-neonBlue text-black font-extrabold py-4 rounded-xl hover:shadow-neon transition-all active:scale-95 uppercase tracking-wider">
                  {editingId ? "อัปเดตข้อมูล" : "บันทึกอุปกรณ์ใหม่"}
                </button>
                <button type="button" onClick={closeModal} className="w-1/3 bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-gray-700 transition-all uppercase tracking-wider">
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}