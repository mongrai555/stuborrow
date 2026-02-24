"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    department: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const payload = {
      ...formData,
      role: "Student",
    };

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Sign up สำเร็จ!");
        router.push("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "เกิดข้อผิดพลาดในการ Sign up (รหัสนักศึกษาอาจซ้ำ)");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden">
      {/* 1. ส่วนของ Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Overlay สีดำบางๆ เพื่อให้ตัวหนังสือบนฟอร์มเด่นขึ้น */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Iframe สำหรับ YouTube */}
        {/* 🌟 เปลี่ยนรหัสวิดีโอตรง embed/ และ playlist= ให้เป็น BpURtzXRo10 🌟 */}
        <iframe
          src="https://www.youtube.com/embed/BpURtzXRo10?autoplay=1&mute=1&loop=1&playlist=BpURtzXRo10&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 object-cover"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      {/* 2. ส่วนของฟอร์ม Signup (Glassmorphism UI) */}
      <div className="relative z-20 w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/10 border border-white/20">
        <h1 className="text-3xl font-bold text-center text-white mb-2 tracking-wide">
          Sign Up
        </h1>
        <p className="text-center text-gray-200 mb-6 text-sm">
          สร้างบัญชีผู้ใช้สำหรับ Stuborrow
        </p>
        
        {error && (
          <div className="bg-red-500/80 border border-red-400 text-white px-4 py-3 rounded-lg mb-4 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1 drop-shadow-md">
              รหัสนักศึกษา/พนักงาน
            </label>
            <input
              type="text"
              name="userId"
              required
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/70 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white text-black transition-all placeholder-gray-500"
              placeholder="กรอกรหัสของคุณ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1 drop-shadow-md">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/70 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white text-black transition-all placeholder-gray-500"
              placeholder="กรอกชื่อ-นามสกุล"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1 drop-shadow-md">
              คณะ/แผนก
            </label>
            <input
              type="text"
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/70 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white text-black transition-all placeholder-gray-500"
              placeholder="เช่น วิทยาการคอมพิวเตอร์"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1 drop-shadow-md">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/70 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white text-black transition-all placeholder-gray-500"
              placeholder="กำหนดรหัสผ่าน"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold tracking-wide transition-all shadow-lg ${
              isLoading 
                ? "bg-blue-400/50 cursor-not-allowed" 
                : "bg-blue-600/90 hover:bg-blue-500 hover:scale-[1.02]"
            }`}
          >
            {isLoading ? "กำลังดำเนินการ..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-300">
          มีบัญชีอยู่แล้ว?{" "}
          <button 
            onClick={() => router.push('/login')}
            className="text-blue-300 hover:text-white font-medium underline transition-colors"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}