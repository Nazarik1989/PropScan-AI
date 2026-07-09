import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, File, AlertCircle, X, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useUploadDocument, getListDocumentsQueryKey, getGetDocumentStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function UploadArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const uploadMutation = useUploadDocument();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF document.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    uploadMutation.mutate({ data: { file } }, {
      onSuccess: (uploaded) => {
        setFile(null);
        toast({
          title: "Upload successful",
          description: "Analyzing your document now…",
        });
        queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDocumentStatsQueryKey() });
        if (uploaded?.id != null) {
          setLocation(`/documents/${uploaded.id}`);
        }
      },
      onError: (error) => {
        toast({
          title: "Upload failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative rounded-xl border-2 border-dashed p-10 transition-colors duration-200 ease-in-out flex flex-col items-center justify-center text-center ${
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            data-testid="upload-area"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleFileSelect}
              data-testid="input-file"
            />
            <div className="rounded-full bg-primary/10 p-4 mb-4 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">Upload Property Document</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Drag and drop your PDF here, or click to browse. We support title deeds, lease agreements, survey reports, and contracts.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="rounded-md bg-primary/10 p-3 text-primary shrink-0">
                <File className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFile(null)}
                disabled={uploadMutation.isPending}
                data-testid="button-cancel-upload"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                data-testid="button-confirm-upload"
              >
                {uploadMutation.isPending ? "Uploading..." : "Analyze Document"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
