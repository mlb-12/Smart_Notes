import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// AI Research
app.post("/api/research", async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: `Create structured study notes on: ${topic}`
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      content: data.choices[0].message.content
    });

  } catch (error) {
    console.error("GROQ ERROR:", error);
    res.status(500).json({ error: "AI failed" });
  }
});

// Summarize
app.post("/api/summarize", async (req, res) => {
  try {
    const { content } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "user",
            content: `Summarize clearly:\n\n${content}`
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      summary: data.choices[0].message.content
    });

  } catch (error) {
    console.error("SUMMARIZE ERROR:", error);
    res.status(500).json({ error: "Summarization failed" });
  }
});

app.listen(5000, () => {
  console.log("Groq server running on http://localhost:5000");
});
