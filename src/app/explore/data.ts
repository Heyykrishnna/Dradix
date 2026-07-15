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

export const seedPosts: Post[] = [
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

export const jobsList: Job[] = [
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

export const trendingTopics = [
  { tag: "#nextjs15", category: "Technology", posts: "14.2k posts" },
  { tag: "#rustlang", category: "Programming", posts: "8.4k posts" },
  { tag: "#openai", category: "AI", posts: "32.1k posts" },
  { tag: "#typescript", category: "Development", posts: "22.7k posts" },
  { tag: "#systemdesign", category: "Career", posts: "5.8k posts" },
  { tag: "#opensource", category: "Community", posts: "11.3k posts" },
  { tag: "#webdev", category: "Development", posts: "18.6k posts" },
];
