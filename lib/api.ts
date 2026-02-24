// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = {
  getItems: async () => {
    const res = await fetch(`${API_URL}/items`);
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  },
  
  borrowItem: async (studentId: string, itemId: string) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, itemId }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "มีคนยืมไปแล้ว");
    }
    return res.json();
  },
  returnItem: async (bookingId: string, file: File) => {
    const formData = new FormData();
    formData.append("proofImage", file); // ชื่อ "proofImage" ต้องตรงกับที่หลังบ้านรอรับ

    const res = await fetch(`${API_URL}/bookings/${bookingId}/return`, {
      method: "PATCH",
      body: formData, // ส่ง FormData ไปเลย
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "การอัปโหลดหลักฐานล้มเหลว");
    }
    return res.json();
  },
};
  // ... (ฟังก์ชันอื่นๆ ตามที่เคยคุยกันไว้)