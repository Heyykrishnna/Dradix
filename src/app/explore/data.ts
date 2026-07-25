// Shared explore data — imported by both the feed and post-detail pages

export interface Post {
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

export interface Job {
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

export const avatarColors: Record<string, string> = {
  PS: "#6366f1",
  KD: "#059669",
  SM: "#7c3aed",
  RV: "#db2777",
  DA: "#f59e0b",
  YK: "#0891b2",
};

const createPost = (
  id: string,
  author: string,
  handle: string,
  avatar: string,
  role: string,
  time: string,
  content: string,
  tags: string[],
  upvotes: number,
  comments: number,
  shares: number,
  opts: { image?: string; upvoted?: boolean; bookmarked?: boolean; verified?: boolean } = {},
): Post => ({
  id,
  author,
  handle,
  avatar,
  role,
  time,
  content,
  tags,
  upvotes,
  comments,
  shares,
  upvoted: opts.upvoted ?? false,
  bookmarked: opts.bookmarked ?? false,
  verified: opts.verified ?? false,
  ...(opts.image ? { image: opts.image } : {}),
});

export const seedPosts: Post[] = [
  createPost(
    "1",
    "Priya Sharma",
    "@priya_codes",
    "PS",
    "Senior Frontend Engineer at Stripe",
    "2m ago",
    "Just shipped a custom Recharts tooltip that follows the mouse cursor! 🎯\n\nThe key is tracking chartX/chartY from the chart onMouseMove event and passing it as the position prop to <Tooltip>. No more default top-left positioning.\n\n#recharts #react #ux",
    ["recharts", "react", "ux"],
    142,
    18,
    34,
    { verified: true },
  ),
  createPost(
    "2",
    "Karan Dev",
    "@karandev",
    "KD",
    "Fullstack Developer · Building in Public",
    "18m ago",
    "Built a terminal-style portfolio using React + Xterm.js. You can actually run commands:\n• ls projects\n• cat resume\n• open dradix\n\nThe future of dev portfolios is interactive. Who else is building this?\n\n#portfolio #terminal #nextjs",
    ["portfolio", "terminal", "nextjs"],
    487,
    63,
    121,
    { image: "terminal_portfolio", upvoted: true, bookmarked: true },
  ),
  createPost(
    "3",
    "Sanya Malhotra",
    "@sanya_ai",
    "SM",
    "ML Engineer · NLP Researcher",
    "45m ago",
    "Hot take: Most AI portfolios don't show real AI work. They're wrapper apps on top of GPT APIs.\n\nGenuine AI work:\n✅ Custom model fine-tuning\n✅ Novel architecture experiments\n✅ Dataset curation pipelines\n✅ Benchmark comparisons\n\n#machinelearning #ai #career",
    ["machinelearning", "ai", "career"],
    1024,
    211,
    342,
    { verified: true },
  ),
  createPost(
    "4",
    "Rohit Verma",
    "@rohitcodes",
    "RV",
    "Backend Engineer · Rust Enthusiast",
    "2h ago",
    "Rewrote our Node.js microservice in Rust today.\n\nCold start: 1.2s → 18ms\nMemory: 180MB → 6MB\n\nSometimes the hype is real. 🦀\n\n#rust #performance #backend",
    ["rust", "performance", "backend"],
    732,
    89,
    204,
  ),
  createPost(
    "5",
    "Dev Arora",
    "@devarora_oss",
    "DA",
    "Open Source Maintainer",
    "4h ago",
    "Just hit 2,000 GitHub stars on my Next.js boilerplate! 🌟\n\nStarted with 0 stars and zero expectations. The community is everything.\n\n#opensource #nextjs #saas",
    ["opensource", "nextjs", "saas"],
    563,
    44,
    87,
  ),
];

const createJob = (
  id: string,
  company: string,
  role: string,
  location: string,
  type: string,
  salary: string,
  stack: string[],
  posted: string,
  logo: string,
  color: string,
  featured = false,
): Job => ({
  id,
  company,
  role,
  location,
  type,
  salary,
  stack,
  posted,
  logo,
  color,
  featured,
});

export const jobsList: Job[] = [
  createJob("j1", "Stripe", "Senior Frontend Engineer", "Remote · San Francisco", "Full-time", "$160k – $220k", ["TypeScript", "React", "GraphQL"], "2h ago", "ST", "#635bff", true),
  createJob("j2", "Vercel", "Next.js Core Developer", "Remote · Global", "Full-time", "$140k – $190k", ["Next.js", "Rust", "Node.js"], "5h ago", "VC", "#18181b", true),
  createJob("j3", "Linear", "Product Engineer", "Remote · EU/US", "Full-time", "$120k – $170k", ["TypeScript", "Electron", "Go"], "1d ago", "LN", "#5E6AD2"),
  createJob("j4", "Figma", "Infrastructure Engineer", "San Francisco, CA", "Full-time", "$170k – $230k", ["Kubernetes", "Go", "Python"], "2d ago", "FG", "#f24e1e"),
  createJob("j5", "Supabase", "Open Source Maintainer", "Remote · Global", "Full-time", "$100k – $140k", ["PostgreSQL", "Rust", "TypeScript"], "3d ago", "SB", "#3ecf8e"),
];

export const trendingTopics = [
  { tag: "#nextjs15", category: "Technology", posts: "14.2k posts" },
  { tag: "#rustlang", category: "Programming", posts: "8.4k posts" },
  { tag: "#openai", category: "AI", posts: "32.1k posts" },
  { tag: "#typescript", category: "Development", posts: "22.7k posts" },
  { tag: "#systemdesign", category: "Career", posts: "5.8k posts" },
  { tag: "#opensource", category: "Community", posts: "11.3k posts" },
  { tag: "#webdev", category: "Development", posts: "18.6k posts" },
];
