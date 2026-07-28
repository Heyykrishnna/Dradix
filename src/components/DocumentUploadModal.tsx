"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  FileArchive,
  FileImage,
  FileCode2,
  Link2,
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
  confirmText?: string;
  onUploadComplete?: (files: UploadedFileItem[]) => void;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  title = "Upload Resume & Portfolio",
  subtitle = "Apply this job in a few clicks, recruiter needs your updated resume and your proof of work.",
  maxSizeMB = 3,
  acceptedTypes = ".pdf,.doc,.docx,.zip",
  confirmText = "Upload",
  onUploadComplete,
}: DocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileList, setFileList] = useState<UploadedFileItem[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const onUploadCompleteRef = useRef(onUploadComplete);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }

  React.useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete;
  }, [onUploadComplete]);

  React.useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!shouldRender) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileExt = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const renderFileIcon = (filename: string) => {
    const ext = getFileExt(filename);
    if (ext === "pdf") {
      return <FileText className="w-4 h-4 text-zinc-700" />;
    }
    if (ext === "zip" || ext === "rar" || ext === "7z") {
      return <FileArchive className="w-4 h-4 text-zinc-700" />;
    }
    if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) {
      return <FileImage className="w-4 h-4 text-zinc-700" />;
    }
    return <FileCode2 className="w-4 h-4 text-zinc-700" />;
  };

  const simulateUpload = (newFileItem: UploadedFileItem) => {
    let currentUploaded = 0;
    const totalSize = newFileItem.size;
    const interval = setInterval(() => {
      currentUploaded += totalSize / 10;
      if (currentUploaded >= totalSize) {
        currentUploaded = totalSize;
        clearInterval(interval);
        setFileList((prev) => {
          const updated = prev.map((item) =>
            item.id === newFileItem.id
              ? {
                  ...item,
                  uploadedSize: totalSize,
                  progress: 100,
                  status: "completed" as const,
                }
              : item,
          );
          onUploadCompleteRef.current?.(
            updated.filter((item) => item.status === "completed"),
          );
          return updated;
        });
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
    }, 120);
  };

  const handleFilesAdded = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      const newItem: UploadedFileItem = {
        id: crypto.randomUUID(),
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

  const handleImportUrl = () => {
    if (!urlInput.trim()) return;
    const fileNameFromUrl =
      urlInput.split("/").pop()?.split("?")[0] || "document.pdf";
    const newItem: UploadedFileItem = {
      id: crypto.randomUUID(),
      name: fileNameFromUrl.endsWith(".pdf")
        ? fileNameFromUrl
        : `${fileNameFromUrl}.pdf`,
      size: 2.4 * 1024 * 1024,
      uploadedSize: 2.4 * 1024 * 1024,
      type: "pdf",
      status: "completed",
      progress: 100,
    };
    setFileList((prev) => {
      const updated = [...prev, newItem];
      onUploadCompleteRef.current?.(updated);
      return updated;
    });
    setUrlInput("");
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
    setFileList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      onUploadCompleteRef.current?.(
        updated.filter((item) => item.status === "completed"),
      );
      return updated;
    });
  };

  const handleConfirm = () => {
    const completedFiles = fileList.filter(
      (item) => item.status === "completed",
    );
    onUploadCompleteRef.current?.(completedFiles);
    handleClose();
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-200 ease-out ${
        isClosing
          ? "animate-out fade-out duration-200"
          : "animate-in fade-in duration-200"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zinc-200/90 space-y-5 text-left relative overflow-hidden transition-all duration-200 ease-out ${
          isClosing
            ? "animate-out zoom-out-95 fade-out duration-200"
            : "animate-in zoom-in-95 fade-in duration-200"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="pr-2">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight leading-tight">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full border border-zinc-200/80 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-zinc-50/80 border-2 border-dashed rounded-2xl sm:rounded-[22px] p-7 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-zinc-800 bg-zinc-100/90 scale-[0.99]"
              : "border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-100/60"
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

          <div className="w-11 h-11 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-zinc-700" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-zinc-700">
            Drag & Drop or{" "}
            <span className="font-bold text-zinc-950 underline underline-offset-2">
              Choose file
            </span>{" "}
            to upload
          </p>
          <p className="text-[11px] text-zinc-400 font-medium mt-1">
            PDF Max{" "}
            {maxSizeMB >= 1024
              ? `${(maxSizeMB / 1024).toFixed(1)}GB`
              : `${maxSizeMB}Mb`}
          </p>
        </div>

        {fileList.length > 0 && (
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {fileList.map((file) => {
              return (
                <div
                  key={file.id}
                  className="bg-zinc-50 border border-zinc-200/90 rounded-xl p-3 sm:p-3.5 flex flex-col gap-2 relative overflow-hidden group transition-all text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                        {renderFileIcon(file.name)}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-bold text-zinc-900 truncate max-w-40 sm:max-w-56">
                          {file.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-medium text-zinc-400">
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(file.id);
                        }}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-1 bg-zinc-200/90 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-zinc-800 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="relative flex items-center justify-center my-1">
          <div className="w-full border-t border-zinc-200/80" />
          <span className="absolute bg-white px-3 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            or
          </span>
        </div>

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-bold text-zinc-800">
            Import file from URL
          </label>
          <div className="relative flex items-center">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleImportUrl();
                }
              }}
              placeholder="Add file URL here"
              className="w-full bg-zinc-50 border border-zinc-200/90 rounded-xl px-3.5 py-2.5 pr-10 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 focus:border-zinc-400 transition-all"
            />
            <button
              type="button"
              onClick={handleImportUrl}
              title="Import URL"
              className="absolute right-2.5 p-1 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn-candy flex-1 px-5 py-2.5 bg-linear-to-b from-zinc-100 to-zinc-200 border border-zinc-300 text-zinc-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn-candy flex-1 px-6 py-2.5 bg-linear-to-b from-zinc-900 via-zinc-950 to-black text-white border border-zinc-800 rounded-xl text-xs font-bold shadow-md cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
