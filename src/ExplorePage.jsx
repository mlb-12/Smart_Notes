import { useEffect, useState } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  addDoc 
} from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";

function ExplorePage() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicNotes();
  }, []);

  const fetchPublicNotes = async () => {
    const q = query(
      collection(db, "notes"),
      where("isPublic", "==", true)
    );

    const snapshot = await getDocs(q);

    const notesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setNotes(notesData);
  };

  // ❤️ Like Note
  const handleLike = async (note) => {
    await updateDoc(doc(db, "notes", note.id), {
      likes: (note.likes || 0) + 1
    });

    fetchPublicNotes();
  };

  // ⭐ Fork Note
  const handleFork = async (note) => {
    await addDoc(collection(db, "notes"), {
      title: note.title + " (Forked)",
      content: note.content,
      userId: auth.currentUser.uid,
      authorEmail: auth.currentUser.email,
      isPublic: false,
      progress: 0,
      likes: 0,
      createdAt: new Date()
    });

    alert("Forked to your dashboard!");
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        🌍 Explore Public Notes
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search public notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/3 border p-3 rounded-lg mb-8 
                   dark:bg-gray-800 dark:text-white"
      />

      <div className="grid gap-6">

        {notes
          .filter(note =>
            note.title.toLowerCase().includes(search.toLowerCase())
          )
          .map(note => (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md 
                         hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-xl font-semibold dark:text-white">
                {note.title}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                By {note.authorEmail}
              </p>

              <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                {note.content}
              </p>

              <div className="flex gap-4 mt-4">

                <button
                  onClick={() => navigate(`/note/${note.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>

                <button
                  onClick={() => handleLike(note)}
                  className="text-pink-500"
                >
                  ❤️ {note.likes || 0}
                </button>

                <button
                  onClick={() => handleFork(note)}
                  className="text-green-600"
                >
                  ⭐ Fork
                </button>

              </div>

            </div>
        ))}

      </div>
    </div>
  );
}

export default ExplorePage;
