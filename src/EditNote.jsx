import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
      }

      setLoading(false);
    };

    fetchNote();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !content) {
      alert("Fill all fields");
      return;
    }

    try {
      await updateDoc(doc(db, "notes", id), {
        title,
        content,
        updatedAt: new Date()
      });

      navigate(`/note/${id}`);
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold mb-6">
          ✏ Edit Note
        </h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}

export default EditNote;
