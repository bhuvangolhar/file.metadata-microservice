# File Metadata Microservice

## Overview
A simple lightweight microservice built with **Node.js** and **Express.js**, developed for the **Back End Development and APIs** certification of **freeCodeCamp**. It exposes a REST API endpoint that parses uploaded files from multipart form submissions and returns file metadata including the original file name, MIME type, and size in bytes.

## Tech Stack
- **Language:** JavaScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Middleware:** CORS, Multer (Memory Storage)
- **Package Manager:** npm
- **Version Control:** Git
- **Editor:** VS Code

## System Architecture
- **API Design:** RESTful API returning JSON responses
- **Routing:** Endpoint routing (`/api/fileanalyse`) handled via Express
- **File Parsing:** Uses `multer` middleware configured with `memoryStorage()` to handle multipart form data efficiently in memory
- **Error Handling:** Returns structured JSON error responses when no file payload is detected in the request

## Folder Structure
```
file-metadata-microservice/
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
```

## API Endpoints

### 1. Upload and Analyze File
**Endpoint:** `POST /api/fileanalyse`

**Form Field Name:** `upfile` (multipart/form-data)

**Response:**
```json
{
  "name": "example.png",
  "type": "image/png",
  "size": 34567
}
```

## Error Handling
Submitting a request without attaching a file returns a clean validation response.

**Response:**
```json
{
  "error": "Please upload a file"
}
```

## How to Run Locally

1. **Clone the repository**
```bash
   git clone https://github.com/bhuvangolhar/file-metadata-microservice.git
   cd file-metadata-microservice
```

2. **Install dependencies**
```bash
   npm install
```

3. **Start the server**
```bash
   node index.js
```

4. **Access the service**
   Open your browser or an API testing tool (e.g., Postman) and send a multipart POST request to:
```
   http://localhost:3000/api/fileanalyse
```