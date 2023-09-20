import express from "express";
const Router = express.Router();
import { validationResult } from "express-validator";
import { notesValidate } from "../validation/notesValidation";

import Notes from "../database/models/Notes";
import { fetchuser } from "../../middlewares/fetchUser";

Router.get("/fetchAllNotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
});

Router.post("/addnote", notesValidate(), fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Notes({ title, description, tag, user: req.user.id });
    const save = await note.save();
    res.send(note);
  } catch (error) {
    res.status(500).send({ error: "internal server error" + error.stack });
  }
});

Router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("unauthorized");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    res.status(500).send({ error: "internal server error" + error.stack });
  }
});

Router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("unauthorized");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "deleted note", note });
  } catch (error) {
    res.status(500).send({ error: "internal server error" + error.stack });
  }
});

export default Router;
