"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isStudent, setIsStudent] = useState(true);
  
  // Form States
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/user/discover"); // จำลองการ Login สำเร็จ ไปหน้ายืมของ
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === "studio" && adminPass === "CSstudio.") {
      router.push("/admin/dashboard");
    } else {
      alert("Admin Username หรือ Password ไม่ถูกต้อง!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 text-white font-sans">
      <div className="bg-darkPanel border border-neonBlue/30 shadow-neon rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        
        <h1 className="text-3xl font-bold text-center text-neonBlue mb-6 tracking-wider drop-shadow-neon">
          STUDIO <span className="text-white">GEAR</span>
        </h1>

        {/* Tab Selection */}
        <div className="flex mb-8 bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setIsStudent(true)}
            className={`flex-1 py-2 rounded-md transition-all ${
              isStudent ? "bg-neonBlue text-black font-bold shadow-neon" : "text-gray-400 hover:text-white"
            }`}
          >
            นักศึกษา
          </button>
          <button
            onClick={() => setIsStudent(false)}
            className={`flex-1 py-2 rounded-md transition-all ${
              !isStudent ? "bg-neonBlue text-black font-bold shadow-neon" : "text-gray-400 hover:text-white"
            }`}
          >
            ผู้ดูแลระบบ
          </button>
        </div>

        {/* Forms */}
        {isStudent ? (
          <form onSubmit={handleStudentSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">รหัสนักศึกษา</label>
              <input 
                type="text" required placeholder="เช่น 6704101325"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
                value={studentId} onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">ชื่อ</label>
                <input 
                  type="text" required placeholder="ชื่อจริง"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">นามสกุล</label>
                <input 
                  type="text" required placeholder="นามสกุล"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
                  value={lastName} onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="mt-4 w-full bg-transparent border border-neonBlue text-neonBlue font-bold py-3 rounded-lg hover:bg-neonBlue hover:text-black hover:shadow-neon-hover transition-all">
              ลงทะเบียน / เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input 
                type="text" required placeholder="Admin Username"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
                value={adminUser} onChange={(e) => setAdminUser(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input 
                type="password" required placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-neonBlue focus:shadow-neon transition-all"
                value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
              />
            </div>
            <button type="submit" className="mt-4 w-full bg-transparent border border-neonBlue text-neonBlue font-bold py-3 rounded-lg hover:bg-neonBlue hover:text-black hover:shadow-neon-hover transition-all">
              เข้าสู่ระบบ Admin
            </button>
          </form>
        )}
      </div>
    </div>
  );
}