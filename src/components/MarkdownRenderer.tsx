"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Pre-process reasoning/thinking tags if any
  const cleanedContent = content
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(think|thought|comment|message|reasoning|system|prompt)[^>]*>/gi, "")
    .trim();

  // Split content into blocks (paragraphs, headers, code blocks, lists)
  const blocks = parseMarkdownBlocks(cleanedContent);

  return (
    <div className={`space-y-2.5 text-xs text-zinc-800 leading-relaxed font-sans ${className}`}>
      {blocks.map((block, index) => (
        <RenderBlock key={index} block={block} />
      ))}
    </div>
  );
}

type BlockType =
  | { type: "code"; language: string; code: string }
  | { type: "heading"; level: number; text: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "quote"; text: string }
  | { type: "paragraph"; text: string };

function parseMarkdownBlocks(text: string): BlockType[] {
  const blocks: BlockType[] = [];
  const lines = text.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith("```")) {
      const match = line.trim().match(/^```(\w*)/);
      const language = match ? match[1] || "text" : "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // Headings
    if (line.trim().startsWith("#")) {
      const match = line.trim().match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: "heading",
          level: match[1].length,
          text: match[2],
        });
        i++;
        continue;
      }
    }

    // Unordered List
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", items, ordered: false });
      continue;
    }

    // Ordered List
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", items, ordered: true });
      continue;
    }

    // Blockquote
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quoteLines.join("\n") });
      continue;
    }

    // Paragraph
    if (line.trim().length > 0) {
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().length > 0 &&
        !lines[i].trim().startsWith("```") &&
        !lines[i].trim().startsWith("#") &&
        !/^\s*[-*+]\s+/.test(lines[i]) &&
        !/^\s*\d+\.\s+/.test(lines[i]) &&
        !lines[i].trim().startsWith(">")
      ) {
        paragraphLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
      continue;
    }

    i++;
  }

  return blocks;
}

function RenderBlock({ block }: { block: BlockType }) {
  if (block.type === "code") {
    return <CodeBlock language={block.language} code={block.code} />;
  }

  if (block.type === "heading") {
    const formatted = formatInlineText(block.text);
    if (block.level === 1) {
      return <h2 className="font-extrabold text-zinc-950 tracking-tight mt-3 mb-1 text-[15px]">{formatted}</h2>;
    }
    if (block.level === 2) {
      return <h3 className="font-bold text-zinc-950 tracking-tight mt-2.5 mb-1 text-[14px]">{formatted}</h3>;
    }
    return <h4 className="font-bold text-zinc-950 tracking-tight mt-2 mb-1 text-[13px]">{formatted}</h4>;
  }

  if (block.type === "list") {
    const ListTag = block.ordered ? "ol" : "ul";
    return (
      <ListTag
        className={`pl-4 space-y-1.5 ${
          block.ordered ? "list-decimal" : "list-disc"
        } text-zinc-800 marker:text-[#015451]`}
      >
        {block.items.map((item, idx) => (
          <li key={idx} className="pl-0.5 leading-snug">
            {formatInlineText(item)}
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="border-l-2 border-[#015451] pl-3 py-1 bg-emerald-50/60 rounded-r-lg italic text-zinc-700 my-1">
        {formatInlineText(block.text)}
      </blockquote>
    );
  }

  return (
    <p className="leading-relaxed text-zinc-800 font-normal">
      {formatInlineText(block.text)}
    </p>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-zinc-200/90 bg-zinc-950 text-zinc-100 my-2.5 shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400 font-mono">
        <span className="uppercase font-semibold tracking-wider text-zinc-400">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto text-zinc-200 scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function formatInlineText(inlineStr: string) {
  const parts = inlineStr.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-bold text-zinc-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-zinc-100 border border-zinc-200/80 text-zinc-900 font-mono text-[10px] font-semibold"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="italic text-zinc-800">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}
