"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export default function LoginPage() {
  const router = useRouter();
  
  // Form States
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "เข้าสู่ระบบล้มเหลว");
      }

      const data = await response.json();
      const token = data.access_token;

      if (!token) {
        throw new Error("ไม่ได้รับ Token จากเซิร์ฟเวอร์");
      }

      // Decode token to get role
      const decodedToken = jwtDecode<DecodedToken>(token);
      const role = decodedToken.role?.toLowerCase();

      // Store token in localStorage
      localStorage.setItem("access_token", token);

      // Route based on role
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "student") {
        router.push("/user/discover");
      } else {
        throw new Error("บทบาทผู้ใช้ไม่ถูกต้อง");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-white font-sans">
      <div className="bg-darkPanel border border-neonBlue/30 shadow-neon rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        
        <h1 className="text-3xl font-bold text-center text-neonBlue mb-6 tracking-wider drop-shadow-neon">
          STUDIO <span className="text-white">GEAR</span>
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">รหัสผู้ใช้</label>
            <input 
              type="text"
              required
              placeholder="เลข 10 หลัก"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">รหัสผ่าน</label>
            <input 
              type="password"
              required
              placeholder="รหัส 6 ตัวขึ้นไป"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-transparent border border-neonBlue text-neonBlue font-bold py-3 rounded-lg hover:bg-neonBlue hover:text-black hover:shadow-neon-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  )
};