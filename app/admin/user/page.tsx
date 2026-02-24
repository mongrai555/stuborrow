"use client";
import { useState, useEffect } from "react";

interface User {
  _id: string;
  userId: string;
  name: string;
  department: string;
  role: string;
}

export default function ManageUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // ฟอร์มสำหรับเพิ่ม User ใหม่
  const [form, setForm] = useState({
    userId: "",
    name: "",
    department: "",
    role: "Student",
    password: ""
  });

  const API_URL = "http://localhost:3000/users";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- 1. เพิ่มผู้ใช้งาน (POST) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.userId.length !== 10) return alert("รหัสต้องมี 10 หลัก");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("เพิ่มผู้ใช้งานเรียบร้อย ✨");
        setForm({ userId: "", name: "", department: "", role: "Student", password: "" });
        fetchUsers();
      } else {
        const err = await res.json();
        alert(`ผิดพลาด: ${err.message}`);
      }
    } catch (err) { alert("เชื่อมต่อผิดพลาด"); }
  };

  // --- 2. ลบผู้ใช้งาน (DELETE) ---
  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบผู้ใช้งาน?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        alert("ลบข้อมูลสำเร็จ");
        fetchUsers();
      }
    } catch (err) { alert("ลบไม่สำเร็จ"); }
  };

  // --- 3. เปิด Modal แก้ไข ---
  const openEditModal = (user: User) => {
    setEditingUser({ ...user }); // ใช้ Spread เพื่อไม่ให้กระทบค่าในตารางโดยตรงขณะพิมพ์
    setIsEditModalOpen(true);
  };

  // --- 4. บันทึกการแก้ไข (PATCH) ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      // 📌 จุดสำคัญ: คัดเลือกเฉพาะฟิลด์ที่ Backend อนุญาตให้แก้ (ห้ามส่ง _id ไป)
      const updateData = {
        userId: editingUser.userId,
        name: editingUser.name,
        department: editingUser.department,
        role: editingUser.role
      };

      const res = await fetch(`${API_URL}/${editingUser._id}`, {
        method: "PATCH", 
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("อัปเดตข้อมูลสำเร็จ ✨");
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        // โชว์ Error ที่ส่งมาจาก Backend เพื่อวิเคราะห์ต่อ
        alert(`แก้ไขไม่สำเร็จ (400): ${Array.isArray(result.message) ? result.message.join(", ") : result.message}`);
      }
    } catch (err) { alert("เกิดข้อผิดพลาดในการเชื่อมต่อ"); }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full text-white animate-fade-in">
      <h1 className="text-3xl font-bold mb-10 flex items-center gap-3">
        <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
        USER <span className="text-neonBlue">MANAGEMENT</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ฟอร์มเพิ่ม (ซ้าย) */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="bg-darkPanel border border-gray-800 p-6 rounded-3xl shadow-xl sticky top-24 space-y-4">
            <h2 className="text-xl font-bold text-neonBlue uppercase tracking-widest">Add User</h2>
            <input required placeholder="ชื่อ-นามสกุล" className="w-full bg-black border border-gray-800 p-3 rounded-xl outline-none focus:border-neonBlue"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input required maxLength={10} placeholder="รหัสนักศึกษา (10 หลัก)" className="w-full bg-black border border-gray-800 p-3 rounded-xl outline-none focus:border-neonBlue font-mono"
              value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} />
            <input required placeholder="ภาควิชา" className="w-full bg-black border border-gray-800 p-3 rounded-xl outline-none focus:border-neonBlue"
              value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
            <input required type="password" placeholder="รหัสผ่าน (6 ตัวขึ้นไป)" className="w-full bg-black border border-gray-800 p-3 rounded-xl outline-none focus:border-neonBlue"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <select className="w-full bg-black border border-gray-800 p-3 rounded-xl text-white" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
            </select>
            <button type="submit" className="w-full bg-neonBlue text-black font-extrabold py-4 rounded-xl shadow-neon transition-all hover:scale-95 uppercase mt-2">Create User</button>
          </form>
        </div>

        {/* ตารางรายชื่อ (ขวา) */}
        <div className="lg:col-span-8">
          <div className="bg-darkPanel border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/80 text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-800">
                  <th className="p-5">ID / Name</th>
                  <th className="p-5">Department</th>
                  <th className="p-5">Role</th>
                  <th className="p-5 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center animate-pulse text-gray-500 italic">กำลังโหลดข้อมูล...</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-all group">
                    <td className="p-5">
                      <div className="font-bold text-gray-100">{u.name}</div>
                      <div className="text-xs text-neonBlue/80 font-mono tracking-tighter">{u.userId}</div>
                    </td>
                    <td className="p-5 text-sm text-gray-400 font-light">{u.department}</td>
                    <td className="p-5">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold border border-gray-700 ${u.role === 'Admin' ? 'text-purple-400' : 'text-blue-400'}`}>{u.role}</span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openEditModal(u)} className="text-neonBlue hover:text-white text-xs font-bold transition-colors">EDIT</button>
                        <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-300 text-xs font-bold transition-colors">DEL</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Modal แก้ไข --- */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-darkPanel border border-gray-700 w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-neonBlue uppercase tracking-widest border-b border-gray-800 pb-2">Edit Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase ml-1">ชื่อ-นามสกุล</label>
                <input required className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 outline-none focus:border-neonBlue"
                  value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase ml-1">รหัสนักศึกษา (userId)</label>
                <input required maxLength={10} className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 outline-none focus:border-neonBlue font-mono"
                  value={editingUser.userId} onChange={e => setEditingUser({...editingUser, userId: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase ml-1">แผนก / คณะ</label>
                <input required className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 outline-none focus:border-neonBlue"
                  value={editingUser.department} onChange={e => setEditingUser({...editingUser, department: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase ml-1">บทบาท</label>
                <select className="w-full bg-black border border-gray-800 p-3 rounded-xl mt-1 text-white"
                  value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-neonBlue text-black font-extrabold py-3 rounded-xl shadow-neon uppercase hover:scale-95 transition-all">Update</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-gray-800 py-3 rounded-xl uppercase hover:bg-gray-700 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}