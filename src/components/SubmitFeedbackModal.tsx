"use client";

import React, { useState } from "react";
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
  const [prevDefaultCategory, setPrevDefaultCategory] =
    useState(defaultCategory);
  if (defaultCategory !== prevDefaultCategory) {
    setPrevDefaultCategory(defaultCategory);
    setCategory(defaultCategory);
  }

  const [subject, setSubject] = useState(defaultSubject);
  const [prevDefaultSubject, setPrevDefaultSubject] = useState(defaultSubject);
  if (defaultSubject !== prevDefaultSubject) {
    setPrevDefaultSubject(defaultSubject);
    setSubject(defaultSubject);
  }

  const userFullName = user
    ? user.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user.username || ""
    : "";
  const userEmail = user?.email || "";

  const [prevUser, setPrevUser] = useState(user);
  const [name, setName] = useState(userFullName);
  const [email, setEmail] = useState(userEmail);

  if (user !== prevUser) {
    setPrevUser(user);
    setName(userFullName);
    setEmail(userEmail);
  }

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
      const deviceInfo =
        typeof navigator !== "undefined" ? navigator.userAgent : "";

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
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(
        error.message || "Failed to submit feedback. Please try again.",
      );
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
            className="fixed inset-0 bg-black/70 backdrop-blur-2xl transition-all duration-300"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="relative w-full max-w-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-3xl border border-white/50 dark:border-zinc-800/80 rounded-3xl shadow-[0_20px_60px_0_rgba(0,0,0,0.3)] overflow-hidden z-10 text-zinc-900 dark:text-zinc-100"
          >
            <div className="px-6 py-5 border-b border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#015451] to-[#003c3a] text-white flex items-center justify-center shadow-[0_4px_14px_0_rgba(1,84,81,0.39),inset_0_1px_1px_rgba(255,255,255,0.4)] shrink-0">
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-all cursor-pointer shadow-xs border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <Cross2Icon className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-inner border border-emerald-500/20"
                  >
                    <CheckCircledIcon className="w-10 h-10" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Feedback Synchronized
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                    Your feedback has been registered and synced directly to the
                    admin dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl backdrop-blur-md"
                    >
                      {errorMsg}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                      Feedback Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id;
                        const Icon = cat.icon;
                        return (
                          <motion.button
                            key={cat.id}
                            type="button"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setCategory(cat.id)}
                            className={`relative overflow-hidden flex items-center gap-2 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 text-left cursor-pointer border select-none ${
                              isSelected
                                ? "bg-linear-to-br from-[#015451] via-[#016864] to-[#003937] text-white border-white/40 shadow-[0_8px_20px_-4px_rgba(1,84,81,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                                : "bg-white/50 dark:bg-zinc-800/40 hover:bg-white/80 dark:hover:bg-zinc-800/70 border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 shadow-[0_2px_10px_0_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]"
                            }`}
                          >
                            <div className="absolute inset-0 bg-linear-to-b from-white/25 via-white/5 to-transparent pointer-events-none rounded-2xl" />
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isSelected ? "text-emerald-200 scale-110" : "text-zinc-400"}`}
                            />
                            <span className="relative z-10 truncate tracking-tight">
                              {cat.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">
                      Rating Score
                    </label>
                    <div className="flex items-center justify-between bg-white/50 dark:bg-zinc-800/40 px-4 py-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled =
                            (hoverRating !== null ? hoverRating : rating) >=
                            star;
                          return (
                            <motion.button
                              key={star}
                              type="button"
                              whileHover={{ scale: 1.25 }}
                              whileTap={{ scale: 0.9 }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              onClick={() => setRating(star)}
                              className="p-1 focus:outline-none cursor-pointer"
                            >
                              {isFilled ? (
                                <StarFilledIcon className="w-5 h-5 text-amber-400 drop-shadow-xs" />
                              ) : (
                                <StarIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300">
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
                        className="w-full px-3.5 py-2 text-xs rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"
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
                        className="w-full px-3.5 py-2 text-xs rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"
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
                      className="w-full px-3.5 py-2 text-xs rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"
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
                      className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#015451] transition-all resize-none shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-2xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={submitting}
                      className="relative overflow-hidden flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-xs font-bold bg-linear-to-r from-[#015451] via-[#01726e] to-[#015451] hover:from-[#01605c] hover:to-[#01403e] text-white shadow-[0_10px_25px_-5px_rgba(1,84,81,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/30 transition-all duration-300 disabled:opacity-50 cursor-pointer select-none"
                    >
                      <div className="absolute inset-0 bg-linear-to-b from-white/35 via-transparent to-transparent pointer-events-none rounded-2xl" />
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="relative z-10">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <PaperPlaneIcon className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">Submit Feedback</span>
                        </>
                      )}
                    </motion.button>
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
