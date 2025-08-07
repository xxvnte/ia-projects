import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use("/", express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let conversation = {};

app.post("/api/chatbot", async (req, res) => {
  const { userId, message } = req.body;

  const promptUser = message;
  const context = `You are support assistant for the supermarket "El Pepe".
  Core information:
  - Ubication: "Avenida pedro gato 0433".
  - Schedule: monday to friday at 8AM to 8PM.
  - Products: vegetables, fruits, cured meats, sweets.
  You only can reply question from the market "El Pepe", any other question is prohibited.
  `;
  const promptSystem = `You must answer as briefly and directly as possible, using as few tokens as possible.`;

  if (!conversation[userId]) {
    conversation[userId] = [];
  }

  conversation[userId].push({ role: "user", content: promptUser });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: context },
        { role: "system", content: promptSystem },
        ...conversation[userId],
      ],
      max_tokens: 200,
      response_format: { type: "text" },
    });

    const botResponse = response.choices[0].message.content;

    conversation[userId].push({ role: "assistant", content: botResponse });

    if (conversation[userId] > 12) {
      conversation[userId] = conversation[userId].slice(-10);
    }

    res.status(200).json({
      botResponse,
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
