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

app.post("/api/gen-img", async (req, res) => {
  const { avatar } = req.body;

  const context = `You are expert grafic designer.
  Your final objetive is create a avatar for a ${avatar}.
  Avatar specs: 
  - Style: Cartoon (type animated drawings)
  - Dimensions: 256x256 pixels
  - Image background: Solid color
  - Avatar protagonist: ${avatar}

  For to do good the job, you should achieve whit all specs.
  If you do it right, you will receive $700.
  `;

  try {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: context,
      n: 1,
      size: "256x256",
    });

    const imageUrl = response.data[0].url;

    res.status(200).json({
      imageUrl,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      error: "Error when generate avatar",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
