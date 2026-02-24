"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Discover = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const headers: any = token ? { Authorization: `Bearer ${token}` } : {};

                const response = await axios.get(`${API_BASE_URL}/equipments`, {
                    headers,
                    withCredentials: true,
                });
                setProducts(response.data);
            } catch (error: any) {
                // If the API returns 401, redirect the user to login
                if (error?.response?.status === 401) {
                    console.warn('Unauthorized - redirecting to login');
                    if (typeof window !== 'undefined') window.location.href = '/login';
                    return;
                }
                console.error("Error fetching equipments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [API_BASE_URL]);

    // UI ตอนกำลังโหลดข้อมูล (Skeleton Loading - Dark Theme)
    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 bg-zinc-800 rounded-lg w-1/4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="bg-zinc-900 rounded-2xl h-80 border border-zinc-800"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20 font-sans">
            {/* Header Section */}
            <div className="bg-black border-b border-zinc-800 mb-10">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Discover <span className="text-blue-500">Equipments</span>
                    </h1>
                    <p className="mt-3 text-lg text-zinc-400 max-w-2xl">
                        สำรวจและเลือกจองอุปกรณ์คุณภาพสูงจาก CSMJU Studio สำหรับโปรเจกต์ของคุณ
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map((item) => {
                            const isAvailable = item.status === 'Available';
                            
                            return (
                                <div 
                                    key={item._id} 
                                    className="group flex flex-col bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 overflow-hidden hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800">
                                        <img 
                                            src={item.imageUrl || 'https://via.placeholder.com/400x300/3f3f46/ffffff?text=No+Image'} 
                                            alt={item.name}
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
                                        />
                                        
                                        {/* Floating Status Badge (Dark Mode) */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                                                isAvailable 
                                                ? 'bg-black/60 text-green-400 border border-green-500/30' 
                                                : 'bg-black/60 text-red-400 border border-red-500/30'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`}></span>
                                                {isAvailable ? 'พร้อมใช้งาน' : 'ไม่ว่าง'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="mb-2">
                                            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                                                {item.category || 'อุปกรณ์'}
                                            </span>
                                            <h3 className="text-lg font-bold text-white mt-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                                {item.name}
                                            </h3>
                                        </div>
                                        
                                        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
                                            {item.note || 'ไม่มีรายละเอียดเพิ่มเติมสำหรับอุปกรณ์ชิ้นนี้'}
                                        </p>
                                        
                                        {/* Footer: Price & Action */}
                                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-zinc-500 font-medium uppercase mb-0.5">ราคาเช่า</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xl font-bold text-white">฿{item.price || '0'}</span>
                                                    <span className="text-zinc-500 text-xs font-medium">/วัน</span>
                                                </div>
                                            </div>

                                            <Link 
                                                href={`/user/borrow/${item._id}`}
                                                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                    isAvailable 
                                                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20' 
                                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed pointer-events-none'
                                                }`}
                                            >
                                                {isAvailable ? 'จองอุปกรณ์' : 'ไม่สามารถจองได้'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* Empty State (Dark Mode) */
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-zinc-900 rounded-3xl border border-dashed border-zinc-700">
                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                                <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">ยังไม่มีอุปกรณ์ในระบบ</h3>
                            <p className="text-zinc-400 text-sm text-center">อุปกรณ์ทั้งหมดอาจถูกยืมไปแล้ว หรือยังไม่มีการเพิ่มข้อมูลในขณะนี้</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;