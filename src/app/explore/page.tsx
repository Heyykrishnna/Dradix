"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  Share2Icon,
  Cross2Icon,
  ImageIcon,
  CodeIcon,
  LinkNone1Icon,
  StarIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import {
  FaBriefcase,
  FaHashtag,
  FaFire,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaLocationDot,
  FaClock,
  FaUserPlus,
  FaArrowUp,
  FaPaperPlane,
} from "react-icons/fa6";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  role: string;
  time: string;
  content: string;
  tags: string[];
  image?: string;
  upvotes: number;
  comments: number;
  shares: number;
  upvoted: boolean;
  bookmarked: boolean;
  verified: boolean;
}

interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  type: string;
  salary: string;
  stack: string[];
  posted: string;
  logo: string;
  color: string;
  featured: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const initialPosts: Post[] = [
  {
    id: "1",
    author: "Priya Sharma",
    handle: "@priya_codes",
    avatar: "PS",
    role: "Senior Frontend Engineer at Stripe",
    time: "2m ago",
    content:
      "Just shipped a custom Recharts tooltip that follows the mouse cursor! 🎯\n\nThe key is tracking chartX/chartY from the chart onMouseMove event and passing it as the position prop to <Tooltip>. No more default top-left positioning.\n\n#recharts #react #ux",
    tags: ["recharts", "react", "ux"],
    upvotes: 142,
    comments: 18,
    shares: 34,
    upvoted: false,
    bookmarked: false,
    verified: true,
  },
  {
    id: "2",
    author: "Karan Dev",
    handle: "@karandev",
    avatar: "KD",
    role: "Fullstack Developer · Building in Public",
    time: "18m ago",
    content:
      "Built a terminal-style portfolio using React + Xterm.js. You can actually run commands:\n• ls projects\n• cat resume\n• open dradix\n\nThe future of dev portfolios is interactive. Who else is building this?\n\n#portfolio #terminal #nextjs",
    tags: ["portfolio", "terminal", "nextjs"],
    image: "terminal_portfolio",
    upvotes: 487,
    comments: 63,
    shares: 121,
    upvoted: true,
    bookmarked: true,
    verified: false,
  },
  {
    id: "3",
    author: "Sanya Malhotra",
    handle: "@sanya_ai",
    avatar: "SM",
    role: "ML Engineer · NLP Researcher",
    time: "45m ago",
    content:
      "Hot take: Most AI portfolios don't show real AI work. They're wrapper apps on top of GPT APIs.\n\nGenuine AI work:\n✅ Custom model fine-tuning\n✅ Novel architecture experiments\n✅ Dataset curation pipelines\n✅ Benchmark comparisons\n\n#machinelearning #ai #career",
    tags: ["machinelearning", "ai", "career"],
    upvotes: 1024,
    comments: 211,
    shares: 342,
    upvoted: false,
    bookmarked: false,
    verified: true,
  },
  {
    id: "4",
    author: "Rohit Verma",
    handle: "@rohitcodes",
    avatar: "RV",
    role: "Backend Engineer · Rust Enthusiast",
    time: "2h ago",
    content:
      "Rewrote our Node.js microservice in Rust today.\n\nCold start: 1.2s → 18ms\nMemory: 180MB → 6MB\n\nSometimes the hype is real. 🦀\n\n#rust #performance #backend",
    tags: ["rust", "performance", "backend"],
    upvotes: 732,
    comments: 89,
    shares: 204,
    upvoted: false,
    bookmarked: false,
    verified: false,
  },
  {
    id: "5",
    author: "Dev Arora",
    handle: "@devarora_oss",
    avatar: "DA",
    role: "Open Source Maintainer",
    time: "4h ago",
    content:
      "Just hit 2,000 GitHub stars on my Next.js boilerplate! 🌟\n\nStarted with 0 stars and zero expectations. The community is everything.\n\n#opensource #nextjs #saas",
    tags: ["opensource", "nextjs", "saas"],
    upvotes: 563,
    comments: 44,
    shares: 87,
    upvoted: false,
    bookmarked: false,
    verified: false,
  },
];

const jobsList: Job[] = [
  {
    id: "j1",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    location: "Remote · San Francisco",
    type: "Full-time",
    salary: "$160k – $220k",
    stack: ["TypeScript", "React", "GraphQL"],
    posted: "2h ago",
    logo: "ST",
    color: "#635bff",
    featured: true,
  },
  {
    id: "j2",
    company: "Vercel",
    role: "Next.js Core Developer",
    location: "Remote · Global",
    type: "Full-time",
    salary: "$140k – $190k",
    stack: ["Next.js", "Rust", "Node.js"],
    posted: "5h ago",
    logo: "VC",
    color: "#18181b",
    featured: true,
  },
  {
    id: "j3",
    company: "Linear",
    role: "Product Engineer",
    location: "Remote · EU/US",
    type: "Full-time",
    salary: "$120k – $170k",
    stack: ["TypeScript", "Electron", "Go"],
    posted: "1d ago",
    logo: "LN",
    color: "#5E6AD2",
    featured: false,
  },
  {
    id: "j4",
    company: "Figma",
    role: "Infrastructure Engineer",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$170k – $230k",
    stack: ["Kubernetes", "Go", "Python"],
    posted: "2d ago",
    logo: "FG",
    color: "#f24e1e",
    featured: false,
  },
  {
    id: "j5",
    company: "Supabase",
    role: "Open Source Maintainer",
    location: "Remote · Global",
    type: "Full-time",
    salary: "$100k – $140k",
    stack: ["PostgreSQL", "Rust", "TypeScript"],
    posted: "3d ago",
    logo: "SB",
    color: "#3ecf8e",
    featured: false,
  },
];

const avatarColors: Record<string, string> = {
  PS: "#6366f1",
  KD: "#059669",
  SM: "#7c3aed",
  RV: "#db2777",
  DA: "#f59e0b",
  YK: "#0891b2",
};

const trendingTopics = [
  { tag: "#nextjs15", category: "Technology", posts: "14.2k posts" },
  { tag: "#rustlang", category: "Programming", posts: "8.4k posts" },
  { tag: "#openai", category: "AI", posts: "32.1k posts" },
  { tag: "#typescript", category: "Development", posts: "22.7k posts" },
  { tag: "#systemdesign", category: "Career", posts: "5.8k posts" },
  { tag: "#opensource", category: "Community", posts: "11.3k posts" },
  { tag: "#webdev", category: "Development", posts: "18.6k posts" },
];

// ─── Inline Composer ──────────────────────────────────────────────────────────

function InlineComposer({ onPost }: { onPost: (post: Post) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFocus = () => {
    setExpanded(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleDiscard = () => {
    setExpanded(false);
    setText("");
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = () => {
    if (!text.trim() && !imageFile) return;
    const tags = Array.from(text.matchAll(/#(\w+)/g)).map((m) => m[1]);
    onPost({
      id: Date.now().toString(),
      author: "Yatharth K.",
      handle: "@yatharth_dev",
      avatar: "YK",
      role: "Full Stack Developer · Building Dradix",
      time: "Just now",
      content: text,
      tags,
      image: imageFile ? "uploaded" : undefined,
      upvotes: 0,
      comments: 0,
      shares: 0,
      upvoted: false,
      bookmarked: false,
      verified: true,
    });
    handleDiscard();
  };

  return (
    <div className={`border-b border-zinc-100 transition-all duration-200 ${expanded ? "bg-white" : ""}`}>
      <div className="px-5 py-4 flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-[#0891b2] flex items-center justify-center text-white text-[11px] font-black shrink-0 mt-0.5">YK</div>

        {/* Composer body */}
        <div className="flex-1 min-w-0">
          {!expanded ? (
            /* Collapsed: single-line prompt */
            <button
              onClick={handleFocus}
              className="w-full text-left text-[15px] text-zinc-300 hover:text-zinc-400 py-2 transition-colors cursor-text"
            >
              What are you working on?
            </button>
          ) : (
            /* Expanded state */
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What are you working on? Use #hashtags to tag topics…"
                rows={4}
                maxLength={1000}
                className="w-full text-[14px] text-zinc-800 placeholder-zinc-300 resize-none focus:outline-none leading-relaxed"
              />

              {/* Image preview */}
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                  <button
                    onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Cross2Icon className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                    isDragOver ? "border-blue-400 bg-blue-50" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <ImageIcon className="w-5 h-5 text-zinc-300" />
                  <p className="text-[11px] text-zinc-400 font-semibold">Drop image or <span className="text-blue-600">browse</span></p>
                  <p className="text-[10px] text-zinc-300">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>
          )}

          {/* Toolbar — always visible but minimal when collapsed */}
          <div className={`flex items-center gap-1 ${expanded ? "pt-3 mt-1 border-t border-zinc-100" : "pt-3"}`}>
            <button onClick={() => { handleFocus(); fileInputRef.current?.click(); }} className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer" title="Image">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button onClick={handleFocus} className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer" title="Code">
              <CodeIcon className="w-4 h-4" />
            </button>
            <button onClick={handleFocus} className="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer" title="Link">
              <LinkNone1Icon className="w-4 h-4" />
            </button>

            <div className="ml-auto flex items-center gap-2">
              {expanded && (
                <>
                  <span className="text-[10px] text-zinc-300 font-semibold">{text.length}/1000</span>
                  <button onClick={handleDiscard} className="px-3 py-1.5 text-[12px] font-semibold text-zinc-500 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer">
                    Discard
                  </button>
                </>
              )}
              <button
                onClick={expanded ? handleSubmit : handleFocus}
                disabled={expanded && !text.trim() && !imageFile}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Post Detail Overlay ──────────────────────────────────────────────────────

function PostDetailOverlay({ post, onClose, onUpvote, onBookmark }: {
  post: Post;
  onClose: () => void;
  onUpvote: (id: string) => void;
  onBookmark: (id: string) => void;
}) {
  const [detailTab, setDetailTab] = useState<"comments" | "upvotes">("comments");
  const [commentText, setCommentText] = useState("");

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0f0f0f] w-full max-w-[560px] max-h-[90vh] rounded-3xl flex flex-col overflow-hidden border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer">
            <ArrowLeftIcon className="w-4 h-4 text-zinc-300" />
          </button>
          <p className="text-[13px] font-bold text-zinc-200">Post by {post.author}</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 space-y-4">
            {/* Author */}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0"
                style={{ backgroundColor: avatarColors[post.avatar] || "#374151" }}
              >
                {post.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-bold text-white font-heading">{post.author}</p>
                  {post.verified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-500">{post.handle} · {post.time}</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">{post.role}</p>
              </div>
            </div>

            {/* Full content */}
            <p className="text-[14px] text-zinc-200 leading-relaxed whitespace-pre-line">{post.content}</p>

            {/* Image */}
            {post.image && (
              <div className="rounded-2xl overflow-hidden bg-zinc-900 h-48 flex items-center justify-center border border-zinc-800">
                <div className="text-center space-y-2">
                  <div className="w-16 h-9 mx-auto bg-zinc-800 rounded-md flex items-center justify-center">
                    <span className="text-[8px] font-mono text-green-400">$ ls projects</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-mono">terminal_portfolio.gif</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 rounded-full px-2.5 py-0.5">#{tag}</span>
                ))}
              </div>
            )}

            {/* Action row */}
            <div className="flex items-center gap-2 py-2 border-y border-zinc-800">
              <button
                onClick={() => onUpvote(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                  post.upvoted ? "text-amber-400 bg-amber-400/10" : "text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10"
                }`}
              >
                <FaArrowUp className="w-3.5 h-3.5" />
                <span>{post.upvotes}</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all cursor-pointer">
                <FaRegComment className="w-3.5 h-3.5" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all cursor-pointer">
                <Share2Icon className="w-3.5 h-3.5" />
                <span>{post.shares}</span>
              </button>
              <div className="ml-auto">
                <button
                  onClick={() => onBookmark(post.id)}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    post.bookmarked ? "text-amber-400" : "text-zinc-500 hover:text-amber-400"
                  }`}
                >
                  {post.bookmarked ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Comment input */}
          <div className="px-5 pb-4 flex items-center gap-3 border-b border-zinc-800">
            <div className="w-8 h-8 rounded-xl bg-[#0891b2] flex items-center justify-center text-white text-[10px] font-black shrink-0">YK</div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post your comment"
              className="flex-1 bg-transparent text-[13px] text-zinc-300 placeholder-zinc-600 focus:outline-none"
            />
            <button
              disabled={!commentText.trim()}
              className="w-8 h-8 rounded-full bg-amber-400 disabled:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <FaPaperPlane className="w-3.5 h-3.5 text-black disabled:text-zinc-600" />
            </button>
          </div>

          {/* Detail tabs */}
          <div className="flex border-b border-zinc-800">
            {(["comments", "upvotes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                  detailTab === tab ? "text-amber-400 border-b-2 border-amber-400" : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {tab === "comments" ? "Comments" : `Upvotes · ${post.upvotes}`}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="px-5 py-8 flex flex-col items-center justify-center gap-3 text-zinc-700">
            {detailTab === "comments" ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
                  <FaRegComment className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-[13px] font-bold text-zinc-500">No comments yet</p>
                <p className="text-[11px] text-zinc-700 text-center">Be the first to leave a comment on this post.</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center">
                  <FaArrowUp className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-[13px] font-bold text-zinc-500">Your upvotes and feedback are welcome!</p>
                <p className="text-[11px] text-zinc-700 text-center">Words have more power than we think. Be kind.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  onUpvote,
  onBookmark,
  onOpen,
}: {
  post: Post;
  onUpvote: (id: string) => void;
  onBookmark: (id: string) => void;
  onOpen: (post: Post) => void;
}) {
  const words = post.content.split(" ");
  const isLong = words.length > 55;
  const preview = isLong ? words.slice(0, 55).join(" ") + "…" : post.content;

  return (
    <article className="border-b border-zinc-100 px-5 py-4 hover:bg-zinc-50/60 transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0 mt-0.5"
          style={{ backgroundColor: avatarColors[post.avatar] || "#374151" }}
        >
          {post.avatar}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[13px] font-bold text-zinc-900">{post.author}</span>
            {post.verified && (
              <span className="inline-flex w-3.5 h-3.5 rounded-full bg-blue-500 items-center justify-center shrink-0">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            <span className="text-[11px] text-zinc-400">{post.handle}</span>
            <span className="text-zinc-200 text-[11px]">·</span>
            <span className="text-[11px] text-zinc-400">{post.time}</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5 mb-2.5">{post.role}</p>

          {/* Clickable body */}
          <button className="text-left w-full cursor-pointer" onClick={() => onOpen(post)}>
            <p className="text-[13px] text-zinc-700 leading-relaxed whitespace-pre-line hover:text-zinc-900 transition-colors">
              {preview}
              {isLong && <span className="ml-1 text-blue-600 font-semibold text-[12px]">Read more</span>}
            </p>

            {post.image && (
              <div className="mt-3 rounded-2xl overflow-hidden bg-linear-to-br from-zinc-900 to-zinc-800 h-44 flex items-center justify-center border border-zinc-100">
                <div className="text-center space-y-2">
                  <div className="w-16 h-9 mx-auto bg-zinc-700 rounded-md flex items-center justify-center">
                    <span className="text-[8px] font-mono text-green-400">$ ls projects</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">terminal_portfolio.gif</p>
                </div>
              </div>
            )}
          </button>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5 hover:bg-blue-100 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-0 mt-3 -ml-2">
            <button
              onClick={() => onUpvote(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                post.upvoted ? "text-amber-500 bg-amber-50" : "text-zinc-400 hover:text-amber-500 hover:bg-amber-50"
              }`}
            >
              <FaArrowUp className="w-3.5 h-3.5" />
              <span>{post.upvotes}</span>
            </button>
            <button
              onClick={() => onOpen(post)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-zinc-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            >
              <FaRegComment className="w-3.5 h-3.5" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer">
              <Share2Icon className="w-3.5 h-3.5" />
              <span>{post.shares}</span>
            </button>
            <button
              onClick={() => onBookmark(post.id)}
              className={`ml-auto p-1.5 rounded-xl transition-all cursor-pointer ${
                post.bookmarked ? "text-amber-500" : "text-zinc-400 hover:text-amber-500 hover:bg-amber-50"
              }`}
            >
              {post.bookmarked ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job }: { job: Job }) {
  return (
    <article className="border-b border-zinc-100 px-5 py-4 hover:bg-zinc-50/60 transition-colors group">
      {job.featured && (
        <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <StarIcon className="w-2.5 h-2.5" /> Featured
        </p>
      )}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0" style={{ backgroundColor: job.color }}>
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{job.role}</p>
              <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">{job.company}</p>
            </div>
            <span className="text-[10px] text-zinc-400 shrink-0">{job.posted}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1"><FaLocationDot className="w-2.5 h-2.5" />{job.location}</span>
            <span className="flex items-center gap-1"><FaClock className="w-2.5 h-2.5" />{job.type}</span>
            <span className="font-bold text-emerald-600">{job.salary}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {job.stack.map((tech) => (
              <span key={tech} className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 rounded-full px-2.5 py-0.5">{tech}</span>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer">Apply Now</button>
            <button className="px-3 py-1.5 border border-zinc-200 hover:border-zinc-300 text-zinc-600 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1">
              <ExternalLinkIcon className="w-3 h-3" /> View
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type FeedTab = "foryou" | "following" | "jobs";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("foryou");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvoted: !p.upvoted, upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1 } : p))
    );
    if (openPost?.id === id) {
      setOpenPost((prev) =>
        prev ? { ...prev, upvoted: !prev.upvoted, upvotes: prev.upvoted ? prev.upvotes - 1 : prev.upvotes + 1 } : null
      );
    }
  };

  const handleBookmark = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p)));
    if (openPost?.id === id) {
      setOpenPost((prev) => (prev ? { ...prev, bookmarked: !prev.bookmarked } : null));
    }
  };

  const handleNewPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  const displayedPosts = posts.filter(
    (p) => searchQuery === "" || p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { id: FeedTab; label: string }[] = [
    { id: "foryou", label: "For you" },
    { id: "following", label: "Following" },
    { id: "jobs", label: "Jobs" },
  ];

  return (
    <>
      {/* Post Detail Overlay */}
      {openPost && (
        <PostDetailOverlay
          post={openPost}
          onClose={() => setOpenPost(null)}
          onUpvote={handleUpvote}
          onBookmark={handleBookmark}
        />
      )}

      <div className="flex gap-0 items-start max-w-[1200px] mx-auto">

        {/* ── Main Feed Column ── */}
        <div className="flex-1 min-w-0 border-x border-zinc-100">

          {/* Sticky tab bar */}
          <div className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 text-[13px] font-bold transition-colors cursor-pointer relative ${
                    activeTab === tab.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-zinc-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* FOR YOU / FOLLOWING */}
          {(activeTab === "foryou" || activeTab === "following") && (
            <>
              <InlineComposer onPost={handleNewPost} />

              {activeTab === "following" ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <FaUserPlus className="w-9 h-9 text-zinc-200" />
                  <p className="text-[14px] font-bold text-zinc-400">Follow developers to see their posts</p>
                  <p className="text-[12px] text-zinc-300">Discover people from the right sidebar</p>
                </div>
              ) : (
                displayedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpvote={handleUpvote}
                    onBookmark={handleBookmark}
                    onOpen={setOpenPost}
                  />
                ))
              )}
            </>
          )}

          {/* JOBS */}
          {activeTab === "jobs" && (
            <>
              <div className="border-b border-zinc-100 px-5 py-4">
                <h2 className="text-[15px] font-extrabold text-zinc-900">Open Roles</h2>
                <p className="text-[12px] text-zinc-400 mt-0.5">Curated developer jobs from top companies</p>
              </div>
              {jobsList.map((job) => <JobCard key={job.id} job={job} />)}
            </>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="hidden lg:block w-80 xl:w-[340px] shrink-0 pl-6 space-y-4">

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts, people…"
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-100 rounded-xl text-[13px] text-zinc-700 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-200 transition-all"
            />
          </div>

          {/* Trending */}
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
              <FaFire className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-[13px] font-extrabold text-zinc-900">Trending in Tech</p>
            </div>
            {trendingTopics.map((topic, i) => (
              <button key={topic.tag} className="w-full px-4 py-3 flex items-start justify-between hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 last:border-0 text-left">
                <div>
                  <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">{topic.category} · Trending</p>
                  <p className="text-[13px] font-bold text-zinc-900 mt-0.5">{topic.tag}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{topic.posts}</p>
                </div>
                <span className="text-[11px] text-zinc-300 font-semibold mt-1">{i + 1}</span>
              </button>
            ))}
            <button className="w-full px-4 py-3 text-[13px] font-semibold text-blue-600 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1.5">
              Show more <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Who to follow */}
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-[13px] font-extrabold text-zinc-900">Who to follow</p>
            </div>
            {[
              { name: "Theo Browne", handle: "@t3dotgg", role: "Creator of T3 Stack", avatar: "TB", color: "#7c3aed" },
              { name: "Lee Robinson", handle: "@leeerob", role: "VP @ Vercel", avatar: "LR", color: "#3b82f6" },
              { name: "Anthony Fu", handle: "@antfu7", role: "Open Source Dev", avatar: "AF", color: "#059669" },
            ].map((u) => (
              <div key={u.handle} className="px-4 py-3 flex items-center gap-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ backgroundColor: u.color }}>
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-zinc-900 truncate">{u.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{u.handle} · {u.role}</p>
                </div>
                <button className="shrink-0 px-3 py-1.5 text-[11px] font-bold bg-zinc-900 hover:bg-zinc-700 text-white rounded-xl transition-colors cursor-pointer">Follow</button>
              </div>
            ))}
            <button className="w-full px-4 py-3 text-[13px] font-semibold text-blue-600 hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1.5">
              Show more <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Discussions */}
          <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
              <p className="text-[13px] font-extrabold text-zinc-900">Active Discussions</p>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            {[
              { title: "Best stack for a solo SaaS in 2025?", replies: 42, tag: "#saas" },
              { title: "Is Rust ready for full-stack web dev?", replies: 28, tag: "#rust" },
              { title: "System design: URL shortener at scale", replies: 71, tag: "#systemdesign" },
              { title: "AI tools that actually save developer time", replies: 55, tag: "#ai" },
            ].map((d) => (
              <button key={d.title} className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 last:border-0">
                <p className="text-[12px] font-semibold text-zinc-800 leading-snug">{d.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-blue-600 font-semibold">{d.tag}</span>
                  <span className="text-[10px] text-zinc-400">{d.replies} replies</span>
                </div>
              </button>
            ))}
          </div>

          {/* Trending tags */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FaHashtag className="w-3 h-3 text-zinc-500" />
              <p className="text-[13px] font-extrabold text-zinc-900">Trending Tags</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["#nextjs", "#rust", "#ai", "#opensource", "#typescript", "#portfolio", "#career", "#ml", "#systemdesign", "#go", "#react", "#devops"].map((tag) => (
                <button key={tag} className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-full px-2.5 py-1 transition-colors cursor-pointer">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-zinc-300 px-1 pb-4 leading-relaxed">© 2025 Dradix · Developer Social Platform</p>
        </div>
      </div>
    </>
  );
}
