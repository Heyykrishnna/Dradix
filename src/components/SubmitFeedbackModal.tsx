"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import {
  Cross2Icon,
  StarFilledIcon,
  StarIcon,
  CheckCircledIcon,
  PaperPlaneIcon,
  ChatBubbleIcon,
  FileTextIcon,
  ExclamationTriangleIcon,
  RocketIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

interface SubmitFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultSubject?: string;
}

const CATEGORIES = [
  { id: "Documentation", label: "Documentation", icon: FileTextIcon },
  { id: "Bug Report", label: "Bug Report", icon: ExclamationTriangleIcon },
  { id: "Feature Request", label: "Feature Request", icon: RocketIcon },
  { id: "UI/UX", label: "UI / UX Design", icon: Pencil1Icon },
  { id: "General", label: "General Feedback", icon: ChatBubbleIcon },
];

export default function SubmitFeedbackModal({
  isOpen,
  onClose,
  defaultCategory = "Documentation",
  defaultSubject = "",
}: SubmitFeedbackModalProps) {
  const { user } = useAuth();

  const [category, setCategory] = useState(defaultCategory);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      const fullName = user.first_name
        ? `${user.first_name} ${user.last_name || ""}`.trim()
        : user.username || "";
      setName(fullName);
      setEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
    if (defaultSubject) setSubject(defaultSubject);
  }, [defaultCategory, defaultSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setErrorMsg("Please enter a subject or title.");
      return;
    }
    if (!message.trim()) {
      setErrorMsg("Please enter your feedback message.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";
      const deviceInfo = typeof navigator !== "undefined" ? navigator.userAgent : "";

      await apiFetch("/feedback", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim() || (user ? user.username : "Guest User"),
          email: email.trim() || (user ? user.email : "guest@dradix.com"),
          category,
          rating,
          subject: subject.trim(),
          message: message.trim(),
          page_url: pageUrl,
          device_info: deviceInfo,
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSubject("");
        setMessage("");
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xl transition-all duration-300"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-lg bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl border border-white/40 dark:border-zinc-800/80 rounded-3xl shadow-[0_16px_48px_0_rgba(0,0,0,0.2)] overflow-hidden z-10 text-zinc-900 dark:text-zinc-100"
          >
            <div className="px-6 py-5 border-b border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-100/40 dark:bg-zinc-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#015451] text-white flex items-center justify-center shadow-lg shrink-0">
                  <ChatBubbleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                    Submit Feedback
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Direct telemetry sync to platform admin core
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <Cross2Icon className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-inner">
                    <CheckCircledIcon className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Feedback Synchronized
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                    Your feedback has been registered and synced directly to the admin dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Feedback Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id;
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs transition-all duration-200 text-left cursor-pointer border ${
                              isSelected
                                ? "bg-[#015451]/15 border-[#015451] text-[#015451] dark:text-[#38bdf8] font-bold shadow-xs backdrop-blur-md"
                                : "bg-zinc-100/60 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#015451] dark:text-[#38bdf8]" : "text-zinc-400"}`} />
                            <span className="truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Rating Score
                    </label>
                    <div className="flex items-center justify-between bg-zinc-100/60 dark:bg-zinc-800/40 px-3.5 py-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-md">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              onClick={() => setRating(star)}
                              className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                            >
                              {isFilled ? (
                                <StarFilledIcon className="w-5 h-5 text-amber-400" />
                              ) : (
                                <StarIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
                        {rating} / 5
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2 text-xs rounded-2xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2 text-xs rounded-2xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter a descriptive topic header"
                      required
                      className="w-full px-3.5 py-2 text-xs rounded-2xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Detailed Feedback Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Write your suggestions, documentation observations, or feedback details..."
                      required
                      className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-2xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-semibold bg-[#015451] hover:bg-[#01403e] text-white shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <PaperPlaneIcon className="w-3.5 h-3.5" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
