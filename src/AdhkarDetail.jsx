import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adhkarData } from "./AdhkarData.js";
import NotifIcon from "./assets/images/Notif.svg";
import SettingsIcon from "./assets/images/Settings.svg";

const AdhkarDetail = ({ setRefresh }) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [source, setSource] = useState("quran");

    const idMap = {
        "1": "wakeup",
        "2": "morning",
        "3": "evening",
        "4": "sleep",
        "5": "after_prayer"
    };

    const categoryKey = idMap[id] || id;
    const categoryData = adhkarData[categoryKey] || { quran: [], hadith: [] };
    const currentList = categoryData[source] || [];

    // charger sauvegarde
    const [userCounts, setUserCounts] = useState(() => {
        const saved = localStorage.getItem(`progress-${id}`);
        return saved ? JSON.parse(saved) : {};
    });
    useEffect(() => {
        localStorage.setItem(`progress-${id}`, JSON.stringify(userCounts));
    }, [userCounts, id]);

    // incrémenter compteur
    const handleIncrement = (itemId, maxCount) => {

        const current = userCounts[itemId] || 0;

        if (current < maxCount) {

            const newCounts = {
                ...userCounts,
                [itemId]: current + 1
            };

            setUserCounts(newCounts);

            localStorage.setItem(
                `progress-${id}`,
                JSON.stringify(newCounts)
            );
        }
    };

    // bouton finish
    const handleFinish = () => {
        setRefresh((prev) => prev + 1);
        navigate("/");
    };

    // calcul progression
    const allItems = [
        ...categoryData.quran,
        ...categoryData.hadith
    ];

    const completedItems = allItems.filter(
        item => (userCounts[item.id] || 0) >= item.count
    ).length;

    const progressPercent =
        allItems.length > 0
            ? (completedItems / allItems.length) * 100
            : 0;

    return (

        <div className="detail-page">

            {/* HEADER */}

            <div className="detail-header">

                <button
                    className="back-btn"
                    onClick={handleFinish}
                >
                    ❮
                </button>

                <div className="options">
                    <img src={NotifIcon} alt="Notif" />
                    <img src={SettingsIcon} alt="Settings" />
                </div>

            </div>


            {/* SELECTOR */}

            <div className="source-selector">

                <button
                    className={`btn-source ${source === "quran" ? "active" : ""}`}
                    onClick={() => setSource("quran")}
                >
                    From Quran
                </button>

                <button
                    className={`btn-source ${source === "hadith" ? "active" : ""}`}
                    onClick={() => setSource("hadith")}
                >
                    From Hadith
                </button>

            </div>


            {/* PROGRESS BAR */}

            <div className="progress-container-detail">

                <div
                    className="progress-fill-green"
                    style={{ width: `${progressPercent}%` }}
                ></div>

            </div>


            {/* LIST */}

            <div className="adhkar-list-grid">

                {currentList.map((item) => {

                    const count = userCounts[item.id] || 0;

                    const isDone = count >= item.count;

                    return (

                        <div
                            key={item.id}
                            className={`adhkar-card-detail ${isDone ? "completed" : ""}`}
                            onClick={() => handleIncrement(item.id, item.count)}
                        >

                            <p className="arabic-text">
                                {item.zekr}
                            </p>

                            <div className="card-footer">

                                <span className="tag-green">
                                    {item.description}
                                </span>

                            </div>

                            <div className={`floating-badge ${isDone ? "done" : ""}`}>

                                {isDone ? "✓" : `${count}/${item.count}`}

                            </div>

                        </div>

                    );

                })}

            </div>


            {/* FINISH BUTTON */}

            <button
                className="next-button-gold"
                onClick={handleFinish}
            >
                Finish
            </button>

        </div>
    );
};

export default AdhkarDetail;