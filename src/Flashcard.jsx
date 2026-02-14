import { useState } from "react";

function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer perspective"
    >
      <div
        className={`relative w-full h-40 transition-transform duration-500 transform ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full bg-white p-6 rounded-xl shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="font-semibold">Q:</h3>
          <p>{card.question}</p>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full bg-blue-600 text-white p-6 rounded-xl shadow-md transform rotate-y-180"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h3 className="font-semibold">A:</h3>
          <p>{card.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
