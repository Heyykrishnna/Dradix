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
} from "@radix-ui/react-icons";

interface SubmitFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultSubject?: string;
}

const CATEGORIES = [
  { id: "Documentation", label: "Documentation", icon: "📚" },
  { id: "Bug Report", label: "Bug Report", icon: "🐛" },
  { id: "Feature Request", label: "Feature Request", icon: "💡" },
  { id: "UI/UX", label: "UI / UX Design", icon: "🎨" },
  { id: "General", label: "General Feedback", icon: "💬" },
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
      }, 2000);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-zinc-900 dark:text-zinc-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#015451] text-white flex items-center justify-center shadow-md shrink-0">
                  <ChatBubbleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                    Submit Feedback
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Help us improve Dradix with your thoughts & suggestions
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Cross2Icon className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 animate-bounce">
                    <CheckCircledIcon className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Feedback Received!
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                    Your feedback has been logged directly to our core dashboard. Thank you for making Dradix better!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 text-xs font-medium bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  {/* Category Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                              isSelected
                                ? "bg-[#015451]/10 border-[#015451] text-[#015451] dark:text-[#38bdf8] dark:bg-[#015451]/20 font-semibold shadow-xs"
                                : "bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <span className="text-sm">{cat.icon}</span>
                            <span className="truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Experience Rating
                    </label>
                    <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform hover:scale-110 focus:outline-none"
                          >
                            {isFilled ? (
                              <StarFilledIcon className="w-5 h-5 text-amber-400 drop-shadow-xs" />
                            ) : (
                              <StarIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                            )}
                          </button>
                        );
                      })}
                      <span className="ml-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {rating === 5 ? "Excellent (5/5)" : rating === 4 ? "Good (4/5)" : rating === 3 ? "Average (3/5)" : rating === 2 ? "Needs Work (2/5)" : "Poor (1/5)"}
                      </span>
                    </div>
                  </div>

                  {/* Name & Email (Pre-filled or Editable) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451]"
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
                        className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451]"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Subject / Topic <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Navigation issue on API documentation section"
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451]"
                    />
                  </div>

                  {/* Detailed Message */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Detailed Feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Describe your feedback, suggestion, or issue in detail..."
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] resize-none"
                    />
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-[#015451] hover:bg-[#01403e] text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <PaperPlaneIcon className="w-3.5 h-3.5" />
                          Submit Feedback
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
