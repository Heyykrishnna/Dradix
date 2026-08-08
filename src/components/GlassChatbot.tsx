"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import {
  Cross2Icon,
  DotsHorizontalIcon,
  PlusIcon,
  ArrowUpIcon,
  ReloadIcon,
  MagicWandIcon,
  FileTextIcon,
  RocketIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";
import { Mic, MicOff } from "lucide-react";

export interface ChatMessage {
  sender: "user" | "coach";
  text: string;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

interface ChatApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    reply?: string;
  };
}

const DEFAULT_PILLS = [
  {
    label: "Analyze Resume",
    icon: FileTextIcon,
    prompt: "How can I optimize my resume and ATS score?",
  },
  {
    label: "Job Matches",
    icon: RocketIcon,
    prompt: "What job roles and tech stacks match my profile?",
  },
  {
    label: "Dashboard Summary",
    icon: DashboardIcon,
    prompt: "Give me an overview of my dashboard metrics and progress.",
  },
  { label: "More...", icon: MagicWandIcon, prompt: "MORE_PILLS" },
];

const EXTRA_PILLS = [
  {
    label: "Interview Prep",
    prompt: "Give me interview preparation advice for senior developer roles.",
  },
  {
    label: "Skills Breakdown",
    prompt: "Analyze my top skills and recommend what I should learn next.",
  },
  {
    label: "GitHub Velocity",
    prompt: "How active is my GitHub contribution velocity?",
  },
];

export function GlassChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showMorePills, setShowMorePills] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "coach",
      text: "Hello! I am your **Dradix AI Assistant**. I can help you analyze your **Profile & Resume**, discover **Job & Career Matches**, or review your **Dashboard Analytics**.",
    },
  ]);

  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstName = user?.first_name || user?.username || "Sam";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptionsMenu(false);
      }
    }
    if (showOptionsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsMenu]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isAsking) return;

    const newMsg: ChatMessage = { sender: "user", text: query };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setIsAsking(true);

    try {
      const payloadHistory = updatedMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await apiFetch<ChatApiResponse>("/ai/coach/chat", {
        method: "POST",
        body: JSON.stringify({
          message: query,
          chatHistory: payloadHistory,
        }),
      });

      const replyText = res?.data?.reply;
      if (replyText) {
        setMessages((prev) => [...prev, { sender: "coach", text: replyText }]);
      } else {
        throw new Error("No response string returned");
      }
    } catch (err) {
      console.error("Dradix AI connection error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          text: "I am having trouble connecting to **Dradix AI** server right now. Please ensure the backend is running and try sending your question again.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const handlePillClick = (prompt: string) => {
    if (prompt === "MORE_PILLS") {
      setShowMorePills((prev) => !prev);
      return;
    }
    handleSendMessage(prompt);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: "coach",
        text: `Hello ${firstName}! Conversation history has been reset. How can I assist you with your **Profile**, **Jobs**, or **Dashboard** today?`,
      },
    ]);
    setShowOptionsMenu(false);
  };

  const toggleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognitionConstructor =
        (
          window as unknown as Record<
            string,
            new () => SpeechRecognitionInstance
          >
        ).SpeechRecognition ||
        (
          window as unknown as Record<
            string,
            new () => SpeechRecognitionInstance
          >
        ).webkitSpeechRecognition;

      const recognition = new SpeechRecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="launcher-button"
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-2.5 bg-white/85 backdrop-blur-2xl backdrop-saturate-200 border border-white/90 shadow-[0_14px_45px_rgba(0,0,0,0.18),inset_0_1.5px_2px_rgba(255,255,255,1)] hover:bg-white rounded-full group cursor-pointer"
            title="Open Dradix AI Assistant"
          >
            <div className="w-6 h-6 relative flex items-center justify-center rounded-full overflow-hidden">
              <Image
                src="/assets/images/Logo-DR.png"
                alt="Dradix Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="glass-chatbot-modal"
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 28,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.88,
              y: 28,
              transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
            }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 26,
              mass: 0.8,
            }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-110 max-h-[85vh] h-160 flex flex-col bg-white/75 backdrop-blur-2xl backdrop-saturate-200 border border-white/80 rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.9)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />

            <div className="relative z-50 flex items-center justify-between px-6 pt-5 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 relative rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/assets/images/Logo-DR.png"
                    alt="Dradix"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[12px] font-extrabold text-[#015451] uppercase tracking-wider">
                  Dradix AI
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" ref={optionsMenuRef}>
                  <button
                    onClick={() => setShowOptionsMenu((prev) => !prev)}
                    className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all cursor-pointer"
                    title="Options"
                  >
                    <DotsHorizontalIcon className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showOptionsMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -8 }}
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 28,
                        }}
                        className="absolute right-0 top-10 w-48 bg-white/98 backdrop-blur-2xl border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.18)] rounded-2xl p-1.5 z-50 space-y-1 text-xs"
                      >
                        <button
                          onClick={handleClearHistory}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 hover:bg-zinc-100 font-medium transition-colors text-left cursor-pointer"
                        >
                          <ReloadIcon className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Clear Chat</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Close"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative z-10 px-7 pt-1 pb-3">
              <h1 className="font-serif italic text-3xl sm:text-4xl text-[#015451] font-medium tracking-tight">
                Hello {firstName}
              </h1>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-zinc-950 tracking-tight leading-snug mt-0.5">
                How can I assist you today?
              </h2>
            </div>

            <div className="relative z-10 px-7 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
              {DEFAULT_PILLS.map((pill, idx) => {
                const IconComp = pill.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePillClick(pill.prompt)}
                    className="px-3.5 py-1.5 bg-white/80 hover:bg-white border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full text-[11px] font-semibold text-zinc-800 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <IconComp className="w-3.5 h-3.5 text-[#015451]" />
                    <span>{pill.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showMorePills && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 px-7 py-1.5 flex flex-wrap gap-2 overflow-hidden"
                >
                  {EXTRA_PILLS.map((pill, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePillClick(pill.prompt)}
                      className="px-3 py-1 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/80 rounded-full text-[10px] font-bold text-[#015451] transition-colors cursor-pointer"
                    >
                      {pill.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10 flex-1 min-h-0 px-6 py-2">
              <MessageScrollerProvider
                autoScroll={true}
                defaultScrollPosition="end"
              >
                <MessageScroller className="bg-transparent size-full">
                  <MessageScrollerViewport className="scrollbar-thin pr-1">
                    <MessageScrollerContent className="gap-3.5 py-1">
                      {messages.map((msg, idx) => (
                        <MessageScrollerItem
                          key={idx}
                          messageId={`msg-${idx}`}
                          scrollAnchor={idx === messages.length - 1}
                        >
                          <div
                            className={`flex flex-col ${
                              msg.sender === "user"
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`p-4 transition-all ${
                                msg.sender === "user"
                                  ? "bg-zinc-950 text-white rounded-2xl rounded-tr-xs shadow-md max-w-[85%]"
                                  : "bg-white/85 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-zinc-900 rounded-2xl rounded-tl-xs max-w-[92%]"
                              }`}
                            >
                              {msg.sender === "user" ? (
                                <p className="text-xs font-medium leading-relaxed">
                                  {msg.text}
                                </p>
                              ) : (
                                <MarkdownRenderer content={msg.text} />
                              )}
                            </div>
                          </div>
                        </MessageScrollerItem>
                      ))}

                      {isAsking && (
                        <MessageScrollerItem
                          messageId="msg-loading"
                          scrollAnchor={true}
                        >
                          <div className="flex items-start">
                            <div className="bg-white/85 backdrop-blur-md border border-white/90 p-3.5 rounded-2xl rounded-tl-xs shadow-xs text-xs text-zinc-600 font-medium flex items-center gap-2.5">
                              <div className="w-4 h-4 border-2 border-[#015451] border-t-transparent rounded-full animate-spin" />
                              <span>
                                AI Assistant is analyzing your data...
                              </span>
                            </div>
                          </div>
                        </MessageScrollerItem>
                      )}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton />
                </MessageScroller>
              </MessageScrollerProvider>
            </div>

            <div className="relative z-10 p-5 pt-2">
              <div className="bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] rounded-2xl p-3 space-y-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Ask about your profile, jobs, or dashboard..."
                  className="w-full text-xs font-medium text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none px-1"
                />

                <AnimatePresence>
                  {showContextMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="p-2 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-1.5 text-[11px]"
                    >
                      <p className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] px-1">
                        Quick Context Shortcuts
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => {
                            setInputQuery(
                              "Analyze my current ATS score and resume.",
                            );
                            setShowContextMenu(false);
                          }}
                          className="p-1.5 bg-white border border-zinc-200/60 rounded-lg text-left font-medium text-zinc-700 hover:border-[#015451] hover:text-[#015451] transition-colors"
                        >
                          📄 Resume Score
                        </button>
                        <button
                          onClick={() => {
                            setInputQuery("Show my top job recommendations.");
                            setShowContextMenu(false);
                          }}
                          className="p-1.5 bg-white border border-zinc-200/60 rounded-lg text-left font-medium text-zinc-700 hover:border-[#015451] hover:text-[#015451] transition-colors"
                        >
                          🎯 Job Matches
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-1">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => setShowContextMenu((prev) => !prev)}
                    className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/70 flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                    title="Attach Context"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        isListening
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200/70"
                      }`}
                      title={isListening ? "Listening..." : "Voice Input"}
                    >
                      {isListening ? (
                        <Mic className="w-3.5 h-3.5" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      disabled={!inputQuery.trim() || isAsking}
                      onClick={() => handleSendMessage()}
                      className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                      title="Send Message"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
