import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!auth.currentUser) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "notes"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotes(notesData);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={() => navigate("/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Note
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading notes...</p>
      )}

      {/* Notes List */}
      <div className="grid gap-6">
        {notes.map((note) => {
          const progress = note.progress || 0;

          return (
            <div
              key={note.id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {note.title}
                </h2>

                <button
                  onClick={() => navigate(`/note/${note.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Open
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm mt-2 text-gray-600">
                {progress}% Complete
              </p>

              {progress === 100 && (
                <p className="text-green-600 text-sm font-semibold mt-1">
                  ✔ Completed
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Dashboard;


