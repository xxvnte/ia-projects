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

let userThreads = {};

app.post("/api/chatbot", async (req, res) => {
  const { userId, message } = req.body;

  const promptUser = message;

  try {
    if (!userThreads[userId]) {
      const thread = await openai.beta.threads.create();
      userThreads[userId] = thread.id;
    }

    const threadId = userThreads[userId];

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: promptUser,
    });

    const myAssistant = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.ASSISTANT_ID,
    });

    let run = myAssistant;
    let attemps = 0;

    while (run.status !== "completed" && attemps < 30) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      run = await openai.beta.threads.runs.retrieve(threadId, myAssistant.id);

      attemps++;
    }

    if (run.status !== "completed") {
      throw new Error(
        `Execution from assistant incompleted, status: ${run.status}`
      );
    }

    const threadMessages = await openai.beta.threads.messages.list(threadId);

    const botResponses = threadMessages.data.filter(
      (msg) => msg.role === "assistant"
    );

    const botResponse = botResponses.sort(
      (a, b) => b.created_at - a.created_at
    )[0].content[0].text.value;

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
