import express from "express";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import cors from "cors";
import validUrl from "valid-url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Atlas connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));


const Url = mongoose.model(
  "Url",
  new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
  })
);

// POST /api/shorten - create short URL
app.post("/api/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate URL
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // Generate short code
    const shortCode = nanoid(6);

    // Save to database
    const url = new Url({ originalUrl, shortCode });
    await url.save();

    res.json({ shortUrl: `${BASE_URL}/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:shortCode - redirect to original URL
app.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).send("URL not found");
    }

    // Increment click count
    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET /api/urls - fetch all URLs 
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ _id: -1 }); // latest first
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on ${BASE_URL}`);
});

