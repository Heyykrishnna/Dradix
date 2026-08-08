"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
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
  CameraIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { Mic, MicOff } from "lucide-react";

export interface AttachedScreenData {
  dataUrl: string;
  title: string;
  url: string;
  heading?: string;
  snippet?: string;
  capturedAt: string;
}

export interface ChatMessage {
  sender: "user" | "coach";
  text: string;
  screenAttachment?: AttachedScreenData;
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
    tooltip: "Get recruiter feedback & ATS score recommendations",
  },
  {
    label: "Job Matches",
    icon: RocketIcon,
    prompt: "What job roles and tech stacks match my profile?",
    tooltip: "Discover jobs matched to your verified tech stack",
  },
  {
    label: "Dashboard Summary",
    icon: DashboardIcon,
    prompt: "Give me an overview of my dashboard metrics and progress.",
    tooltip: "Review your active coding stats & repository metrics",
  },
  {
    label: "More...",
    icon: MagicWandIcon,
    prompt: "MORE_PILLS",
    tooltip: "Toggle additional quick prompt shortcuts",
  },
];

const EXTRA_PILLS = [
  {
    label: "Interview Prep",
    prompt: "Give me interview preparation advice for senior developer roles.",
    tooltip: "Practice interview questions tailored to senior roles",
  },
  {
    label: "Skills Breakdown",
    prompt: "Analyze my top skills and recommend what I should learn next.",
    tooltip: "Get recommendations for your next tech stack step",
  },
  {
    label: "GitHub Velocity",
    prompt: "How active is my GitHub contribution velocity?",
    tooltip: "Evaluate your commit velocity & repository activity",
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
  const [attachedScreen, setAttachedScreen] =
    useState<AttachedScreenData | null>(null);
  const [isCapturingScreen, setIsCapturingScreen] = useState(false);
  const [activePreviewImage, setActivePreviewImage] = useState<string | null>(
    null,
  );
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "coach",
      text: "Hello! I am your **Dradix AI Assistant**. I can help you analyze your **Profile & Resume**, discover **Job Matches**, review **Dashboard Analytics**, or answer questions about your **Current Screen View** (click `+` -> *Submit Current Screen*).",
    },
  ]);

  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstName = user?.first_name || user?.username || "Developer";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptionsMenu(false);
      }
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(false);
      }
    }
    if (showOptionsMenu || showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsMenu, showContextMenu]);

  const handleCaptureScreen = async () => {
    if (isCapturingScreen) return;
    setIsCapturingScreen(true);
    setShowContextMenu(false);

    try {
      const pageTitle = document.title || "Dradix Active Screen View";
      const pageUrl =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      const headingEl = document.querySelector("h1, h2");
      const pageHeading = headingEl?.textContent?.trim() || "";

      const mainContainer = document.querySelector("main") || document.body;
      const rawText = mainContainer?.textContent || "";
      const pageSnippet = rawText.replace(/\s+/g, " ").trim().slice(0, 450);

      // Brief pause to ensure context dropdown closes cleanly before snapshot
      await new Promise((resolve) => setTimeout(resolve, 150));

      let dataUrl = "";
      try {
        const canvas = await html2canvas(document.body, {
          ignoreElements: (el) =>
            el.hasAttribute("data-html2canvas-ignore") ||
            el.closest("[data-html2canvas-ignore='true']") !== null,
          scale: 1,
          useCORS: true,
          logging: false,
        });
        dataUrl = canvas.toDataURL("image/jpeg", 0.75);
      } catch (err) {
        console.warn("html2canvas screen capture fallback mode active:", err);
      }

      setAttachedScreen({
        dataUrl,
        title: pageTitle,
        url: pageUrl || "/",
        heading: pageHeading,
        snippet: pageSnippet,
        capturedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (err) {
      console.error("Screen capture failed:", err);
    } finally {
      setIsCapturingScreen(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if ((!query && !attachedScreen) || isAsking) return;

    const currentScreen = attachedScreen;
    const finalQuery =
      query ||
      (currentScreen
        ? `What am I currently watching on this screen: "${currentScreen.title}" (${currentScreen.url})?`
        : "");

    const newMsg: ChatMessage = {
      sender: "user",
      text: finalQuery,
      screenAttachment: currentScreen || undefined,
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setAttachedScreen(null);
    setIsAsking(true);

    try {
      const payloadHistory = updatedMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await apiFetch<ChatApiResponse>("/ai/coach/chat", {
        method: "POST",
        body: JSON.stringify({
          message: finalQuery,
          chatHistory: payloadHistory,
          context: currentScreen
            ? {
                attachedScreen: {
                  title: currentScreen.title,
                  url: currentScreen.url,
                  heading: currentScreen.heading,
                  snippet: currentScreen.snippet,
                },
              }
            : undefined,
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
        text: `Hello ${firstName}! Conversation history has been reset. How can I assist you with your **Profile**, **Jobs**, **Dashboard**, or **Current Screen View** today?`,
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
            onMouseEnter={() => setActiveTooltip("Open Dradix AI Assistant")}
            onMouseLeave={() => setActiveTooltip(null)}
            className="fixed bottom-6 right-6 z-50 w-13 h-13 p-2 bg-white/90 backdrop-blur-2xl backdrop-saturate-200 border border-white/90 shadow-[0_14px_45px_rgba(0,0,0,0.18),inset_0_1.5px_2px_rgba(255,255,255,1)] hover:bg-white rounded-full flex items-center justify-center group cursor-pointer shrink-0"
            title="Open Dradix AI Assistant (Ask about your profile, jobs, or current screen)"
          >
            <div className="w-7 h-7 relative flex items-center justify-center rounded-full overflow-hidden shrink-0">
              <Image
                src="/assets/images/Logo-DR.png"
                alt="Dradix Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            {activeTooltip === "Open Dradix AI Assistant" && (
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-zinc-900 text-white text-[11px] font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-50">
                Ask Dradix AI
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="glass-chatbot-modal"
            data-html2canvas-ignore="true"
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
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-110 max-h-[85vh] h-160 flex flex-col bg-white/80 backdrop-blur-2xl backdrop-saturate-200 border border-white/80 rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.2),inset_0_1.5px_2px_rgba(255,255,255,0.9)] overflow-hidden"
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
                  Dradix AI Assistant
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative" ref={optionsMenuRef}>
                  <button
                    onClick={() => setShowOptionsMenu((prev) => !prev)}
                    className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all cursor-pointer relative group"
                    title="Chat Options (Clear conversation history)"
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
                          title="Reset chat messages to starting state"
                        >
                          <ReloadIcon className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Clear Chat History</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-xs flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Close AI Assistant"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative z-10 px-7 pt-1 pb-2">
              <h1 className="font-serif italic text-3xl sm:text-4xl text-[#015451] font-medium tracking-tight">
                Hello {firstName}
              </h1>
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-zinc-950 tracking-tight leading-snug mt-0.5">
                How can I assist you today?
              </h2>
            </div>

            <div className="relative z-10 px-7 py-2 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
              {DEFAULT_PILLS.map((pill, idx) => {
                const IconComp = pill.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePillClick(pill.prompt)}
                    className="px-3.5 py-1.5 bg-white/80 hover:bg-white border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full text-[11px] font-semibold text-zinc-800 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                    title={pill.tooltip}
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
                      title={pill.tooltip}
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
                              {msg.screenAttachment && (
                                <div className="mb-2.5 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <CameraIcon className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                        Attached Screen View
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-300">
                                      {msg.screenAttachment.url}
                                    </span>
                                  </div>

                                  {msg.screenAttachment.dataUrl && (
                                    <div
                                      onClick={() =>
                                        setActivePreviewImage(
                                          msg.screenAttachment?.dataUrl || null,
                                        )
                                      }
                                      className="relative w-full h-28 rounded-lg overflow-hidden border border-white/20 cursor-pointer group/img"
                                      title="Click to view full screenshot"
                                    >
                                      <img
                                        src={msg.screenAttachment.dataUrl}
                                        alt="Attached screen capture"
                                        className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-[11px] font-medium transition-opacity gap-1">
                                        <EyeOpenIcon className="w-4 h-4" />
                                        <span>View Screen</span>
                                      </div>
                                    </div>
                                  )}

                                  <p className="text-[11px] font-semibold text-white/90 truncate">
                                    {msg.screenAttachment.title}
                                  </p>
                                </div>
                              )}

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
                                Dradix AI is analyzing your data & view...
                              </span>
                            </div>
                          </div>
                        </MessageScrollerItem>
                      )}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton title="Scroll to latest message" />
                </MessageScroller>
              </MessageScrollerProvider>
            </div>

            <div className="relative z-10 p-5 pt-2">
              <div className="bg-white/95 backdrop-blur-xl border border-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] rounded-2xl p-3 space-y-2">
                <AnimatePresence>
                  {isCapturingScreen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-800"
                    >
                      <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span>Snapshotting current screen view...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {attachedScreen && !isCapturingScreen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      className="p-2 bg-emerald-50/90 backdrop-blur-md border border-emerald-200/90 rounded-xl flex items-center justify-between gap-2 shadow-xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {attachedScreen.dataUrl ? (
                          <div
                            onClick={() =>
                              setActivePreviewImage(attachedScreen.dataUrl)
                            }
                            className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300 shrink-0 relative bg-zinc-900 cursor-pointer"
                            title="Click to expand screen preview"
                          >
                            <img
                              src={attachedScreen.dataUrl}
                              alt="Screen Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                              <CameraIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-emerald-600/10 border border-emerald-300 shrink-0 flex items-center justify-center text-emerald-700">
                            <CameraIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-extrabold uppercase text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded-xs tracking-wider">
                              Screen Snapshot Attached
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {attachedScreen.url}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-zinc-900 truncate mt-0.5">
                            {attachedScreen.title}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAttachedScreen(null)}
                        className="w-6 h-6 rounded-full bg-white hover:bg-rose-100 border border-zinc-200 hover:border-rose-300 text-zinc-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Remove attached screen"
                      >
                        <Cross2Icon className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder={
                    attachedScreen
                      ? "Ask whatever you are watching on this screen..."
                      : "Ask about your profile, jobs, or current screen..."
                  }
                  className="w-full text-xs font-medium text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none px-1"
                />

                <AnimatePresence>
                  {showContextMenu && (
                    <motion.div
                      ref={contextMenuRef}
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="p-2.5 bg-zinc-50 border border-zinc-200/90 shadow-lg rounded-2xl space-y-2 text-[11px] z-50"
                    >
                      <div className="grid grid-cols-1 gap-1.5">
                        <button
                          type="button"
                          onClick={handleCaptureScreen}
                          className="w-full p-2.5 bg-[#015451] hover:bg-[#01403d] text-white rounded-xl text-left font-medium transition-colors flex items-center justify-between shadow-xs cursor-pointer group"
                          title="Submit / attach what you are watching currently on screen to ask Dradix AI"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                              <CameraIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold text-white tracking-tight">
                                  Submit Current Screen
                                </span>
                              </div>
                              <p className="text-[10px] text-white/80 truncate mt-0.5 font-normal">
                                Snapshot what you are watching & ask Dradix AI
                              </p>
                            </div>
                          </div>
                          <PlusIcon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform shrink-0 ml-2" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setInputQuery(
                              "Analyze my current ATS score and resume.",
                            );
                            setShowContextMenu(false);
                          }}
                          className="p-2 bg-white border border-zinc-200/70 hover:border-[#015451] rounded-xl text-left font-medium text-zinc-700 hover:text-[#015451] transition-all cursor-pointer"
                          title="Attach resume ATS score & evaluation metrics"
                        >
                          <div className="flex items-center gap-1.5">
                            <FileTextIcon className="w-3.5 h-3.5 text-[#015451]" />
                            <span className="text-xs font-bold">
                              Resume Score
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                            Evaluate ATS score & fixes
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setInputQuery("Show my top job recommendations.");
                            setShowContextMenu(false);
                          }}
                          className="p-2 bg-white border border-zinc-200/70 hover:border-[#015451] rounded-xl text-left font-medium text-zinc-700 hover:text-[#015451] transition-all cursor-pointer"
                          title="Attach AI-matched career opportunities"
                        >
                          <div className="flex items-center gap-1.5">
                            <RocketIcon className="w-3.5 h-3.5 text-[#015451]" />
                            <span className="text-xs font-bold">
                              Job Matches
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                            Roles matched to skills
                          </p>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-1 relative">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => setShowContextMenu((prev) => !prev)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                        showContextMenu
                          ? "bg-[#015451] text-white"
                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 border border-zinc-200/70"
                      }`}
                      title="Click + to attach current screen or context shortcuts"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </motion.button>
                  </div>

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
                      title={
                        isListening
                          ? "Listening... Click to stop"
                          : "Voice input (Speech to text)"
                      }
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
                      disabled={
                        (!inputQuery.trim() && !attachedScreen) || isAsking
                      }
                      onClick={() => handleSendMessage()}
                      className="w-8 h-8 rounded-full bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                      title={
                        !inputQuery.trim() && !attachedScreen
                          ? "Type a query or attach screen to send"
                          : "Send message to Dradix AI"
                      }
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

      <AnimatePresence>
        {activePreviewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-3 bg-zinc-950 border-b border-zinc-800 text-white">
                <div className="flex items-center gap-2">
                  <CameraIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Captured Screen View
                  </span>
                </div>
                <button
                  onClick={() => setActivePreviewImage(null)}
                  className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 overflow-auto max-h-[80vh] flex items-center justify-center bg-black">
                <img
                  src={activePreviewImage}
                  alt="Full captured screen"
                  className="max-w-full h-auto rounded-lg border border-zinc-800"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
