import { z } from "zod";

// File metadata response schema
export const fileMetadataSchema = z.object({
  name: z.string(),
  type: z.string(),
  size: z.number(),
  lastModified: z.string().optional(),
  extension: z.string().optional(),
});

export const fileMetadataResponseSchema = z.object({
  success: z.boolean(),
  data: fileMetadataSchema.optional(),
  message: z.string().optional(),
  timestamp: z.string(),
});

export type FileMetadata = z.infer<typeof fileMetadataSchema>;
export type FileMetadataResponse = z.infer<typeof fileMetadataResponseSchema>;
