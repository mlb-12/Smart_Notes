import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

function GamificationPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;

      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // If no user doc exists, show default data
          setUserData({
            xp: 0,
            level: 1,
            streak: 0
          });
        }
      } catch (error) {
        console.log(error);
        setUserData({
          xp: 0,
          level: 1,
          streak: 0
        });
      }
    };

    fetchUser();
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );
  }

  const xpPercent = (userData.xp % 100);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-blue-100">

      <h1 className="text-3xl font-bold mb-8">
        🎮 Gamification Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold">Level</h2>
        <p className="text-3xl font-bold mt-2">
          {userData.level}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold">XP Progress</h2>

        <div className="w-full bg-gray-200 h-4 rounded-full mt-4">
          <div
            className="bg-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>

        <p className="mt-2 text-gray-600">
          {userData.xp} XP
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold">🔥 Streak</h2>
        <p className="text-3xl font-bold mt-2">
          {userData.streak} days
        </p>
      </div>

    </div>
  );
}

export default GamificationPage;
