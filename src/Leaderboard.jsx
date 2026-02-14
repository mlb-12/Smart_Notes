import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(
        collection(db, "users"),
        orderBy("xp", "desc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          🏆 Leaderboard
        </h1>

        <div className="space-y-4">

          {users.map((user, index) => (
            <div
              key={user.id}
              className={`flex justify-between items-center p-4 rounded-xl shadow-sm 
                ${index === 0 ? "bg-yellow-100" :
                  index === 1 ? "bg-gray-100" :
                  index === 2 ? "bg-orange-100" :
                  "bg-white"}`}
            >
              <div className="flex items-center gap-4">
                <span className="font-bold">#{index + 1}</span>
                <span>{user.email}</span>
              </div>

              <div className="text-right">
                <p>⭐ {user.xp} XP</p>
                <p className="text-sm text-gray-600">
                  Level {user.level}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
