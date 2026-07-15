"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, Share2Icon } from "@radix-ui/react-icons";
import { FaArrowUp, FaRegComment, FaRegBookmark, FaBookmark, FaPaperPlane } from "react-icons/fa6";
import { seedPosts, avatarColors, Post } from "../data";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [detailTab, setDetailTab] = useState<"comments" | "upvotes">("comments");
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState<{ id: string; author: string; text: string; time: string }[]>([]);

  useEffect(() => {
    // Check localStorage first for updated posts state, else fallback to seedPosts
    const saved = localStorage.getItem("dradix_posts");
    let postsData = seedPosts;
    if (saved) {
      try {
        postsData = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const found = postsData.find((p) => p.id === id);
    const savedComments = localStorage.getItem(`dradix_comments_${id}`);
    
    let commentsData: { id: string; author: string; text: string; time: string }[] = [];
    if (savedComments) {
      try {
        commentsData = JSON.parse(savedComments);
      } catch (e) {
        console.error(e);
      }
    }

    const timer = setTimeout(() => {
      setPost(found || null);
      setCommentsList(commentsData);
    }, 0);

    return () => clearTimeout(timer);
  }, [id]);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 gap-4">
        <p className="font-bold text-lg">Post not found</p>
        <Link href="/explore" className="text-blue-600 hover:underline text-sm font-semibold">
          Back to Explore
        </Link>
      </div>
    );
  }

  const updatePostState = (updated: Post) => {
    setPost(updated);
    const saved = localStorage.getItem("dradix_posts");
    if (saved) {
      try {
        const postsData: Post[] = JSON.parse(saved);
        const newPosts = postsData.map((p) => (p.id === updated.id ? updated : p));
        localStorage.setItem("dradix_posts", JSON.stringify(newPosts));
      } catch (e) {
        console.error(e);
      }
    } else {
      const newPosts = seedPosts.map((p) => (p.id === updated.id ? updated : p));
      localStorage.setItem("dradix_posts", JSON.stringify(newPosts));
    }
  };

  const handleUpvote = () => {
    const updated = {
      ...post,
      upvoted: !post.upvoted,
      upvotes: post.upvoted ? post.upvotes - 1 : post.upvotes + 1,
    };
    updatePostState(updated);
  };

  const handleBookmark = () => {
    const updated = {
      ...post,
      bookmarked: !post.bookmarked,
    };
    updatePostState(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: "Yatharth K.",
      text: commentText,
      time: "Just now",
    };

    const newComments = [...commentsList, newComment];
    setCommentsList(newComments);
    localStorage.setItem(`dradix_comments_${id}`, JSON.stringify(newComments));

    // Update comments count on post
    const updatedPost = {
      ...post,
      comments: post.comments + 1,
    };
    updatePostState(updatedPost);
    setCommentText("");
  };

  return (
    <div className="max-w-[700px] mx-auto w-full px-4 py-6">
      <div className="bg-[#0f0f0f] rounded-3xl flex flex-col overflow-hidden border border-zinc-800 shadow-2xl text-zinc-200">
        {/* Header with back button */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800">
          <button
            onClick={() => router.push("/explore")}
            className="w-8 h-8 rounded-xl bg-zinc-850 hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4 text-zinc-300" />
          </button>
          <span className="text-[13px] font-bold text-zinc-200">Post by {post.author}</span>
        </div>

        {/* Post content */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0"
              style={{ backgroundColor: avatarColors[post.avatar] || "#374151" }}
            >
              {post.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-[14px] font-bold text-white">{post.author}</p>
                {post.verified && (
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                <span className="text-[11px] text-zinc-500">{post.handle}</span>
                <span className="text-zinc-700 text-[11px]">·</span>
                <span className="text-[11px] text-zinc-500">{post.time}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">{post.role}</p>
            </div>
          </div>

          <p className="text-[14.5px] text-zinc-200 leading-relaxed whitespace-pre-line">{post.content}</p>

          {post.image && (
            <div className="rounded-2xl overflow-hidden bg-zinc-900 h-56 flex items-center justify-center border border-zinc-800">
              <div className="text-center space-y-2">
                <div className="w-16 h-9 mx-auto bg-zinc-800 rounded-md flex items-center justify-center">
                  <span className="text-[8px] font-mono text-green-400">$ ls projects</span>
                </div>
                <p className="text-[10px] text-zinc-600 font-mono">terminal_portfolio.gif</p>
              </div>
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 rounded-full px-2.5 py-0.5">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 py-3 border-y border-zinc-800">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all cursor-pointer ${
                post.upvoted ? "text-amber-400 bg-amber-400/10" : "text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10"
              }`}
            >
              <FaArrowUp className="w-3.5 h-3.5" />
              <span>{post.upvotes}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-zinc-500 hover:text-blue-450 hover:bg-blue-400/10 transition-all cursor-pointer">
              <FaRegComment className="w-3.5 h-3.5" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-zinc-500 hover:text-emerald-450 hover:bg-emerald-400/10 transition-all cursor-pointer">
              <Share2Icon className="w-3.5 h-3.5" />
              <span>{post.shares}</span>
            </button>
            <button
              onClick={handleBookmark}
              className={`ml-auto p-1.5 rounded-xl transition-all cursor-pointer ${
                post.bookmarked ? "text-amber-450 bg-amber-400/10" : "text-zinc-500 hover:text-amber-450"
              }`}
            >
              {post.bookmarked ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Comment input box */}
        <form onSubmit={handleAddComment} className="px-6 pb-4 flex items-center gap-3 border-b border-zinc-800">
          <div className="w-8 h-8 rounded-xl bg-[#0891b2] flex items-center justify-center text-white text-[10px] font-black shrink-0">YK</div>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Post your comment"
            className="flex-1 bg-transparent text-[13px] text-zinc-300 placeholder-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="w-8 h-8 rounded-full bg-emerald-500 disabled:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <FaPaperPlane className="w-3.5 h-3.5 text-black disabled:text-zinc-600" />
          </button>
        </form>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-800 bg-[#0c0c0c]">
          <button
            onClick={() => setDetailTab("comments")}
            className={`flex-1 py-3.5 text-[11px] font-extrabold uppercase tracking-widest transition-colors cursor-pointer text-center ${
              detailTab === "comments" ? "text-amber-400 border-b-2 border-amber-400 bg-zinc-900/10" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setDetailTab("upvotes")}
            className={`flex-1 py-3.5 text-[11px] font-extrabold uppercase tracking-widest transition-colors cursor-pointer text-center ${
              detailTab === "upvotes" ? "text-amber-400 border-b-2 border-amber-400 bg-zinc-900/10" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Upvotes • {post.upvotes}
          </button>
        </div>

        {/* Comments/Upvotes List */}
        <div className="px-6 py-6 min-h-[160px]">
          {detailTab === "comments" ? (
            commentsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-600 gap-2">
                <FaRegComment className="w-6 h-6" />
                <p className="text-[13px] font-bold">No comments yet</p>
                <p className="text-[11px]">Be the first to share your thoughts on this post!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {commentsList.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 text-[10px] font-bold shrink-0">
                      {c.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-zinc-300">{c.author}</span>
                        <span className="text-[10px] text-zinc-600">{c.time}</span>
                      </div>
                      <p className="text-[12px] text-zinc-400 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-600 gap-2">
              <FaArrowUp className="w-6 h-6" />
              <p className="text-[13px] font-bold">Your upvotes and feedback are welcome!</p>
              <p className="text-[11px]">Words have more power than we think. Be kind.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
