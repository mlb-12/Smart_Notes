import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import axios from "axios";

function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [showAI, setShowAI] = useState(false);

  const navigate = useNavigate();

  // ================= SAVE =================
  const handleSave = async () => {
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    if (!auth.currentUser) {
      alert("User not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "notes"), {
        title,
        content,
        userId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        isPublic,
        progress: 0,
        createdAt: new Date()
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Save failed");
    }
  };

  // ================= SMART ASSIST =================
  const handleSmartAssist = () => {
    if (!title) return alert("Enter a topic first");

    const generated = `
📘 ${title}

Definition:
${title} is an important concept.

Key Points:
- Main idea
- Key terminology
- Applications

`;

    setContent(prev => prev + generated);
  };

  // ================= AI RESEARCH =================
  const handleAIResearch = async () => {
    if (!title) return alert("Enter a topic first");

    try {
      setLoadingAI(true);

      const response = await axios.post(
        "http://localhost:5000/api/research",
        { topic: title }
      );

      setAiResult(response.data.content);
      setShowAI(true);

    } catch (error) {
      console.log(error);
      alert("AI research failed");
    } finally {
      setLoadingAI(false);
    }
  };

  // ================= INSERT IMAGE (TEXTAREA SAFE) =================
  const handleInsertImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageText = `\n\n[Diagram Inserted Below]\n${reader.result}\n\n`;
      setContent(prev => prev + imageText);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          Create New Note ✍️
        </h1>

        {/* TITLE */}
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        {/* BUTTONS */}
        <div className="flex gap-3 flex-wrap mb-4">
          <button
            onClick={handleSmartAssist}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            🧠 Smart Assist
          </button>

          <button
            onClick={handleAIResearch}
            disabled={loadingAI}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loadingAI ? "Generating..." : "🤖 AI Research"}
          </button>

          <label className="bg-gray-800 text-white px-4 py-2 rounded-lg cursor-pointer">
            📷 Insert Diagram
            <input
              type="file"
              accept="image/*"
              onChange={handleInsertImage}
              hidden
            />
          </label>
        </div>

        {/* TEXT AREA BACK */}
        <textarea
          placeholder="Write your notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="w-full border p-4 rounded-xl bg-gray-50 mb-6 resize-none"
        />

        {/* AI PANEL */}
        {showAI && (
          <div className="bg-gray-100 border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              🔎 AI Research Result
            </h2>

            <div className="text-sm mb-4 max-h-64 overflow-y-auto whitespace-pre-line">
              {aiResult}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setContent(prev => prev + "\n\n" + aiResult);
                  setShowAI(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Insert Into Notes
              </button>

              <button
                onClick={() => setShowAI(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* PUBLIC TOGGLE */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
          <label>Make this note public 🌍</label>
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Save Note
        </button>

      </div>
    </div>
  );
}

export default CreateNote;
