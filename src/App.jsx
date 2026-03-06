import React, { useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import AdhkarDetail from "./AdhkarDetail";
import { adhkarData } from "./AdhkarData.js";

// Import images
import NotifIcon from "./assets/images/Notif.svg";
import SettingsIcon from "./assets/images/Settings.svg";
import MoonIcon from "./assets/images/Moon.svg";
import QuranIcon from "./assets/images/Quran.svg";
import AdhkarIcon from "./assets/images/AfterSalat.svg";
import MorningIcon from "./assets/images/Morning.svg";
import EveningIcon from "./assets/images/Evening.svg";
import WakeUpIcon from "./assets/images/WakeUp.svg";
import SleepIcon from "./assets/images/Sleep.svg";

// Petit composant pour les icônes de prière
const PrayerIcon = ({ name, isDone, onClick, children }) => (
  <div className="name-element" onClick={onClick} style={{ cursor: 'pointer' }}>
    <svg
      className={`prayer-icon ${isDone ? "active" : ""}`}
      viewBox="0 0 50 50"
      width="35"
      height="35"
      fill="none"
      stroke={isDone ? "var(--success)" : "var(--font-weak)"}
      strokeWidth="2"
    >
      {children}
    </svg>
    <span style={{ color: isDone ? "var(--success)" : "var(--font-main)", fontSize: "0.8rem" }}>
      {name}
    </span>
  </div>
);

function App() {
  const [prayers, setPrayers] = useState([false, false, false, false, false]);
  const [refresh, setRefresh] = useState(0);
  const completedCount = prayers.filter((p) => p === true).length;
  const percentage = Math.round((completedCount / 5) * 100);

  const togglePrayer = (index) => {
    const newPrayers = [...prayers];
    newPrayers[index] = !newPrayers[index];
    setPrayers(newPrayers);
  };

  // On calcule le progrès pour chaque catégorie
  const categories = [
    { id: "1", title: "Wake up Adkar", key: "wakeup", icon: WakeUpIcon, color: "#FFB347" },
    { id: "2", title: "Morning Adkar", key: "morning", icon: MorningIcon, color: "#FFD93D" },
    { id: "3", title: "Evening Adkar", key: "evening", icon: EveningIcon, color: "#A29BFE" },
    { id: "4", title: "Sleep Adkar", key: "sleep", icon: SleepIcon, color: "#74B9FF" },
    { id: "5", title: "After Prayers Adkar", key: "after_prayer", icon: AdhkarIcon, color: "#55E6C1" },
  ].map(cat => {
    // Récupérer la sauvegarde spécifique à cette catégorie
    const saved = JSON.parse(localStorage.getItem(`progress-${cat.id}`) || "{}");
    const data = adhkarData[cat.key] || { quran: [], hadith: [] };

    // On combine Quran et Hadith pour le total
    const allItems = [...data.quran, ...data.hadith];
    const total = allItems.length;

    // On compte combien sont terminés (count atteint)
    const completed = allItems.filter(item => (saved[item.id] || 0) >= item.count).length;

    return { ...cat, total, completed };
  });

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
          <main key={refresh}>
            <div className="options">
              <img src={NotifIcon} alt="Notif" />
              <img src={SettingsIcon} alt="Settings" />
            </div>

            <h1 className="page-title">Omar</h1>

            {/* Daily Progress Circle Card */}
            <div className="progress-container">
              <div className="card">
                <h2>{completedCount === 5 ? "All Done! Alhamdulillah" : "Daily Progress"}</h2>
                <div className="progress-info">
                  <div className="ring">
                    <svg viewBox="0 0 120 120">
                      {prayers.map((isDone, index) => (
                        <circle key={index} className={`seg ${isDone ? "active" : ""}`} cx="60" cy="60" r="45" />
                      ))}
                    </svg>
                    <p className="progress-score">{percentage}%</p>
                  </div>
                  <div className="progress-comment">
                    <div className="prayer-done-icon">
                      <p><span className="prayer-done">{completedCount}</span> Prayers Done</p>
                      <img src={MoonIcon} alt="Moon" />
                    </div>
                    <p className="prayer-left"><span>{5 - completedCount}</span> Left</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="page-title">Daily Goals</h2>
            <div className="card">
              <div className="name-icon" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <PrayerIcon name="Fajr" isDone={prayers[0]} onClick={() => togglePrayer(0)}><path d="M15.8092 23.609L17.6422 25.442" /><path d="M25.2961 21L25.2961 23.5923" /><path d="M12 32.8H14.6" /><path d="M35.3999 32.8H37.9999" /><path d="M34.191 23.609L32.358 25.442" /><path d="M38 38H12" /><path d="M30.2 32.8C30.2 31.4208 29.6522 30.0982 28.677 29.123C27.7018 28.1478 26.3792 27.6 25 27.6C23.6209 27.6 22.2983 28.1478 21.3231 29.123C20.3479 30.0982 19.8 31.4208 19.8 32.8" /></PrayerIcon>
                <PrayerIcon name="Dhuhr" isDone={prayers[1]} onClick={() => togglePrayer(1)}><path d="M25 31.6666C27.9739 31.6666 30.3846 29.2558 30.3846 26.282C30.3846 23.3082 27.9739 20.8974 25 20.8974C22.0262 20.8974 19.6154 23.3082 19.6154 26.282C19.6154 29.2558 22.0262 31.6666 25 31.6666Z" /><path d="M25 12.8205V15.5128" /><path d="M25 37.0512V39.7435" /><path d="M15.4827 16.7647L17.3808 18.6628" /><path d="M32.6192 33.9012L34.5173 35.7993" /><path d="M11.5384 26.282H14.2307" /><path d="M35.7693 26.282H38.4617" /><path d="M17.3808 33.9012L15.4827 35.7993" /><path d="M34.5173 16.7647L32.6192 18.6628" /></PrayerIcon>
                <PrayerIcon name="Asr" isDone={prayers[2]} onClick={() => togglePrayer(2)}><path d="M25 31.6666C27.9739 31.6666 30.3846 29.2558 30.3846 26.282C30.3846 23.3082 27.9739 20.8974 25 20.8974C22.0262 20.8974 19.6154 23.3082 19.6154 26.282C19.6154 29.2558 22.0262 31.6666 25 31.6666Z" /><path d="M25 12.8205V15.5128" /><path d="M25 37.0512V39.7435" /><path d="M15.4827 16.7647L17.3808 18.6628" /><path d="M32.6192 33.9012L34.5173 35.7993" /><path d="M11.5384 26.282H14.2307" /><path d="M35.7693 26.282H38.4617" /><path d="M17.3808 33.9012L15.4827 35.7993" /><path d="M34.5173 16.7647L32.6192 18.6628" /></PrayerIcon>
                <PrayerIcon name="Maghrib" isDone={prayers[3]} onClick={() => togglePrayer(3)}><path d="M25.5 26.4V14" /><path d="M14.5415 27.8416L16.727 30.027" /><path d="M10 38.7999H13.1" /><path d="M37.8999 38.7999H40.9999" /><path d="M36.4584 27.8416L34.2729 30.027" /><path d="M40.9999 45H10" /><path d="M31.7 20.2001L25.5 26.4001L19.3 20.2001" /><path d="M31.7 38.8C31.7 37.1556 31.0468 35.5786 29.884 34.4159C28.7213 33.2532 27.1443 32.6 25.5 32.6C23.8556 32.6 22.2786 33.2532 21.1159 34.4159C19.9532 35.5786 19.3 37.1556 19.3 38.8" /></PrayerIcon>
                <PrayerIcon name="Isha" isDone={prayers[4]} onClick={() => togglePrayer(4)}><path d="M33.985 25.486C33.8912 27.2221 33.2966 28.894 32.273 30.2994C31.2494 31.7048 29.8407 32.7837 28.217 33.4055C26.5933 34.0274 24.8243 34.1656 23.1237 33.8035C21.4232 33.4414 19.8639 32.5945 18.6344 31.3651C17.4049 30.1358 16.5579 28.5766 16.1956 26.8761C15.8333 25.1756 15.9714 23.4065 16.593 21.7828C17.2147 20.1591 18.2934 18.7502 19.6987 17.7264C21.1041 16.7027 22.7758 16.1079 24.512 16.014C24.917 15.992 25.129 16.474 24.914 16.817C24.1949 17.9675 23.8869 19.3278 24.0405 20.6759C24.194 22.024 24.7999 23.2803 25.7593 24.2397C26.7187 25.199 27.9749 25.805 29.323 25.9585C30.6711 26.112 32.0314 25.8041 33.182 25.085C33.526 24.87 34.007 25.081 33.985 25.486Z" /></PrayerIcon>
              </div>
            </div>

            {/* Adhkars List with Bars */}
            <h2 className="page-title">Adhkars</h2>
            <div className="adhkar-grid">
              {categories.map((item) => (
                <Link to={`/adhkar/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                  <div className="card-adhkar">
                    <div className="card-adhkar-left">
                      <h3>{item.title}</h3>
                      <p className="mini-progress-text">
                        <b>{item.completed}/{item.total}</b> Adkhar read today :
                      </p>
                      {/* LA BARRE VERTE */}
                      <div className="mini-progress-bar">
                        <div
                          className="mini-progress-fill"
                          style={{ width: `${item.total > 0 ? (item.completed / item.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="icon-circle" style={{ backgroundColor: item.color }}>
                      <img src={item.icon} alt={item.title} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        } />
        <Route path="/adhkar/:id" element={<AdhkarDetail setRefresh={setRefresh} />} />
      </Routes>
    </div>
  );
}

export default App;