import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileMetadataResponse } from "@shared/schema";
import {
  Upload,
  FileText,
  CloudUpload,
  FolderOpen,
  BarChart3,
  Copy,
  Info,
  Tag,
  FileCode,
  Weight,
  Puzzle,
  Clock,
  Calendar,
  Book,
  AlertCircle,
  Loader2,
  X,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [response, setResponse] = useState<FileMetadataResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("upfile", file);
      
      const res = await apiRequest("POST", "/api/fileanalyse", formData);
      return res.json() as Promise<FileMetadataResponse>;
    },
    onSuccess: (data) => {
      setResponse(data);
      if (data.success) {
        toast({
          title: "Success",
          description: "File metadata extracted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to extract metadata",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
      setResponse({
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setResponse(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      toast({
        title: "Copied",
        description: "Response copied to clipboard",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">File Metadata Service</h1>
                <p className="text-sm text-gray-500">Extract file information via HTTP upload</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                Online
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Upload Form Card */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="text-primary mr-2" />
                  Upload File
                </h2>
                <p className="text-sm text-gray-600 mt-1">Select a file to extract metadata</p>
              </div>
              
              <CardContent className="p-6">
                <form onSubmit={handleUpload} data-testid="upload-form">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                      dragActive ? "border-primary bg-blue-50" : "border-gray-300 hover:border-primary"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="upload-area"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <CloudUpload className="text-gray-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">Drop your file here</p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        data-testid="input-file"
                      />
                      <Button type="button" variant="default" data-testid="button-browse">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  {/* Selected File Display */}
                  {selectedFile && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg" data-testid="selected-file">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900" data-testid="text-filename">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500" data-testid="text-filesize">{formatFileSize(selectedFile.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearFile}
                          data-testid="button-clear-file"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="mt-6 flex space-x-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!selectedFile || uploadMutation.isPending}
                      data-testid="button-extract-metadata"
                    >
                      {uploadMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <BarChart3 className="mr-2 h-4 w-4" />
                      )}
                      Extract Metadata
                    </Button>
                    <Button type="button" variant="outline" onClick={clearFile} data-testid="button-clear">
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* File Size Limits Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="text-amber-600 mt-0.5 h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Upload Limits</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Maximum file size: 50 MB</li>
                      <li>All file types supported</li>
                      <li>Files are not stored permanently</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Response Section */}
          <div className="space-y-6">
            {/* Response Display */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileCode className="text-primary mr-2" />
                    Response
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      uploadMutation.isPending
                        ? "bg-blue-100 text-blue-800"
                        : response?.success
                        ? "bg-green-100 text-green-800"
                        : response && !response.success
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`} data-testid="status-badge">
                      {uploadMutation.isPending
                        ? "Processing..."
                        : response?.success
                        ? "Success"
                        : response && !response.success
                        ? "Error"
                        : "Ready"}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Loading State */}
                {uploadMutation.isPending && (
                  <div className="text-center py-12" data-testid="loading-state">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                      <Loader2 className="text-blue-600 animate-spin" />
                    </div>
                    <p className="text-gray-600">Processing file metadata...</p>
                  </div>
                )}
                
                {/* Success Response */}
                {response?.success && !uploadMutation.isPending && (
                  <div data-testid="success-response">
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-gray-100">
                        <code data-testid="json-response">{JSON.stringify(response, null, 2)}</code>
                      </pre>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" onClick={copyResponse} data-testid="button-copy-json">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy JSON
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Error Response */}
                {response && !response.success && !uploadMutation.isPending && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="error-response">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertCircle className="text-red-600 mt-0.5 h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
                        <p className="mt-1 text-sm text-red-700" data-testid="text-error-message">
                          {response.message || "An error occurred during file processing"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Default State */}
                {!response && !uploadMutation.isPending && (
                  <div className="text-center py-12" data-testid="default-state">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500">Upload a file to see metadata response</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Metadata Info */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info className="text-primary mr-2" />
                  Extracted Metadata
                </h3>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Tag className="text-gray-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">File Name</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileCode className="text-gray-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">MIME Type</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Weight className="text-gray-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">File Size</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Puzzle className="text-gray-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">Extension</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="text-gray-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">Last Modified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-gray-400 text-sm" />
                        <span className="text-sm font-medium text-gray-700">Timestamp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* API Documentation */}
        <div className="mt-12">
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Book className="text-primary mr-2" />
                API Documentation
              </h2>
              <p className="text-sm text-gray-600 mt-1">RESTful endpoint for programmatic access</p>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Endpoint Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Endpoint</h3>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-sm text-green-400">POST /api/fileanalyse</code>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Request Format</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Content-Type: multipart/form-data</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <code className="text-sm text-gray-800">upfile: [File Object]</code>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Response Codes</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">200 OK</span>
                        <span className="text-sm text-green-600">Success</span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-red-800">400 Bad Request</span>
                        <span className="text-sm text-red-600">Invalid file</span>
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-red-800">413 Payload Too Large</span>
                        <span className="text-sm text-red-600">File too large</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Example Response */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Example Response</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100"><code>{`{
  "success": true,
  "data": {
    "name": "document.pdf",
    "type": "application/pdf", 
    "size": 1048576,
    "extension": ".pdf"
  },
  "timestamp": "2024-01-15T10:35:22.156Z"
}`}</code></pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              File Metadata Microservice v1.0.0
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Documentation</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">API Reference</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
