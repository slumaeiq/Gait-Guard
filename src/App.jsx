import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' หรือ 'register'
  const [userProfile, setUserProfile] = useState({
    name: 'น้องสมชาย สายสุขภาพ',
    email: 'user@smartshoes.com',
    avatarUri: null // เก็บรุปโปรไฟล์
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [safetyScore, setSafetyScore] = useState(85);

  // ถ้าระบบยังไม่ได้ล็อกอิน ให้แสดงหน้า Auth (Login / Register)
  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <main className="screen-content">
          {authMode === 'login' ? (
            <LoginScreen 
              setIsLoggedIn={setIsLoggedIn} 
              setAuthMode={setAuthMode}
              setUserProfile={setUserProfile}
            />
          ) : (
            <RegisterScreen 
              setIsLoggedIn={setIsLoggedIn} 
              setAuthMode={setAuthMode} 
              setUserProfile={setUserProfile}
            />
          )}
        </main>
      </div>
    );
  }

  // เมื่อล็อกอินแล้ว ให้เข้าสู่แอปพลิเคชันหลัก
  return (
    <div className="app-container">
      <main className="screen-content">
        {activeTab === 'dashboard' && (
          <DashboardScreen 
            setActiveTab={setActiveTab} 
            safetyScore={safetyScore} 
            setSafetyScore={setSafetyScore} 
            userProfile={userProfile}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen 
            setActiveTab={setActiveTab} 
            userProfile={userProfile} 
            setUserProfile={setUserProfile}
            setIsLoggedIn={setIsLoggedIn} 
          />
        )}
        {activeTab === 'activity' && <ActivityScreen setActiveTab={setActiveTab} />}
        {activeTab === 'gait' && <GaitAnalysisScreen setActiveTab={setActiveTab} safetyScore={safetyScore} />}
        {activeTab === 'live' && <LivePressureScreen setActiveTab={setActiveTab} />}
        {activeTab === 'mission' && <MissionScreen setActiveTab={setActiveTab} />}
        {activeTab === 'history' && <HistoryScreen setActiveTab={setActiveTab} />}
        {activeTab === 'achievement' && <AchievementScreen setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}

const getScoreStatus = (score) => {
  if (score >= 80) return { text: "เยี่ยมมาก! ปลอดภัยดี", bg: "#10b981", color: "#ffffff" };
  if (score >= 50) return { text: "เฝ้าระวัง มีความเสี่ยงปานกลาง", bg: "#f59e0b", color: "#ffffff" };
  return { text: "เตือนภัย! เสี่ยงข้อเข่าสูง", bg: "#ef4444", color: "#ffffff" };
};

// ----------------------------------------------------
// 0.1 หน้าเข้าสู่ระบบ (Login)
// ----------------------------------------------------
function LoginScreen({ setIsLoggedIn, setAuthMode, setUserProfile }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const nameFromEmail = email.split('@')[0] || 'ผู้ใช้งาน';
    setUserProfile((prev) => ({ ...prev, name: nameFromEmail, email }));
    setIsLoggedIn(true);
  };

  return (
    <div className="screen" style={{ paddingTop: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '56px', marginBottom: '8px' }}>👟</div>
        <h2 style={{ color: '#1e3a8a', margin: 0, fontSize: '24px', fontWeight: '800' }}>Smart Shoes</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>วิเคราะห์และพิทักษ์สุขภาพข้อเข่า</p>
      </div>

      <div className="card-item" style={{ padding: '20px 16px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', textAlign: 'center' }}>เข้าสู่ระบบ</h3>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', display: 'block', marginBottom: '4px' }}>อีเมล</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #bfdbfe', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', display: 'block', marginBottom: '4px' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #bfdbfe', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <button type="submit" className="btn-3d-main" style={{ marginTop: '10px', justifyContent: 'center' }}>
            เข้าสู่ระบบ ➔
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <span 
            onClick={() => setAuthMode('register')} 
            style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            สมัครสมาชิกที่นี่
          </span>
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 0.2 หน้าสมัครสมาชิก (Register)
// ----------------------------------------------------
function RegisterScreen({ setIsLoggedIn, setAuthMode, setUserProfile }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setUserProfile((prev) => ({ ...prev, name: name || 'ผู้ใช้งานใหม่', email }));
    setIsLoggedIn(true);
  };

  return (
    <div className="screen" style={{ paddingTop: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '48px', marginBottom: '4px' }}>📝</div>
        <h2 style={{ color: '#1e3a8a', margin: 0, fontSize: '22px', fontWeight: '800' }}>สร้างบัญชีใหม่</h2>
        <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0 0' }}>เริ่มต้นดูแลข้อเข่าของคุณได้ง่ายๆ</p>
      </div>

      <div className="card-item" style={{ padding: '16px' }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', display: 'block', marginBottom: '4px' }}>ชื่อ-นามสกุล</label>
            <input 
              type="text" 
              required
              placeholder="สมชาย ใจดี" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '2px solid #bfdbfe', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', display: 'block', marginBottom: '4px' }}>อีเมล</label>
            <input 
              type="email" 
              required
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '2px solid #bfdbfe', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', display: 'block', marginBottom: '4px' }}>รหัสผ่าน</label>
            <input 
              type="password" 
              required
              placeholder="อย่างน้อย 6 ตัวอักษร" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '2px solid #bfdbfe', outline: 'none', fontSize: '14px' }}
            />
          </div>

          <button type="submit" className="btn-3d-main" style={{ marginTop: '8px', justifyContent: 'center', background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)' }}>
            ยืนยันลงทะเบียน ➔
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          มีบัญชีอยู่แล้ว?{' '}
          <span 
            onClick={() => setAuthMode('login')} 
            style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            เข้าสู่ระบบ
          </span>
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 0.3 หน้าโปรไฟล์ / แก้ไขชื่อ / อัปโหลดรูปภาพ (Profile & Settings)
// ----------------------------------------------------
function ProfileScreen({ setActiveTab, userProfile, setUserProfile, setIsLoggedIn }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userProfile.name);

  // ฟังก์ชันสำหรับเลือกไฟล์ภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUri = URL.createObjectURL(file);
      setUserProfile((prev) => ({ ...prev, avatarUri: imageUri }));
    }
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      setUserProfile((prev) => ({ ...prev, name: newName.trim() }));
      setIsEditing(false);
    }
  };

  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '16px' }}>👤 โปรไฟล์ส่วนตัว</div>

      <div className="card-item" style={{ textAlign: 'center', padding: '20px 16px' }}>
        {/* ส่วนรูปโปรไฟล์ที่สามารถคลิกเลือกรูปได้ */}
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px auto' }}>
          <label htmlFor="avatar-file-input" style={{ cursor: 'pointer' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#dbeafe',
              border: '3px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
            }}>
              {userProfile.avatarUri ? (
                <img src={userProfile.avatarUri} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af' }}>
                  {userProfile.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* ปุ่มกล้องเล็กๆ มุมขวาลงมา */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#2563eb',
              color: '#ffffff',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              border: '2px solid #ffffff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}>
              📷
            </div>
          </label>
          <input 
            id="avatar-file-input" 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #3b82f6', outline: 'none', fontSize: '16px', textAlign: 'center', width: '85%' }}
              required
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button type="submit" style={{ padding: '6px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                💾 บันทึก
              </button>
              <button type="button" onClick={() => { setIsEditing(false); setNewName(userProfile.name); }} style={{ padding: '6px 14px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                ยกเลิก
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h3 style={{ margin: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {userProfile.name}
              <span onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', fontSize: '15px' }} title="แก้ไขชื่อ">✏️</span>
            </h3>
            <p style={{ color: '#2563eb', fontSize: '13px', margin: '6px 0 0 0', fontWeight: '600' }}>
              ✉️ {userProfile.email}
            </p>
          </div>
        )}
      </div>

      <div className="card-item">
        <strong style={{ color: '#1e3a8a' }}>⚙️ ตั้งค่าอุปกรณ์ Smart Shoes</strong>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>สถานะการเชื่อมต่อ: 🟢 เชื่อมต่อแล้ว (BLE Active)</p>
      </div>

      <button 
        onClick={() => setIsLoggedIn(false)} 
        className="btn-3d-main" 
        style={{ 
          background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)', 
          boxShadow: '0 6px 0px #991b1b, 0 10px 15px rgba(239, 68, 68, 0.2)',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        🚪 ออกจากระบบ (Log Out)
      </button>
    </div>
  );
}

// ----------------------------------------------------
// 1. หน้าหลัก Knee Health Dashboard
// ----------------------------------------------------
function DashboardScreen({ setActiveTab, safetyScore, setSafetyScore, userProfile }) {
  const status = getScoreStatus(safetyScore);

  return (
    <div className="screen">
      <div className="top-nav-bar">
        <div className="header-title">
          <span className="icon-badge">🦵</span> Smart Shoes
        </div>
        <div 
          onClick={() => setActiveTab('profile')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '13px', 
            fontWeight: '700', 
            color: '#1e40af', 
            background: '#dbeafe', 
            padding: '4px 10px 4px 6px', 
            borderRadius: '20px', 
            cursor: 'pointer' 
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#2563eb',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {userProfile.avatarUri ? (
              <img src={userProfile.avatarUri} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userProfile.name.charAt(0).toUpperCase()
            )}
          </div>
          {userProfile.name.split(' ')[0]}
        </div>
      </div>
      
      {/* วงกลม Gauge แสดงคะแนน */}
      <div className="gauge-card">
        <div className="gauge-circle">
          <div className="gauge-inner">
            <span className="score-num">{safetyScore}</span>
            <span className="score-label">คะแนนสุขภาพ</span>
          </div>
        </div>
        <div className="status-pill" style={{ background: status.bg }}>
          {status.text}
        </div>
      </div>

      {/* แถบจำลองปรับคะแนน */}
      <div className="simulator-box">
        <label>🎛️ ทดสอบปรับคะแนนสุขภาพ: <strong>{safetyScore} / 100</strong></label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={safetyScore} 
          onChange={(e) => setSafetyScore(Number(e.target.value))}
          className="score-slider"
        />
      </div>

      {/* เมนูการ์ดใหญ่ 4 ฟังก์ชันหลัก */}
      <div className="menu-grid">
        <div className="menu-card-btn" onClick={() => setActiveTab('live')}>
          <div className="menu-card-icon">👣</div>
          <span className="menu-card-title">แรงกดฝ่าเท้า</span>
          <span className="menu-card-sub">Live Pressure</span>
        </div>

        <div className="menu-card-btn" onClick={() => setActiveTab('mission')}>
          <div className="menu-card-icon">🎯</div>
          <span className="menu-card-title">ภารกิจสะสม</span>
          <span className="menu-card-sub">Daily & Weekly</span>
        </div>

        <div className="menu-card-btn" onClick={() => setActiveTab('history')}>
          <div className="menu-card-icon">📊</div>
          <span className="menu-card-title">ประวัติย้อนหลัง</span>
          <span className="menu-card-sub">Progress & History</span>
        </div>

        <div className="menu-card-btn" onClick={() => setActiveTab('achievement')}>
          <div className="menu-card-icon">🏆</div>
          <span className="menu-card-title">ถ้วยรางวัล</span>
          <span className="menu-card-sub">Badges & Titles</span>
        </div>
      </div>

      {/* ปุ่มทางลัดวิเคราะห์เพิ่มเติม */}
      <button className="btn-3d-main" onClick={() => setActiveTab('activity')}>
        <span>🏃 Activity : เดินพื้นราบ</span>
        <span>➔</span>
      </button>

      <button className="btn-3d-main" style={{ background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)' }} onClick={() => setActiveTab('gait')}>
        <span>📊 Gait Analysis : ความสมดุล 72%</span>
        <span>➔</span>
      </button>
    </div>
  );
}

// ----------------------------------------------------
// 2. หน้า Live Pressure Map (ดีไซน์ฝ่าเท้าสแกน Heatmap สมจริง)
// ----------------------------------------------------
function LivePressureScreen({ setActiveTab }) {
  // ค่าแรงกดจำลองของเซนเซอร์ทั้ง 4 จุด (0 - 100%)
  const [sensorValues, setSensorValues] = useState({
    greatToe: 40,   // นิ้วหัวแม่เท้า (Great Toe)
    mtp1: 85,       // เนินกระดูกฝ่าเท้าด้านใน (1st MTP)
    mtp5: 55,       // เนินฝ่าเท้าด้านนอก (5th MTP)
    heel: 90,       // ส้นเท้า (Heel)
  });

  // ฟังก์ชันคำนวณสีสำหรับจุดความร้อน Heatmap
  const getHeatmapColor = (val) => {
    if (val < 40) return { core: '#10b981', mid: '#34d399', outer: '#a7f3d0' }; // 🟢 สีเขียว
    if (val < 75) return { core: '#f59e0b', mid: '#fbbf24', outer: '#fde68a' }; // 🟡 สีส้ม/เหลือง
    return { core: '#ef4444', mid: '#f97316', outer: '#fde047' };               // 🔴 สีแดง/ส้มเข้ม
  };

  const handleSliderChange = (key, val) => {
    setSensorValues((prev) => ({ ...prev, [key]: Number(val) }));
  };

  const toeColors = getHeatmapColor(sensorValues.greatToe);
  const mtp1Colors = getHeatmapColor(sensorValues.mtp1);
  const mtp5Colors = getHeatmapColor(sensorValues.mtp5);
  const heelColors = getHeatmapColor(sensorValues.heel);

  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '12px' }}>👣 Live Pressure Map</div>

      <div className="card-item" style={{ textAlign: 'center', padding: '16px 8px', background: 'linear-gradient(180deg, #edf7ff 0%, #e0f2fe 100%)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: '800' }}>แรงกดเท้าขณะนี้</h3>
        
        {/* SVG แสดงรูปฝ่าเท้า Heatmap ดีไซน์สมจริง */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px', margin: '0 auto' }}>
          <svg viewBox="0 0 340 280" width="100%" height="100%" style={{ filter: 'drop-shadow(0px 8px 16px rgba(14, 165, 233, 0.15))' }}>
            <defs>
              {/* ฟิลเตอร์กระจายความร้อนเนียนนุ่ม */}
              <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
              <filter id="ultraSoftBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>

              {/* การไล่เฉดสีตัวฝ่าเท้า (3D Cyan-Blue Gradient) */}
              <linearGradient id="footBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="40%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>

              {/* Gradient 1. Great Toe */}
              <radialGradient id="gradToe" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={toeColors.core} stopOpacity="1" />
                <stop offset="50%" stopColor={toeColors.mid} stopOpacity="0.8" />
                <stop offset="100%" stopColor={toeColors.outer} stopOpacity="0" />
              </radialGradient>

              {/* Gradient 2. 1st MTP */}
              <radialGradient id="gradMtp1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={mtp1Colors.core} stopOpacity="1" />
                <stop offset="55%" stopColor={mtp1Colors.mid} stopOpacity="0.85" />
                <stop offset="100%" stopColor={mtp1Colors.outer} stopOpacity="0" />
              </radialGradient>

              {/* Gradient 3. 5th MTP */}
              <radialGradient id="gradMtp5" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={mtp5Colors.core} stopOpacity="1" />
                <stop offset="55%" stopColor={mtp5Colors.mid} stopOpacity="0.85" />
                <stop offset="100%" stopColor={mtp5Colors.outer} stopOpacity="0" />
              </radialGradient>

              {/* Gradient 4. Heel */}
              <radialGradient id="gradHeel" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={heelColors.core} stopOpacity="1" />
                <stop offset="50%" stopColor={heelColors.mid} stopOpacity="0.85" />
                <stop offset="100%" stopColor={heelColors.outer} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ==================== เท้าซ้าย (Left Foot) ==================== */}
            <g transform="translate(45, 15)">
              {/* ตัวฝ่าเท้า + นิ้วเท้าทั้ง 5 */}
              <g fill="url(#footBaseGrad)" opacity="0.92">
                {/* นิ้วหัวแม่เท้า */}
                <ellipse cx="66" cy="22" rx="11" ry="15" />
                {/* นิ้วชี้ */}
                <ellipse cx="48" cy="26" rx="6.5" ry="10" />
                {/* นิ้วกลาง */}
                <ellipse cx="36" cy="32" rx="5.5" ry="8.5" />
                {/* นิ้วนาง */}
                <ellipse cx="26" cy="40" rx="5" ry="7" />
                {/* นิ้วก้อย */}
                <ellipse cx="18" cy="50" rx="4.5" ry="6" />
                
                {/* อุ้งเท้าและส้นเท้าหลัก */}
                <path d="M 68,36 C 82,38 88,60 84,88 C 80,110 82,130 80,150 C 76,180 80,200 70,225 C 55,232 30,232 20,225 C 12,185 18,140 20,110 C 22,75 14,55 32,42 C 45,34 56,36 68,36 Z" />
              </g>

              {/* ชั้นสแกนสีฟ้าสว่างอ่อนกระแทกขอบฝ่าเท้า (Inner Glow Effect) */}
              <path d="M 66,40 C 78,42 82,60 79,88 C 76,110 78,130 76,150 C 72,175 74,195 66,218 C 55,223 33,223 25,218 C 17,180 22,140 23,110 C 25,78 18,60 33,48 C 43,40 54,40 66,40 Z" 
                    fill="#38bdf8" opacity="0.35" filter="url(#softBlur)" />

              {/* Heatmap Layer - จุดความร้อนละมุน 4 จุด */}
              {/* 1. นิ้วหัวแม่เท้า */}
              <circle cx="66" cy="22" r="18" fill="url(#gradToe)" filter="url(#softBlur)" />
              
              {/* 2. เนินฝ่าเท้าด้านใน (1st MTP) */}
              <circle cx="62" cy="85" r="28" fill="url(#gradMtp1)" filter="url(#softBlur)" />

              {/* 3. เนินฝ่าเท้าด้านนอก (5th MTP) */}
              <circle cx="32" cy="100" r="22" fill="url(#gradMtp5)" filter="url(#softBlur)" />

              {/* 4. ส้นเท้า (Heel) */}
              <circle cx="46" cy="190" r="30" fill="url(#gradHeel)" filter="url(#softBlur)" />

              {/* จุดเป้าหมาย Target Point (วงกลมสีขาวขอบเข้ม) */}
              <circle cx="66" cy="22" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="62" cy="85" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="32" cy="100" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="46" cy="190" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            </g>

            {/* ==================== เท้าขวา (Right Foot) ==================== */}
            <g transform="translate(170, 15)">
              {/* ตัวฝ่าเท้า + นิ้วเท้าทั้ง 5 */}
              <g fill="url(#footBaseGrad)" opacity="0.92">
                {/* นิ้วหัวแม่เท้า */}
                <ellipse cx="14" cy="22" rx="11" ry="15" />
                {/* นิ้วชี้ */}
                <ellipse cx="32" cy="26" rx="6.5" ry="10" />
                {/* นิ้วกลาง */}
                <ellipse cx="44" cy="32" rx="5.5" ry="8.5" />
                {/* นิ้วนาง */}
                <ellipse cx="54" cy="40" rx="5" ry="7" />
                {/* นิ้วก้อย */}
                <ellipse cx="62" cy="50" rx="4.5" ry="6" />

                {/* อุ้งเท้าและส้นเท้าหลัก */}
                <path d="M 12,36 C -2,38 -8,60 -4,88 C 0,110 -2,130 0,150 C 4,180 0,200 10,225 C 25,232 50,232 60,225 C 68,185 62,140 60,110 C 58,75 66,55 48,42 C 35,34 24,36 12,36 Z" />
              </g>

              {/* ชั้นสแกนสีฟ้าสว่างอ่อน */}
              <path d="M 14,40 C 2,42 -2,60 1,88 C 4,110 2,130 4,150 C 8,175 6,195 14,218 C 25,223 47,223 55,218 C 63,180 58,140 57,110 C 55,78 62,60 47,48 C 37,40 26,40 14,40 Z" 
                    fill="#38bdf8" opacity="0.35" filter="url(#softBlur)" />

              {/* Heatmap Layer - เท้าขวา */}
              <circle cx="14" cy="22" r="18" fill="url(#gradToe)" filter="url(#softBlur)" />
              <circle cx="18" cy="85" r="28" fill="url(#gradMtp1)" filter="url(#softBlur)" />
              <circle cx="48" cy="100" r="22" fill="url(#gradMtp5)" filter="url(#softBlur)" />
              <circle cx="34" cy="190" r="30" fill="url(#gradHeel)" filter="url(#softBlur)" />

              {/* จุดเป้าหมาย Target Point */}
              <circle cx="14" cy="22" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="18" cy="85" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="48" cy="100" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="34" cy="190" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            </g>

            {/* ==================== เส้นชี้ตำแหน่ง & ป้ายข้อความ (Pointer Lines) ==================== */}
            {/* 1. Great Toe Line */}
            <path d="M 111, 37 L 20, 37" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="20" cy="37" r="3" fill="#0284c7" />
            <text x="22" y="32" fill="#0369a1" fontSize="10" fontWeight="bold">Great Toe</text>

            {/* 2. 5th MTP Line (เนินนอก) */}
            <path d="M 77, 115 L 12, 115" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="12" cy="115" r="3" fill="#0284c7" />
            <text x="14" y="110" fill="#0369a1" fontSize="10" fontWeight="bold">5th MTP</text>

            {/* 3. 1st MTP Line (เนินใน) */}
            <path d="M 188, 100 L 320, 100" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="320" cy="100" r="3" fill="#0284c7" />
            <text x="272" y="95" fill="#0369a1" fontSize="10" fontWeight="bold">1st MTP</text>

            {/* 4. Heel Line */}
            <path d="M 204, 205 L 320, 205" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="320" cy="205" r="3" fill="#0284c7" />
            <text x="288" y="200" fill="#0369a1" fontSize="10" fontWeight="bold">Heel</text>
          </svg>
        </div>

        {/* แถบอธิบายระดับสี */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '11px', marginTop: '10px', fontWeight: '700', background: '#ffffff', padding: '8px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> แรงน้อย (&lt;40%)</span>
          <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span> ปานกลาง</span>
          <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span> แรงมาก (&gt;75%)</span>
        </div>
      </div>

      {/* แผงจำลองปรับค่าเซนเซอร์ 4 จุด */}
      <div className="simulator-box" style={{ marginBottom: '14px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}>🎛️ ทดสอบปรับค่าแรงกดจุดเซนเซอร์ (FSR)</h4>

        <label style={{ fontSize: '13px' }}>1. 🦶 <strong>นิ้วหัวแม่เท้า (Great Toe):</strong> {sensorValues.greatToe}%</label>
        <input 
          type="range" min="0" max="100" value={sensorValues.greatToe} 
          onChange={(e) => handleSliderChange('greatToe', e.target.value)} 
          className="score-slider" 
        />

        <label style={{ fontSize: '13px', marginTop: '8px' }}>2. 🦴 <strong>เนินกระดูกฝ่าเท้าด้านใน (1st MTP):</strong> {sensorValues.mtp1}%</label>
        <input 
          type="range" min="0" max="100" value={sensorValues.mtp1} 
          onChange={(e) => handleSliderChange('mtp1', e.target.value)} 
          className="score-slider" 
        />

        <label style={{ fontSize: '13px', marginTop: '8px' }}>3. 🦶 <strong>เนินฝ่าเท้าด้านนอก (5th MTP):</strong> {sensorValues.mtp5}%</label>
        <input 
          type="range" min="0" max="100" value={sensorValues.mtp5} 
          onChange={(e) => handleSliderChange('mtp5', e.target.value)} 
          className="score-slider" 
        />

        <label style={{ fontSize: '13px', marginTop: '8px' }}>4. 🔴 <strong>ส้นเท้า (Heel):</strong> {sensorValues.heel}%</label>
        <input 
          type="range" min="0" max="100" value={sensorValues.heel} 
          onChange={(e) => handleSliderChange('heel', e.target.value)} 
          className="score-slider" 
        />
      </div>

      {/* สรุปสถานะแยกตามจุด */}
      <div className="card-item">
        <strong style={{ color: '#2563eb' }}>📌 การวิเคราะห์แรงกด 4 จุด:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
          <li>
            <strong>ส้นเท้า (Heel):</strong> {sensorValues.heel > 75 ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ แรงกระแทกสูง เสี่ยงต่อข้อเข่า</span> : '✅ แรงกดปกติ'}
          </li>
          <li>
            <strong>เนินฝ่าเท้าด้านใน (1st MTP):</strong> {sensorValues.mtp1 > 75 ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ ทิ้งน้ำหนักด้านในมากเกินไป</span> : '✅ สมดุลดี'}
          </li>
          <li>
            <strong>เนินฝ่าเท้าด้านนอก (5th MTP):</strong> {sensorValues.mtp5 > 75 ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ ทิ้งน้ำหนักขอบนอกมากเกินไป</span> : '✅ สมดุลดี'}
          </li>
          <li>
            <strong>นิ้วหัวแม่เท้า (Great Toe):</strong> {sensorValues.greatToe > 75 ? <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ ใช้ปลายเท้าถีบตัวแรงเกินไป</span> : '✅ สมดุลดี'}
          </li>
        </ul>
      </div>
    </div>
  );
}
// ----------------------------------------------------
// 3. หน้า Mission (ภารกิจรายวัน & รายสัปดาห์)
// ----------------------------------------------------
function MissionScreen({ setActiveTab }) {
  const [missionTab, setMissionTab] = useState('daily'); // 'daily' หรือ 'weekly'

  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '14px' }}>🎯 ภารกิจสะสมแต้ม</div>

      {/* แท็บสลับ รายวัน / รายสัปดาห์ */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#dbeafe', padding: '4px', borderRadius: '18px' }}>
        <button 
          style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            background: missionTab === 'daily' ? '#2563eb' : 'transparent',
            color: missionTab === 'daily' ? '#ffffff' : '#1e40af',
            transition: 'all 0.2s'
          }}
          onClick={() => setMissionTab('daily')}
        >
          ☀️ ภารกิจรายวัน
        </button>
        <button 
          style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            background: missionTab === 'weekly' ? '#2563eb' : 'transparent',
            color: missionTab === 'weekly' ? '#ffffff' : '#1e40af',
            transition: 'all 0.2s'
          }}
          onClick={() => setMissionTab('weekly')}
        >
          📅 ภารกิจรายสัปดาห์
        </button>
      </div>

      {/* รายการภารกิจรายวัน */}
      {missionTab === 'daily' && (
        <>
          <div className="card-item" style={{ background: '#fef3c7', borderColor: '#fde047' }}>
            <h4 style={{ margin: 0, color: '#b45309' }}>🪙 สรุปเหรียญรางวัลวันนี้</h4>
            <p style={{ margin: '4px 0 0 0', color: '#d97706', fontSize: '13px', fontWeight: '600' }}>ได้รับแล้ว +15 เหรียญทอง</p>
          </div>

          <div className="card-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>🚶 เดินสะสมครบ 3,000 ก้าว</strong>
              <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>+5 🪙</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#10b981', width: '100%', height: '100%' }}></div>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#10b981', fontWeight: '700' }}>สำเร็จแล้ว (3,000/3,000 ก้าว)</p>
          </div>

          <div className="card-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>🛡️ รักษาแรงกดส้นเท้าปลอดภัย</strong>
              <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>+10 🪙</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#3b82f6', width: '85%', height: '100%' }}></div>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#64748b' }}>ความคืบหน้า 85%</p>
          </div>

          <div className="card-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>📱 เข้าเช็กหน้า Live Pressure Map</strong>
              <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>+5 🪙</span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#10b981', fontWeight: '700' }}>สำเร็จแล้ว</p>
          </div>
        </>
      )}

      {/* รายการภารกิจรายสัปดาห์ */}
      {missionTab === 'weekly' && (
        <>
          <div className="card-item" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <h4 style={{ margin: 0, color: '#1e3a8a' }}>🗓️ สรุปภารกิจสัปดาห์นี้</h4>
            <p style={{ margin: '4px 0 0 0', color: '#2563eb', fontSize: '13px', fontWeight: '600' }}>สำเร็จแล้ว 2 จาก 3 ภารกิจ</p>
          </div>

          <div className="card-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>🏃 เดินสะสมรวม 20,000 ก้าว</strong>
              <span style={{ fontSize: '12px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>+50 🪙</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#3b82f6', width: '70%', height: '100%' }}></div>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#64748b' }}>ความคืบหน้า 14,200 / 20,000 ก้าว</p>
          </div>

          <div className="card-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>📊 รักษาสมดุลการเดิน &gt; 80% ครบ 5 วัน</strong>
              <span style={{ fontSize: '12px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>+30 🪙</span>
            </div>
            <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ background: '#10b981', width: '100%', height: '100%' }}></div>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#10b981', fontWeight: '700' }}>สำเร็จแล้ว (5/5 วัน)</p>
          </div>

          <div className="card-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>🦵 ทำคะแนนสุขภาพเฉลี่ยเกณฑ์ดี</strong>
              <span style={{ fontSize: '12px', background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>+40 🪙</span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#10b981', fontWeight: '700' }}>สำเร็จแล้ว</p>
          </div>
        </>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. หน้า Activity
// ----------------------------------------------------
function ActivityScreen({ setActiveTab }) {
  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '16px' }}>🏃 Activity Recognition</div>
      
      <div className="card-item">
        <h4 style={{ margin: '0 0 6px 0', color: '#1e3a8a' }}>ก้าวเดินรวมวันนี้</h4>
        <p style={{ fontSize: '32px', fontWeight: '800', color: '#2563eb', margin: 0 }}>5,420 <span style={{ fontSize: '16px' }}>ก้าว</span></p>
      </div>

      <div className="card-item">
        <h4 style={{ margin: '0 0 6px 0', color: '#1e3a8a' }}>รูปแบบการเคลื่อนไหว</h4>
        <p style={{ margin: 0, color: '#475569' }}>🟢 เดินพื้นราบ: 80%</p>
        <p style={{ margin: '4px 0 0 0', color: '#475569' }}>🟡 ขึ้น-ลงบันได: 20%</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. หน้า Gait Analysis
// ----------------------------------------------------
function GaitAnalysisScreen({ setActiveTab, safetyScore }) {
  const status = getScoreStatus(safetyScore);

  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '16px' }}>📊 Gait Analysis</div>

      <div className="card-item" style={{ borderLeft: `6px solid ${status.bg}` }}>
        <h3 style={{ margin: '0 0 4px 0', color: '#1e3a8a' }}>การประเมินลงน้ำหนัก</h3>
        <p style={{ color: status.bg, fontWeight: '700', margin: 0 }}>{status.text}</p>
      </div>

      <div className="card-item">
        <strong>ส้นเท้า (Heel Impact)</strong>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0 0' }}>
          {safetyScore < 50 ? "⚠️ ตรวจพบแรงกระแทกส้นเท้าสูงเกินเกณฑ์" : "✅ ลงน้ำหนักส้นเท้าปกติ"}
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 6. หน้า Progress & History
// ----------------------------------------------------
function HistoryScreen({ setActiveTab }) {
  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '16px' }}>📊 Progress & History</div>

      <div className="card-item" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', color: '#2563eb', margin: 0 }}>1,936</h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>ก้าวเดินเฉลี่ยสัปดาห์นี้</p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 7. หน้า Achievements (ถ้วยรางวัลเท่ๆ)
// ----------------------------------------------------
function AchievementScreen({ setActiveTab }) {
  const achievements = [
    {
      id: 1,
      icon: "⚡",
      title: "First Step Titan",
      subTitle: "จ้าวแห่งก้าวแรก",
      desc: "เดินสะสมครบ 5,000 ก้าวแรกในระบบ",
      unlocked: true,
      progressText: "สำเร็จแล้ว (5,000/5,000)",
      percent: 100
    },
    {
      id: 2,
      icon: "🛡️",
      title: "Knee Guardian Pro",
      subTitle: "ผู้พิทักษ์ข้อเข่า",
      desc: "รักษาแรงกดส้นเท้าให้อยู่ในเกณฑ์ปลอดภัยต่อเนื่อง 7 วัน",
      unlocked: true,
      progressText: "สำเร็จแล้ว (7/7 วัน)",
      percent: 100
    },
    {
      id: 3,
      icon: "🎯",
      title: "Mission Master",
      subTitle: "ปรมาจารย์ภารกิจ",
      desc: "พิชิตภารกิจรายวันและรายสัปดาห์รวมกันครบ 15 ครั้ง",
      unlocked: false,
      progressText: "ความคืบหน้า (11/15 ครั้ง)",
      percent: 73
    },
    {
      id: 4,
      icon: "👑",
      title: "Gait Balance King",
      subTitle: "ราชาแห่งความสมดุล",
      desc: "ทำคะแนน Gait Analysis ความสมดุลซ้าย-ขวา เกิน 90% ครบ 5 ครั้ง",
      unlocked: false,
      progressText: "ความคืบหน้า (2/5 ครั้ง)",
      percent: 40
    }
  ];

  return (
    <div className="screen">
      <button className="btn-back-cute" onClick={() => setActiveTab('dashboard')}>🏠 กลับหน้าหลัก</button>
      <div className="header-title" style={{ marginBottom: '14px' }}>🏆 ถ้วยรางวัล & ฉายา</div>

      <div className="card-item" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', textAlign: 'center', borderColor: '#93c5fd' }}>
        <span style={{ fontSize: '32px' }}>🎖️</span>
        <h4 style={{ margin: '4px 0 0 0', color: '#1e3a8a' }}>ปลดล็อกแล้ว 2 / 4 ถ้วยรางวัล</h4>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#2563eb' }}>สะสมถ้วยรางวัลเพื่อรับฉายาพิเศษ!</p>
      </div>

      {achievements.map((item) => (
        <div 
          key={item.id} 
          className="card-item" 
          style={{ 
            opacity: item.unlocked ? 1 : 0.85, 
            background: item.unlocked ? '#ffffff' : '#f8fafc',
            borderLeft: item.unlocked ? '6px solid #10b981' : '6px solid #94a3b8' 
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              fontSize: '32px', 
              background: item.unlocked ? '#fef3c7' : '#e2e8f0', 
              width: '52px', 
              height: '52px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: item.unlocked ? '0 4px 8px rgba(245, 158, 11, 0.2)' : 'none'
            }}>
              {item.unlocked ? item.icon : "🔒"}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#1e3a8a', fontSize: '15px' }}>{item.title}</strong>
                {item.unlocked && <span style={{ fontSize: '10px', background: '#d1fae5', color: '#047857', padding: '2px 6px', borderRadius: '8px', fontWeight: '700' }}>UNLOCKED</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', display: 'block' }}>คำโปรย: {item.subTitle}</span>
            </div>
          </div>

          <p style={{ margin: '10px 0 6px 0', fontSize: '12px', color: '#475569' }}>
            📋 <strong>ภารกิจ:</strong> {item.desc}
          </p>

          <div style={{ background: '#e2e8f0', height: '8px', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ background: item.unlocked ? '#10b981' : '#3b82f6', width: `${item.percent}%`, height: '100%' }}></div>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: item.unlocked ? '#10b981' : '#64748b', fontWeight: '700', textAlign: 'right' }}>
            {item.progressText}
          </p>
        </div>
      ))}
    </div>
  );
}