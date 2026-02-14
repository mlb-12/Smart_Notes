import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import Draggable from "react-draggable";
import { db } from "./firebase";

function NotePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [stamps, setStamps] = useState([]);
  const [placedStamps, setPlacedStamps] = useState([]);

  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState("");

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    fetchNote();
    fetchStamps();
    fetchPlacedStamps();
  }, [id]);

  const fetchNote = async () => {
    const docRef = doc(db, "notes", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setNote(docSnap.data());
    }
  };

  const fetchStamps = async () => {
    const snapshot = await getDocs(
      collection(db, "notes", id, "stamps")
    );

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setStamps(data);
  };

  const fetchPlacedStamps = async () => {
    const snapshot = await getDocs(
      collection(db, "notes", id, "placedStamps")
    );

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setPlacedStamps(data);
  };

  // =========================
  // SMART SUMMARIZE
  // =========================

  const handleSmartSummarize = () => {
    if (!note?.content) return;

    setSummarizing(true);

    setTimeout(() => {
      const sentences = note.content
        .split(".")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const shortSummary =
        sentences.slice(0, 3).join(". ") + ".";

      const keyPoints = sentences
        .slice(0, 5)
        .map(s => `• ${s.substring(0, 60)}...`);

      const generatedSummary = `
🧠 Smart Summary

🔹 Short Overview:
${shortSummary}

🔹 Key Points:
${keyPoints.join("\n")}
      `;

      setSummary(generatedSummary);
      setSummarizing(false);
    }, 1000);
  };

  // =========================
  // STAMP UPLOAD
  // =========================

  const handleStampUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;

      await addDoc(collection(db, "notes", id, "stamps"), {
        imageUrl: base64String,
        createdAt: new Date()
      });

      fetchStamps();
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // PLACE STAMP
  // =========================

  const handlePlaceStamp = async (stamp) => {
    await addDoc(collection(db, "notes", id, "placedStamps"), {
      imageUrl: stamp.imageUrl,
      x: 100,
      y: 100,
      size: 60,
      createdAt: new Date()
    });

    fetchPlacedStamps();
  };

  // =========================
  // DRAG / RESIZE / DELETE
  // =========================

  const handleDragStop = async (stampId, data) => {
    const stampRef = doc(
      db,
      "notes",
      id,
      "placedStamps",
      stampId
    );

    await updateDoc(stampRef, {
      x: data.x,
      y: data.y
    });

    fetchPlacedStamps();
  };

  const handleResizeStamp = async (stampId, newSize) => {
    const stampRef = doc(
      db,
      "notes",
      id,
      "placedStamps",
      stampId
    );

    await updateDoc(stampRef, {
      size: Number(newSize)
    });

    fetchPlacedStamps();
  };

  const handleDeleteStamp = async (stampId) => {
    await deleteDoc(
      doc(db, "notes", id, "placedStamps", stampId)
    );
    fetchPlacedStamps();
  };

  // =========================
  // DELETE NOTE
  // =========================

  const handleDelete = async () => {
    await deleteDoc(doc(db, "notes", id));
    navigate("/dashboard");
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-4">
          {note.title}
        </h1>

        {/* NOTE BOARD */}
        <div className="relative bg-gray-50 p-6 rounded-xl min-h-[300px] mb-8 overflow-hidden">

          <p className="whitespace-pre-line">
            {note.content}
          </p>

          {placedStamps.map((stamp) => (
            <Draggable
              key={stamp.id}
              position={{ x: stamp.x, y: stamp.y }}
              onStop={(e, data) =>
                handleDragStop(stamp.id, data)
              }
              cancel="input"
            >
              <div className="absolute group">

                <img
                  src={stamp.imageUrl}
                  alt="stamp"
                  style={{ width: stamp.size }}
                  className="cursor-move select-none"
                />

                <button
                  onClick={() =>
                    handleDeleteStamp(stamp.id)
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>

                <input
                  type="range"
                  min="40"
                  max="150"
                  value={stamp.size}
                  onChange={(e) =>
                    handleResizeStamp(
                      stamp.id,
                      e.target.value
                    )
                  }
                  className="absolute -bottom-4 left-0 w-full opacity-0 group-hover:opacity-100 transition"
                />

              </div>
            </Draggable>
          ))}

        </div>

        {/* SUMMARY DISPLAY */}
        {summary && (
          <div className="mt-6 p-6 bg-indigo-100 border-l-4 border-indigo-600 rounded-xl whitespace-pre-line shadow-sm">
            {summary}
          </div>
        )}

        {/* STAMP UPLOAD */}
        <h2 className="text-xl font-semibold mt-8 mb-4">
          Add Diagram
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleStampUpload}
          className="mb-6"
        />

        <div className="flex gap-4 flex-wrap">
          {stamps.map(stamp => (
            <img
              key={stamp.id}
              src={stamp.imageUrl}
              alt="stamp"
              className="w-16 h-16 object-contain cursor-pointer hover:scale-110 transition"
              onClick={() => handlePlaceStamp(stamp)}
            />
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-6 flex-wrap">

          <button
            onClick={() =>
              navigate(`/note/${id}/flashcards`)
            }
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            📇 Flashcards
          </button>

          <button
            onClick={() =>
              navigate(`/edit/${id}`)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            ✏ Edit
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            🗑 Delete
          </button>

          <button
            onClick={handleSmartSummarize}
            disabled={summarizing}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {summarizing
              ? "Summarizing..."
              : "🧠 Summarize"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default NotePage;
