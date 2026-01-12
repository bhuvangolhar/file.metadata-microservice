import express, { Request, Response } from "express";
import co rs from "cors";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());

# Configure multer (memory storage, no files saved on disk)
const upload = mult er({ storage: multer.memoryStorage() });

// Serve a simple HTML form at "/"
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h2>File Metadata Microservice</h2>
    <form method="POST" action="/api/fileanalyse" enctype="multipart/form-data">
      <input type="file" name="upfile" />
      <button type="submit">Uplo4444444444444444444444444444ad</button>
    </form>
  `);
});

// Handle file upload
app.post(
  "/api/fileanalyse",
  upload.single("upfile"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`File Metadata Microservice running on port ${PORT} 🚀`);
});
