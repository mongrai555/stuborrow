import Link from "next/link";

export default function LandingPage() {
  const videoId = "tUuqWFExZgY"; 
  const roles = ["Camera man", "Editor", "Graphic", "Back stage", "Support"];

  // Mock Data อุปกรณ์ตัวอย่าง (โชว์ที่หน้า Landing Page)
  const previewGears = [
    { id: 1, name: "Sony A7 IV", type: "Camera", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "DJI Ronin RS 3", type: "Stabilizer", image: "https://images.unsplash.com/photo-1622615456247-f7e91eb70a1d?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Godox SL60W", type: "Lighting", image: "https://images.unsplash.com/photo-1582294459828-4444a86f7c9e?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "Rode Wireless GO II", type: "Microphone", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&auto=format&fit=crop" },
  ];

  // Mock รูปภาพ 20 รูปสำหรับ Facebook Gallery
  const row1Images = [
    "/logo/gallery/work11.jpg",
   "/logo/gallery/work12.jpg",
   "/logo/gallery/work13.jpg",
   "/logo/gallery/work14.jpg",
   "/logo/gallery/work15.jpg",
   "/logo/gallery/work16.jpg",
   "/logo/gallery/work17.jpg",
   "/logo/gallery/work18.jpg",
   "/logo/gallery/work19.jpg",
   "/logo/gallery/work20.jpg",
  ];

  // แถวที่ 2 (รูปที่ 11-20)
  const row2Images = [
   "/logo/gallery/work1.jpg",
   "/logo/gallery/work2.jpg",
   "/logo/gallery/work3.jpg",
   "/logo/gallery/work4.jpg",
   "/logo/gallery/work5.jpg",
   "/logo/gallery/work6.jpg",
   "/logo/gallery/work7.jpg",
   "/logo/gallery/work8.jpg",
   "/logo/gallery/work9.jpg",
   "/logo/gallery/work10.jpg",
  ];

  return (
    <div className="bg-background font-sans text-white overflow-x-hidden">
      
      {/* ================= SECTION 1: HERO (วิดีโอพื้นหลัง) ================= */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* BACKGROUND VIDEO */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute inset-0 bg-background/85 z-10 backdrop-blur-[2px]"></div>
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${videoId}`}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
        </div>

        {/* Navbar */}
        <header className="w-full border-b border-neonBlue/20 sticky top-0 z-50 bg-background/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,243,255,0.05)] relative">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-wider">
              <span className="text-neonBlue drop-shadow-neon">STUDIO</span>
              <span className="text-white">GEAR</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-gray-300 hover:text-white transition-all font-medium text-lg">
                สมาชิก
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-transparent border border-neonBlue text-neonBlue rounded-lg hover:bg-neonBlue hover:text-black hover:shadow-neon transition-all font-bold tracking-wide backdrop-blur-sm">
                Login / Register
              </Link>
            </div>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-20 pb-20 md:pb-0">
          <div className="flex-1 flex flex-col items-start justify-center w-full mt-10 md:mt-0">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-blue-500 drop-shadow-neon">
                CSMJU
              </span> STUDIO
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-lg leading-relaxed drop-shadow-md mb-8">
              ระบบยืม-คืนอุปกรณ์ถ่ายทำและสตูดิโอ สำหรับนักศึกษาสาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {roles.map((role, index) => (
                <div key={index} className="px-5 py-2 rounded-full border border-gray-700 bg-darkPanel/50 backdrop-blur-md text-gray-300 text-sm md:text-base font-medium hover:border-neonBlue hover:text-white hover:shadow-neon transition-all duration-300 cursor-default">
                  {role}
                </div>
              ))}
            </div>
            <Link href="/login" className="px-8 py-4 bg-neonBlue text-black font-bold text-lg rounded-full shadow-neon hover:shadow-neon-hover hover:scale-105 transition-all duration-300">
              เริ่มต้นใช้งานระบบ
            </Link>
          </div>

          <div className="flex-1 flex justify-center items-center w-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-neonBlue/20 blur-[120px] rounded-full pointer-events-none"></div>
            <img src="/logo/LOGO CSMJU Stroke.png" alt="CSMJU Studio Logo" className="w-full max-w-[500px] object-contain drop-shadow-[0_0_30px_rgba(0,243,255,0.8)] relative z-10 hover:scale-105 hover:drop-shadow-[0_0_50px_rgba(0,243,255,1)] transition-all duration-500" />
          </div>
        </main>
      </section>

      {/* ================= SECTION 2: อุปกรณ์ของเรา (GEAR SHOWCASE) ================= */}
      <section className="py-24 bg-background relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
                  OUR <span className="text-neonBlue drop-shadow-neon">GEAR</span>
                </h2>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl mt-4">
                อุปกรณ์สตูดิโอระดับโปรเฟสชันนอล พร้อมให้บริการสำหรับนักศึกษา CS ทุกคน
              </p>
            </div>
            <Link href="/login" className="text-neonBlue hover:text-white border-b border-transparent hover:border-white transition-all pb-1 flex items-center gap-2 font-medium">
              ดูอุปกรณ์ทั้งหมด <span className="text-xl">→</span>
            </Link>
          </div>

          {/* Grid โชว์อุปกรณ์ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewGears.map((gear) => (
              <div key={gear.id} className="bg-darkPanel border border-gray-800 rounded-2xl overflow-hidden group hover:border-neonBlue hover:shadow-neon transition-all duration-500 flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-darkPanel to-transparent z-10 opacity-60"></div>
                  <img src={gear.image} alt={gear.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gray-700 text-xs text-gray-300">
                    {gear.type}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 relative z-20">
                  <h3 className="text-xl font-bold text-white group-hover:text-neonBlue transition-colors">{gear.name}</h3>
                  
                  {/* ปุ่มยืมอุปกรณ์ (วิ่งไปหน้า Login) */}
                  <Link 
                    href="/login"
                    className="w-full py-2.5 bg-gray-900 border border-gray-700 text-gray-300 text-center rounded-lg hover:bg-neonBlue hover:border-neonBlue hover:text-black font-bold hover:shadow-neon transition-all flex justify-center items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    ล็อกอินเพื่อยืม
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= SECTION 3: FACEBOOK GALLERY (รูปภาพผลงาน) ================= */}
      <section className="py-24 bg-darkPanel relative border-t border-neonBlue/20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-neonBlue to-transparent shadow-[0_0_15px_rgba(0,243,255,0.8)]"></div>

        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide">
            RECENT <span className="text-neonBlue drop-shadow-neon">WORKS</span>
          </h2>
          <p className="text-gray-400 text-lg">อัปเดตผลงานและกิจกรรมล่าสุดจากเพจ CSMJU STUDIO</p>
        </div>

        <div className="w-full overflow-hidden mb-6 flex">
          <div className="flex w-max animate-scroll-right gap-6 px-3">
            {[...row1Images, ...row1Images].map((img, idx) => (
              <div key={`row1-${idx}`} className="w-[280px] h-[200px] md:w-[350px] md:h-[250px] flex-shrink-0 rounded-xl overflow-hidden border border-gray-800 hover:border-neonBlue hover:shadow-neon transition-all duration-300">
                <img src={img} alt="CSMJU Studio Work" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full overflow-hidden flex">
          <div className="flex w-max animate-scroll-left gap-6 px-3">
            {[...row2Images, ...row2Images].map((img, idx) => (
              <div key={`row2-${idx}`} className="w-[280px] h-[200px] md:w-[350px] md:h-[250px] flex-shrink-0 rounded-xl overflow-hidden border border-gray-800 hover:border-neonBlue hover:shadow-neon transition-all duration-300">
                <img src={img} alt="CSMJU Studio Work" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: FOOTER (ติดต่อ & แผนที่) ================= */}
      <footer className="w-full bg-black border-t border-neonBlue/30 relative z-20 py-16 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-neonBlue/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12">
          
          <div className="flex-1 flex flex-col gap-6 z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
              <h3 className="text-3xl font-bold text-white tracking-wide">CONNECT WITH US</h3>
            </div>
            <p className="text-gray-400">ติดตามข่าวสารและผลงานใหม่ๆ ของพวกเราได้ที่เพจ CSMJU Studio</p>
            
            <div className="bg-darkPanel p-2 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,243,255,0.05)] hover:border-neonBlue/50 hover:shadow-neon transition-all overflow-hidden w-full max-w-[400px]">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcsmju.studio&tabs=timeline&width=400&height=350&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                width="100%" 
                height="350" 
                className="border-none bg-white rounded-lg" 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-neonBlue shadow-neon"></div>
              <h3 className="text-3xl font-bold text-white tracking-wide">LOCATION</h3>
            </div>
            <p className="text-gray-400">สาขาวิชาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยแม่โจ้</p>

            <div className="bg-darkPanel p-2 rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(0,243,255,0.05)] hover:border-neonBlue/50 hover:shadow-neon transition-all w-full h-[350px] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-neonBlue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
              <iframe 
                src="https://maps.google.com/maps?q=สาขาวิชาวิทยาการคอมพิวเตอร์%20ม.แม่โจ้&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                className="border-none rounded-lg relative z-0 filter invert-[90%] hue-rotate-[180deg] contrast-[1.2] opacity-70 group-hover:opacity-100 group-hover:filter-none transition-all duration-700" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="text-gray-400 text-sm mt-2 flex flex-col gap-1">
              <p>📍 ตำบลหนองหาร อำเภอสันทราย เชียงใหม่ 50290</p>
              <p>📞 โทรศัพท์: +66 53 873 898</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800/50 text-center flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CSMJU Studio. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-neonBlue transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-neonBlue transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}