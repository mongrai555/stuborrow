"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. ฟังก์ชันสำหรับถอดรหัส JWT Token
  const decodeJWT = (token: string) => {
    try {
      // Token จะมี 3 ส่วนคั่นด้วยจุด (.) เราเอาส่วนที่ 2 (Payload) มาถอดรหัส Base64
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Invalid token format");
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // 2. เก็บ Token ลง localStorage
        localStorage.setItem("access_token", data.access_token);
        
        // 3. ถอดรหัส Token เพื่อเอาข้อมูล User & Role
        const decodedUser = decodeJWT(data.access_token);
        
        if (decodedUser) {
          // เก็บข้อมูล User ที่แกะมาจาก Token ลง localStorage ด้วย (เอาไว้แสดงชื่อมุมขวาบน)
          localStorage.setItem("user", JSON.stringify(decodedUser));
          
          // 4. เช็ค Role จาก Token โดยตรง (แปลงเป็นพิมพ์เล็กเพื่อป้องกันบั๊ก)
          // ⚠️ หมายเหตุ: ตรวจสอบให้แน่ใจว่าใน Payload ของ Token ใช้ key ชื่อ role 
          const userRole = decodedUser.role?.toLowerCase(); 

          if (userRole === "student") {
            router.push("user/discover"); // 🎓 ไปหน้ายืมของ
          } else {
            router.push("/admin/booking"); // 🛡️ ไปหน้าจัดการแอดมิน
          }
        } else {
          setError("เกิดข้อผิดพลาดในการอ่านข้อมูล Token");
        }

      } else {
        setError(data.message || "Login failed. Please check your ID/Password.");
      }
    } catch (err) {
      setError("Cannot connect to server. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-md bg-darkPanel border border-gray-800 p-8 rounded-3xl shadow-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            SIGN <span className="text-neonBlue">IN</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Enter your credentials to access system</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">User ID</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
              loading 
              ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
              : "bg-white text-black hover:bg-neonBlue hover:shadow-neon"
            }`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}