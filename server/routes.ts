import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { fileMetadataResponseSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  storage: multer.memoryStorage(), // Store in memory, don't persist
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File metadata analysis endpoint
  app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded. Please provide a file with the field name 'upfile'.",
          timestamp: new Date().toISOString(),
        });
      }

      const file = req.file;
      
      // Extract file extension
      const extension = path.extname(file.originalname);
      
      // Create file metadata
      const metadata = {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        extension: extension || undefined,
      };

      // Validate response data
      const response = fileMetadataResponseSchema.parse({
        success: true,
        data: metadata,
        timestamp: new Date().toISOString(),
      });

      res.json(response);
    } catch (error) {
      console.error("File analysis error:", error);
      
      // Handle multer errors
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "File size exceeds maximum limit of 50MB.",
            timestamp: new Date().toISOString(),
          });
        }
      }

      res.status(500).json({
        success: false,
        message: "Internal server error during file analysis.",
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle multer errors globally
  app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "File size exceeds maximum limit of 50MB.",
          timestamp: new Date().toISOString(),
        });
      }
    }
    next(error);
  });

  const httpServer = createServer(app);
  return httpServer;
}
