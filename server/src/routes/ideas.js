import express from "express";
import Idea from "../models/Idea.js";
import { analyzeIdea } from "../services/ai.js";

const router = express.Router();

// POST /ideas — create + analyze
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const idea = await Idea.create({ title, description, status: "analyzing" });

    // Run AI analysis async, don't block the response
    analyzeIdea(title, description)
      .then(async (report) => {
        idea.status = "done";
        idea.report = report;
        await idea.save();
      })
      .catch(async (err) => {
        console.error("AI analysis failed:", err.message);
        idea.status = "error";
        await idea.save();
      });

    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ideas — list all
router.get("/", async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 }).select("-report.fullAnalysis");
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ideas/:id — full detail
router.get("/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /ideas/:id
router.delete("/:id", async (req, res) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);
    if (!idea) return res.status(404).json({ error: "Idea not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
