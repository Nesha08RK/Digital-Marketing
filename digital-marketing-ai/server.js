// Digital Marketing AI Chatbot Server with NVIDIA NIM API
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve the main chatbot page
app.get("/", (req, res) => {
  res.sendFile("gemini-chatbot.html", { root: "." });
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

    // Build the prompt for digital marketing
    const prompt = `You are a Digital Marketing AI Assistant specializing in SEO and Social Media Marketing (SMM). You provide comprehensive, actionable advice for businesses looking to improve their online presence.

When responding to business promotion requests, always provide:

**SEO Strategy:**
- Relevant keywords and phrases for their industry/business
- Website optimization suggestions
- Local SEO recommendations (if applicable)
- Content strategy for better search rankings
- Technical SEO improvements

**Social Media Marketing (SMM):**
- Platform-specific strategies (Instagram, Facebook, TikTok, etc.)
- Content ideas and posting schedules
- Hashtag strategies
- Engagement tactics
- Influencer collaboration suggestions

**Brand & Content:**
- Business name suggestions (if requested)
- Brand voice and messaging recommendations
- Content themes and topics
- Visual content ideas

**Practical Implementation:**
- Step-by-step action plans
- Tools and resources needed
- Timeline for implementation
- Success metrics to track

**For each recommendation, explain:**
- Why it works
- How to implement it
- Expected results
- Common mistakes to avoid

User Question: ${message}

Provide your response in a clear, structured format with specific, actionable advice that a business owner can implement immediately. Use bullet points, numbered lists, and clear headings for easy reading.`;

    const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
    
    const payload = {
      "model": "meta/llama-4-maverick-17b-128e-instruct",
      "messages": [{"role": "user", "content": prompt}],
      "max_tokens": 1024,
      "temperature": 0.7,
      "top_p": 0.95,
      "frequency_penalty": 0.0,
      "presence_penalty": 0.0,
      "stream": false
    };

    const apiResponse = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NIM_API_KEY}`,
        "Accept": "application/json",
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
    const assistantReply = data?.choices?.[0]?.message?.content || "No reply received";

    return res.json({ reply: assistantReply });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    next(err);
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error logging middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Digital Marketing AI Chatbot server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
  console.log(`🔑 Using NVIDIA NIM API with Llama 4 Maverick model`);
});
