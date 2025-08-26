import { type FileMetadata } from "@shared/schema";

// Simple interface for any future storage needs
export interface IStorage {
  // Currently no persistent storage needed for file metadata service
  // Files are processed and metadata returned without storage
}

export class MemStorage implements IStorage {
  constructor() {
    // No persistent storage needed for this microservice
  }
}

export const storage = new MemStorage();
