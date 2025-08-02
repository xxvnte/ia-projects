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

app.post("/api/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  const promptSystem1 = "You are a professional translater.";
  const promptSystem2 =
    "You can only reply with one direct traduction from text send from user." +
    "Any other response o conversation is prohibited";

  const promptUser = `Translate next text to ${targetLang} : ${text}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: promptSystem1 },
        { role: "system", content: promptSystem2 },
        { role: "user", content: promptUser },
      ],
      max_tokens: 500,
      response_format: { type: "text" },
    });

    const translatedText = completion.choices[0].message.content;

    return res.status(200).json({
      translatedText,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error when translating",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
