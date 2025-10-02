// src/routes/uploads.ts
import { Router } from "express";
import multer from "multer"; // middleware for handling file uploads
import path from "path";
import fs from "fs";

export const router = Router();

const UPLOAD_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // ensure upload dir

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR), // upload directory
  filename: (_req, file, cb) => { // file name
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`; // random unique name
    cb(null, name);
  },
});

const upload = multer({ storage });

// Upload single file: form field name "file"
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  // public url (served statically below)
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});