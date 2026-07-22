"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  CheckCircle2,
  Trash2,
  FileText,
  FileArchive,
  FileImage,
  FileCode2,
  Loader2,
} from "lucide-react";

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number;
  uploadedSize: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  maxSizeMB?: number;
  acceptedTypes?: string;
  onUploadComplete?: (files: UploadedFileItem[]) => void;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  title = "Upload files",
  subtitle = "Select and upload the files of your choice",
  maxSizeMB = 1024,
  acceptedTypes = ".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg",
  onUploadComplete,
}: DocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileList, setFileList] = useState<UploadedFileItem[]>([
    {
      id: "1",
      name: "resume.pdf",
      size: 867 * 1024,
      uploadedSize: 867 * 1024,
      type: "pdf",
      status: "completed",
      progress: 100,
    },
    {
      id: "2",
      name: "figma-files.zip",
      size: 23 * 1024 * 1024,
      uploadedSize: 23 * 1024 * 1024,
      type: "zip",
      status: "completed",
      progress: 100,
    },
    {
      id: "3",
      name: "my-certificate.pdf",
      size: 2.1 * 1024 * 1024,
      uploadedSize: 600 * 1024,
      type: "pdf",
      status: "uploading",
      progress: 28,
    },
  ]);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExt = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return ext;
  };

  const renderFileIcon = (filename: string) => {
    const ext = getFileExt(filename);
    if (ext === "pdf") {
      return (
        <div className="w-10 h-10 rounded-xl bg-zinc-100/90 border border-zinc-200/60 flex flex-col items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-zinc-500" />
          <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
            pdf
          </span>
        </div>
      );
    }
    if (ext === "zip" || ext === "rar" || ext === "7z") {
      return (
        <div className="w-10 h-10 rounded-xl bg-zinc-100/90 border border-zinc-200/60 flex flex-col items-center justify-center shrink-0">
          <FileArchive className="w-4 h-4 text-zinc-500" />
          <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
            zip
          </span>
        </div>
      );
    }
    if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) {
      return (
        <div className="w-10 h-10 rounded-xl bg-zinc-100/90 border border-zinc-200/60 flex flex-col items-center justify-center shrink-0">
          <FileImage className="w-4 h-4 text-zinc-500" />
          <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
            {ext}
          </span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-zinc-100/90 border border-zinc-200/60 flex flex-col items-center justify-center shrink-0">
        <FileCode2 className="w-4 h-4 text-zinc-500" />
        <span className="text-[8px] font-bold text-zinc-400 uppercase mt-0.5">
          {ext || "file"}
        </span>
      </div>
    );
  };

  const simulateUpload = (newFileItem: UploadedFileItem) => {
    let currentUploaded = 0;
    const totalSize = newFileItem.size;
    const interval = setInterval(() => {
      currentUploaded += totalSize / 15;
      if (currentUploaded >= totalSize) {
        currentUploaded = totalSize;
        clearInterval(interval);
        setFileList((prev) =>
          prev.map((item) =>
            item.id === newFileItem.id
              ? {
                  ...item,
                  uploadedSize: totalSize,
                  progress: 100,
                  status: "completed",
                }
              : item,
          ),
        );
      } else {
        const currentProgress = Math.round((currentUploaded / totalSize) * 100);
        setFileList((prev) =>
          prev.map((item) =>
            item.id === newFileItem.id
              ? {
                  ...item,
                  uploadedSize: currentUploaded,
                  progress: currentProgress,
                }
              : item,
          ),
        );
      }
    }, 150);
  };

  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const newItem: UploadedFileItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        uploadedSize: 0,
        type: getFileExt(file.name),
        status: "uploading",
        progress: 0,
      };
      setFileList((prev) => [...prev, newItem]);
      simulateUpload(newItem);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFileList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-in fade-in">
      <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200/80 space-y-6 text-left relative overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight leading-none">
                {title}
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-[#f8f9fa] border-2 border-dashed rounded-2xl sm:rounded-[24px] p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-zinc-800 bg-zinc-100/80 scale-[0.99]"
              : "border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-100/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFilesAdded(e.target.files);
            }}
          />

          <div className="px-4 py-2 bg-white border border-zinc-200/90 rounded-xl text-xs font-bold text-zinc-800 flex items-center gap-2 shadow-xs hover:shadow-sm transition-all">
            <Upload className="w-3.5 h-3.5 text-zinc-600" />
            <span>Upload</span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-zinc-900 mt-3.5">
            Upload a file or drag it here
          </p>
          <p className="text-[11px] text-zinc-400 font-medium mt-1">
            Max file size up to{" "}
            {maxSizeMB >= 1024
              ? `${(maxSizeMB / 1024).toFixed(0)} GB`
              : `${maxSizeMB} MB`}
          </p>
        </div>

        {fileList.length > 0 && (
          <div className="space-y-2.5 max-h-65 overflow-y-auto pr-1">
            {fileList.map((file) => {
              const isCompleted = file.status === "completed";
              return (
                <div
                  key={file.id}
                  className="bg-white border border-zinc-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs relative overflow-hidden group hover:border-zinc-300 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    {renderFileIcon(file.name)}
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-zinc-900 truncate max-w-50 sm:max-w-60">
                        {file.name}
                      </p>
                      <div className="text-[11px] text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
                        {isCompleted ? (
                          <>
                            <span>
                              {formatFileSize(file.size)} of{" "}
                              {formatFileSize(file.size)}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                            </span>
                          </>
                        ) : (
                          <>
                            <span>
                              {formatFileSize(file.uploadedSize)} of{" "}
                              {formatFileSize(file.size)}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1 text-zinc-600 font-medium">
                              <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />{" "}
                              Uploading...
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
                  >
                    {isCompleted ? (
                      <Trash2 className="w-4 h-4 hover:text-red-600 transition-colors" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>

                  {!isCompleted && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
