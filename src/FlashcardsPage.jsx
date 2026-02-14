import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

function FlashcardsPage() {
  const { id } = useParams();

  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    fetchFlashcards();
  }, [id]);

  const fetchFlashcards = async () => {
    const snapshot = await getDocs(
      collection(db, "notes", id, "flashcards")
    );

    const cards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setFlashcards(cards);

    // 🔥 CALCULATE PROGRESS
    const reviewedCount = cards.filter(c => c.reviewed).length;
    const totalCount = cards.length;

    const progress =
      totalCount === 0
        ? 0
        : Math.round((reviewedCount / totalCount) * 100);

    await updateDoc(doc(db, "notes", id), {
      progress
    });
  };

  const handleAddFlashcard = async () => {
    if (!question || !answer) {
      alert("Fill both fields");
      return;
    }

    await addDoc(collection(db, "notes", id, "flashcards"), {
      question,
      answer,
      reviewed: false // ✅ IMPORTANT
    });

    setQuestion("");
    setAnswer("");
    fetchFlashcards();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          Flashcards 📇
        </h1>

        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        />

        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        />

        <button
          onClick={handleAddFlashcard}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-8"
        >
          Add Flashcard
        </button>

        <div className="grid gap-4">
          {flashcards.map(card => (
            <Flashcard
              key={card.id}
              card={card}
              noteId={id}
              refresh={fetchFlashcards}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

function Flashcard({ card, noteId, refresh }) {
  const [flipped, setFlipped] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
      await deleteDoc(doc(db, "notes", noteId, "flashcards", card.id));
      refresh();
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleFlip = async () => {
    setFlipped(!flipped);

    // ✅ Mark as reviewed only first time
    if (!flipped && !card.reviewed) {
      await updateDoc(
        doc(db, "notes", noteId, "flashcards", card.id),
        { reviewed: true }
      );

      refresh();
    }
  };

  return (
    <div
      className="w-full h-48 perspective cursor-pointer relative"
      onClick={handleFlip}
    >
      {/* DELETE BUTTON */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs z-10"
      >
        Delete
      </button>

      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg flex items-center justify-center p-6 text-center">
          <p className="font-semibold text-lg">
            {card.question}
          </p>
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-purple-600 text-white rounded-xl shadow-lg flex items-center justify-center p-6 text-center">
          <p className="text-lg">
            {card.answer}
          </p>
        </div>
      </div>

      {/* Reviewed Indicator */}
      {card.reviewed && (
        <p className="absolute bottom-2 left-2 text-green-600 text-xs font-semibold">
          ✔ Reviewed
        </p>
      )}
    </div>
  );
}

export default FlashcardsPage;
