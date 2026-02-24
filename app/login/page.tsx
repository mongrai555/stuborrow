"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Token decoding failed", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = "http://localhost:3000/auth/login"; 
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password })
      });
      
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        const decodedInfo = decodeToken(data.access_token);
        const userRole = decodedInfo?.role || data.role || "student"; 
        localStorage.setItem("user_role", userRole);

        if (userRole === "admin" || userRole === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/discover");
        }
      } else {
        alert(`เข้าสู่ระบบไม่สำเร็จ: ${data.message || "รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-white font-sans overflow-hidden">
      
      {/* 1. ส่วนของ Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <iframe
          src="https://www.youtube.com/embed/OjX7v-9UQVo?autoplay=1&mute=1&loop=1&playlist=OjX7v-9UQVo&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 object-cover"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      {/* 2. ส่วนของฟอร์ม Login (ถอดการเรืองแสงออกแล้ว) */}
      <div className="relative z-20 bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-sm transition-all duration-300">
        
        {loading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <div className="text-white font-mono text-xs tracking-widest">VERIFYING...</div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-wider">
            STUDIO <span className="text-gray-400">GEAR</span>
          </h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mt-2">
            เข้าสู่ระบบ
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest pl-1">
              User ID
            </label>
            <input 
              type="text" 
              required 
              placeholder="กรอกรหัสผู้ใช้งาน"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/50 transition-all"
              value={userId} 
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest pl-1">
              Password
            </label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/50 transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="mt-6 w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 active:scale-95 transition-all uppercase tracking-widest text-sm"
          >
            {loading ? "Please Wait..." : "Sign In"}
          </button>

          <div className="mt-4 text-center text-sm text-gray-400">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <button 
              type="button"
              onClick={() => router.push('/signup')}
              className="text-white hover:underline font-medium transition-colors"
            >
              ลงทะเบียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}