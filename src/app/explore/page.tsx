"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "@radix-ui/react-icons";
import {
  FaHashtag,
  FaFire,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
  FaLocationDot,
  FaClock,
  FaUserPlus,
  FaArrowUp,
} from "react-icons/fa6";
import { seedPosts, jobsList, avatarColors, trendingTopics, Post, Job } from "./data";

// ─── Inline Composer ──────────────────────────────────────────────────────────

function InlineComposer({ onPost }: { onPost: (post: Post) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  // Collapse when clicking outside the composer component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (composerRef.current && !composerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div
      ref={composerRef}
      className={`border-b border-zinc-100 transition-all duration-200 ${expanded ? "bg-white" : ""}`}
    >
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

          {/* Toolbar */}
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
  onOpen: (id: string) => void;
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

          {/* Clickable body redirects to page */}
          <button className="text-left w-full cursor-pointer" onClick={() => onOpen(post.id)}>
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
                <span key={tag} className="text-[10px] font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5 hover:bg-blue-100 transition-colors">
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
              onClick={() => onOpen(post.id)}
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab>("foryou");
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dradix_posts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const timer = setTimeout(() => {
          setPosts(parsed);
        }, 0);
        return () => clearTimeout(timer);
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("dradix_posts", JSON.stringify(seedPosts));
    }
  }, []);

  const handleUpvote = (id: string) => {
    const newPosts = posts.map((p) =>
      p.id === id ? { ...p, upvoted: !p.upvoted, upvotes: p.upvoted ? p.upvotes - 1 : p.upvotes + 1 } : p
    );
    setPosts(newPosts);
    localStorage.setItem("dradix_posts", JSON.stringify(newPosts));
  };

  const handleBookmark = (id: string) => {
    const newPosts = posts.map((p) => (p.id === id ? { ...p, bookmarked: !p.bookmarked } : p));
    setPosts(newPosts);
    localStorage.setItem("dradix_posts", JSON.stringify(newPosts));
  };

  const handleNewPost = (post: Post) => {
    const newPosts = [post, ...posts];
    setPosts(newPosts);
    localStorage.setItem("dradix_posts", JSON.stringify(newPosts));
  };

  const handleOpenPost = (id: string) => {
    router.push(`/explore/${id}`);
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
                  onOpen={handleOpenPost}
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
  );
}
