"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const BorrowDetail = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id; // ดึง ID จาก URL
    
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // 1. ดึงข้อมูลรายละเอียดอุปกรณ์
    useEffect(() => {
        const fetchItemDetail = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/equipments/${id}`);
                setItem(response.data);
            } catch (error) {
                console.error("Error fetching detail:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchItemDetail();
    }, [id, API_BASE_URL]);

    // 2. ฟังก์ชันยืนยันการจอง
    const handleConfirmBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return alert("กรุณาเข้าสู่ระบบก่อนทำรายการ");

            if (!confirm("ยืนยันการจองอุปกรณ์ชิ้นนี้?")) return;

            const response = await axios.post(`${API_BASE_URL}/bookings`, {
                equipment: id, // ส่ง ID อุปกรณ์
                borrowDate: new Date().toISOString(),
                expectedReturnDate: new Date(Date.now() + 86400000).toISOString() // คืนวันถัดไป
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 201) {
                alert("ส่งคำขอจองสำเร็จ! กรุณารอเจ้าหน้าที่อนุมัติ");
                router.push('/user/history'); // ไปหน้าประวัติการยืม
            }
        } catch (error: any) {
            alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการจอง");
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white p-10 font-sans">กำลังโหลดข้อมูล...</div>;
    if (!item) return <div className="min-h-screen bg-black text-white p-10 font-sans">ไม่พบข้อมูลอุปกรณ์</div>;

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* Header / Nav */}
            <div className="max-w-4xl mx-auto p-6 pt-12">
                <button onClick={() => router.back()} className="mb-6 text-zinc-400 hover:text-white transition-colors">
                    ← ย้อนกลับไปหน้าสำรวจ
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm">
                    {/* รูปภาพอุปกรณ์ */}
                    <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700">
                        <img 
                            src={item.imageUrl || 'https://via.placeholder.com/400x400/3f3f46/ffffff?text=No+Image'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {/* ข้อมูลอุปกรณ์ */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                                {item.category || 'EQUIPMENT'}
                            </span>
                            <h1 className="text-3xl font-bold mt-4 text-white">{item.name}</h1>
                            <p className="text-zinc-400 mt-4 leading-relaxed italic">
                                "{item.note || "ไม่มีรายละเอียดเพิ่มเติมสำหรับอุปกรณ์ชิ้นนี้"}"
                            </p>
                            
                            <div className="mt-8 pt-6 border-t border-zinc-800">
                                <p className="text-zinc-500 text-sm uppercase font-semibold">ราคาเช่าต่อวัน</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">฿{item.price || 0}</span>
                                    <span className="text-zinc-500 font-medium">/ วัน</span>
                                </div>
                            </div>
                        </div>

                        {/* ปุ่มกดจอง */}
                        <button 
                            onClick={handleConfirmBooking}
                            className="w-full py-4 mt-10 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/10 transform active:scale-[0.98] transition-all"
                        >
                            ยืนยันการจองอุปกรณ์
                        </button>
                    </div>
                </div>
                
                {/* หมายเหตุเพิ่มเติม */}
                <div className="mt-8 p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-zinc-500 text-sm">
                    <p>● หลังจากกดยืนยัน ระบบจะส่งคำขอไปยังเจ้าหน้าที่เพื่อทำการอนุมัติ</p>
                    <p>● สามารถตรวจสอบสถานะได้ที่เมนู "ประวัติของฉัน"</p>
                </div>
            </div>
        </div>
    );
};

export default BorrowDetail;