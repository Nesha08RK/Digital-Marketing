// Digital Marketing AI Chatbot Server with NVIDIA NIM API
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (JS, CSS, images, etc.)
app.use(express.static(__dirname));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve the main chatbot page at root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "gemini-chatbot.html"));
});

// NVIDIA NIM API chat route
app.post("/api/chat", async (req, res, next) => {
  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Missing 'message' in request body" });
    }

    const NIM_API_KEY = process.env.NIM_API_KEY;
    if (!NIM_API_KEY) {
      return res.status(500).json({ error: "Server misconfiguration: missing NIM API key" });
    }

    const prompt = `You are a Digital Marketing AI Assistant specializing in SEO and Social Media Marketing (SMM)...\n\nUser Question: ${message}`;

    const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";

    const payload = {
      model: "meta/llama-4-maverick-17b-128e-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stream: false
    };

    const apiResponse = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NIM_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("NIM API error:", apiResponse.status, errorText);
      return res.status(502).json({
        error: "NIM API error",
        status: apiResponse.status,
        details: errorText
      });
    }

    const data = await apiResponse.json();
    const assistantReply =
      data?.choices?.[0]?.message?.content || "No reply received";

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    next(err);
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Digital Marketing AI Chatbot server running on port ${PORT}`);
  console.log(`Run Chatbot`);
  console.log(`🔑 Using NVIDIA NIM API with Llama 4 Maverick model`);
});
