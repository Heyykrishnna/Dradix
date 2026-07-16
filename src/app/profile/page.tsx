"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FaPlus,
  FaTrashCan,
  FaCheck,
  FaXmark,
  FaCamera,
  FaBookOpen,
  FaArrowUpRightFromSquare,
  FaLock,
  FaLockOpen,
  FaArrowUp,
  FaArrowDown,
  FaUpload,
  FaLink,
  FaImage,
  FaCircleCheck,
  FaBookmark,
  FaBriefcase,
  FaShield,
  FaUserPlus,
  FaHashtag,
  FaUserMinus,
  FaUserCheck,
} from "react-icons/fa6";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  useSkills,
  MASTER_SKILLS_LIST,
  SkillLevel,
  Skill,
} from "@/context/SkillsContext";

interface Experience {
  company: string;
  role: string;
  duration: string;
  desc: string;
}

interface Education {
  school: string;
  degree: string;
  duration: string;
  details: string;
}

interface CustomSocial {
  id: string;
  name: string;
  url: string;
}

interface ProfileState {
  name: string;
  username: string;
  subtitle: string;
  bio: string;
  aboutMe: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  coverUrl: string;
  coverPositionX: number;
  coverPositionY: number;
  coverZoom: number;
  github: string;
  linkedin: string;
  portfolio: string;
  dribbble?: string;
  behance?: string;
  medium?: string;
  customSocials?: CustomSocial[];
  resumeName: string;
  skills: Skill[];
  techStack: string[];
  experience: Experience[];
  education: Education[];
  views: number;
  messages: number;
  activityRate: number;
  responseTime: string;
  jobStatus: "Open" | "Closed";
  verified: boolean;
  customDomain: string;
  bookmarksCount: number;
  rewardPoints: number;
}

const getSocialLogoUrl = (name: string, url: string) => {
  const lowerName = name.toLowerCase().trim();
  if (lowerName === "github") return "https://cdn.simpleicons.org/github";
  if (lowerName === "linkedin") return "/linkedin.svg";
  if (lowerName === "dribbble") return "https://cdn.simpleicons.org/dribbble";
  if (lowerName === "behance") return "https://cdn.simpleicons.org/behance";
  if (lowerName === "medium") return "https://cdn.simpleicons.org/medium";
  if (lowerName === "portfolio") return "/globe.svg";

  const simpleBrands = [
    "twitter",
    "x",
    "figma",
    "youtube",
    "discord",
    "reddit",
    "substack",
    "instagram",
    "facebook",
    "twitch",
    "tiktok",
    "unsplash",
    "stackoverflow",
    "gitlab",
    "bitbucket",
    "hashnode",
    "devto",
    "producthunt",
    "hackernews",
    "codepen",
  ];
  const matchedBrand = simpleBrands.find(
    (brand) => lowerName.includes(brand) || url.toLowerCase().includes(brand),
  );
  if (matchedBrand) {
    const slug =
      matchedBrand === "twitter"
        ? "x"
        : matchedBrand === "devto"
          ? "devdotto"
          : matchedBrand === "hackernews"
            ? "ycombinator"
            : matchedBrand;
    return `https://cdn.simpleicons.org/${slug}`;
  }

  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  } catch (e) {
    console.error(e);
    return "/globe.svg";
  }
};

const COVER_PRESETS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
];

const initialProfile: Omit<ProfileState, "skills"> = {
  name: "Yatharth K.",
  username: "yatharthk",
  subtitle: "Full-Stack Developer",
  bio: "Building agentic AI tools and exploring next-gen developer platforms.",
  aboutMe:
    "I am a passionate software engineer focused on building robust developer tools. I love working with React, Next.js, and TypeScript, and have recently been exploring Rust and Go for systems programming. I believe in writing clean, well-tested code and sharing knowledge through open source.",
  email: "yatharth.k@dradix.dev",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  avatarUrl: "/assets/images/Avatar.jpg",
  coverUrl: "/assets/images/BANNER-A.png",
  coverPositionX: 50,
  coverPositionY: 50,
  coverZoom: 100,
  github: "https://github.com/yatharthk",
  linkedin: "https://linkedin.com/in/yatharthk",
  portfolio: "https://yatharthk.dev",
  dribbble: "https://dribbble.com/yatharthk",
  behance: "https://behance.net/yatharthk",
  medium: "https://medium.com/@yatharthk",
  customSocials: [{ id: "1", name: "Twitter", url: "https://x.com/yatharthk" }],
  resumeName: "yatharth_resume.pdf",
  techStack: [
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "Rust",
    "Go",
    "Python",
    "Tailwind CSS",
    "PostgreSQL",
    "Docker",
    "Git",
  ],
  experience: [
    {
      company: "Asia Youth International MUN",
      role: "Global Representative",
      duration: "Oct 2025 - Present",
      desc: "Representing IIIT in global model united nations forums, leading delegate panels and coordinating discussions on international relations.",
    },
    {
      company: "Freelance",
      role: "Full-stack Developer",
      duration: "Aug 2025 - Present",
      desc: "Building custom web applications using Next.js, React, Node.js and PostgreSQL. Collaborating with clients globally.",
    },
    {
      company: "Dradix",
      role: "Founding Engineer",
      duration: "Jan 2024 - Present",
      desc: "Leading the development of the AI-powered developer analytics platform using Next.js and TypeScript. Implemented automated profiling engines.",
    },
    {
      company: "StarkTech Corp",
      role: "Software Engineer",
      duration: "Jun 2022 - Dec 2023",
      desc: "Built scalable microservices in Go and Python. Improved CI/CD pipeline deployment times by 45% using Docker containerization.",
    },
  ],
  education: [
    {
      school: "Newton School of Technology",
      degree: "Bachelor of Technology - BTech",
      duration: "2023 - 2027",
      details:
        "Pursuing specialized curriculum in Computer Science and Software Engineering.",
    },
    {
      school: "Rishihood University",
      degree: "Bachelor of Technology - BTech",
      duration: "2023 - 2027",
      details:
        "Joint degree partnership with Newton School of Technology, focusing on Leadership and Tech Innovation.",
    },
    {
      school: "Indian Institute of Information Technology",
      degree: "B.Tech in Computer Science",
      duration: "2018 - 2022",
      details:
        "Specialization in Software Engineering. Graduated with 9.1 CGPA. Active lead in Coding Club.",
    },
  ],
  views: 95202,
  messages: 324,
  activityRate: 88,
  responseTime: "2 hours",
  jobStatus: "Open",
  verified: true,
  customDomain: "",
  bookmarksCount: 3,
  rewardPoints: 250,
};

const weeklyActivityData = [
  { day: "09. Mo.", commits: 800, problems: 1450 },
  { day: "10. Tue.", commits: 550, problems: 920 },
  { day: "11. Wed.", commits: 600, problems: 1200 },
  { day: "12. Thu.", commits: 450, problems: 880 },
  { day: "13. Fri.", commits: 620, problems: 1280 },
];

export default function ProfilePage() {
  const { userSkills, addSkill, removeSkill, updateSkillPct } = useSkills();
  const [profile, setProfile] =
    useState<Omit<ProfileState, "skills">>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] =
    useState<Omit<ProfileState, "skills">>(initialProfile);
  const hasChanges =
    isEditing && JSON.stringify(profile) !== JSON.stringify(formState);
  const [newTechTag, setNewTechTag] = useState("");
  const [activeModal, setActiveModal] = useState<
    | "settings"
    | "bookmarks"
    | "invite"
    | "rewards"
    | "verification"
    | "domain"
    | null
  >(null);

  const [imageModalType, setImageModalType] = useState<
    "cover" | "avatar" | null
  >(null);
  const [modalInputUrl, setModalInputUrl] = useState("");
  const [modalPreview, setModalPreview] = useState("");
  const [modalActiveTab, setModalActiveTab] = useState<
    "upload" | "url" | "presets"
  >("upload");

  const [modalZoom, setModalZoom] = useState(100);
  const [modalPositionX, setModalPositionX] = useState(50);
  const [modalPositionY, setModalPositionY] = useState(50);

  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 50, posY: 50 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageModalType !== "cover") return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: modalPositionX,
      posY: modalPositionY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || imageModalType !== "cover") return;
    const container = previewContainerRef.current;
    if (!container) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const zoomFactor = 100 / modalZoom;
    const nextX =
      dragStartRef.current.posX - (dx / containerWidth) * 100 * zoomFactor;
    const nextY =
      dragStartRef.current.posY - (dy / containerHeight) * 100 * zoomFactor;

    setModalPositionX(Math.max(0, Math.min(100, nextX)));
    setModalPositionY(Math.max(0, Math.min(100, nextY)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (imageModalType !== "cover") return;
    e.preventDefault();
    const zoomStep = 8;
    const nextZoom = e.deltaY < 0 ? modalZoom + zoomStep : modalZoom - zoomStep;
    setModalZoom(Math.max(100, Math.min(300, nextZoom)));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (imageModalType !== "cover" || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      posX: modalPositionX,
      posY: modalPositionY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || imageModalType !== "cover" || e.touches.length !== 1)
      return;
    const container = previewContainerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const zoomFactor = 100 / modalZoom;
    const nextX =
      dragStartRef.current.posX - (dx / containerWidth) * 100 * zoomFactor;
    const nextY =
      dragStartRef.current.posY - (dy / containerHeight) * 100 * zoomFactor;

    setModalPositionX(Math.max(0, Math.min(100, nextX)));
    setModalPositionY(Math.max(0, Math.min(100, nextY)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (imageModalType !== null || activeModal !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [imageModalType, activeModal]);

  const handleSave = () => {
    setProfile(formState);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormState({ ...profile });
    setIsEditing(false);
  };

  const openImageModal = (type: "cover" | "avatar") => {
    setImageModalType(type);
    const currentUrl =
      type === "cover" ? formState.coverUrl : formState.avatarUrl;
    setModalInputUrl(currentUrl.startsWith("data:") ? "" : currentUrl);
    setModalPreview(currentUrl);
    setModalActiveTab(currentUrl.startsWith("data:") ? "upload" : "url");
    if (type === "cover") {
      setModalZoom(formState.coverZoom || 100);
      setModalPositionX(formState.coverPositionX || 50);
      setModalPositionY(formState.coverPositionY || 50);
    }
  };

  const handleImageModalSave = () => {
    if (!modalPreview) return;
    if (imageModalType === "cover") {
      setFormState((prev) => ({
        ...prev,
        coverUrl: modalPreview,
        coverZoom: modalZoom,
        coverPositionX: modalPositionX,
        coverPositionY: modalPositionY,
      }));
    } else {
      setFormState((prev) => ({ ...prev, avatarUrl: modalPreview }));
    }
    setImageModalType(null);
  };

  const handleModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setModalPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModalUrlApply = () => {
    if (modalInputUrl.trim()) {
      setModalPreview(modalInputUrl.trim());
    }
  };

  const handleAddExperience = () => {
    setFormState({
      ...formState,
      experience: [
        { company: "", role: "", duration: "", desc: "" },
        ...formState.experience,
      ],
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = formState.experience.filter((_, i) => i !== index);
    setFormState({ ...formState, experience: updated });
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string,
  ) => {
    const updated = formState.experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setFormState({ ...formState, experience: updated });
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formState.experience.length) return;
    const updated = [...formState.experience];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormState({ ...formState, experience: updated });
  };

  const handleAddEducation = () => {
    setFormState({
      ...formState,
      education: [
        { school: "", degree: "", duration: "", details: "" },
        ...formState.education,
      ],
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = formState.education.filter((_, i) => i !== index);
    setFormState({ ...formState, education: updated });
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const updated = formState.education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setFormState({ ...formState, education: updated });
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formState.education.length) return;
    const updated = [...formState.education];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormState({ ...formState, education: updated });
  };

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("Beginner");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredTechs = MASTER_SKILLS_LIST.filter(
    (ms) =>
      !userSkills.some((us) => us.name === ms.name) &&
      ms.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddSkill = () => {
    if (newSkillName) {
      addSkill(newSkillName, newSkillLevel);
      setNewSkillName("");
      setSearchQuery("");
      setNewSkillLevel("Beginner");
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    removeSkill(skillName);
  };

  const handleSkillChange = (
    skillName: string,
    field: "level" | "pct",
    value: string | number,
  ) => {
    if (field === "level") {
      const level = value as SkillLevel;
      // You can implement change level in context or keep it simple
      // For now, if we change level, we re-add the skill with new level
      removeSkill(skillName);
      addSkill(skillName, level);
    } else if (field === "pct") {
      updateSkillPct(skillName, Number(value));
    }
  };

  const handleRemoveTechTag = (tagToRemove: string) => {
    setFormState({
      ...formState,
      techStack: formState.techStack.filter((t) => t !== tagToRemove),
    });
  };

  const handleAddTechTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTechTag.trim() && !formState.techStack.includes(newTechTag.trim())) {
      setFormState({
        ...formState,
        techStack: [...formState.techStack, newTechTag.trim()],
      });
      setNewTechTag("");
    }
  };

  const radialData = [
    {
      name: "Activity",
      value: isEditing ? formState.activityRate : profile.activityRate,
      fill: "#005c58",
    },
    {
      name: "Remaining",
      value: 100 - (isEditing ? formState.activityRate : profile.activityRate),
      fill: "#e5e7eb",
    },
  ];

  return (
    <div className="relative pb-24 space-y-8 animate-fade-in text-left">
      <div className="relative bg-white rounded-3xl overflow-hidden border border-dashed border-zinc-200 shadow-sm group/banner">
        <div className="h-48 md:h-100 w-full relative overflow-hidden bg-zinc-200">
          <img
            src={isEditing ? formState.coverUrl : profile.coverUrl}
            alt="Cover Banner"
            className="w-full h-full object-cover origin-center transition-all duration-150"
            style={{
              objectPosition: `${isEditing ? formState.coverPositionX : profile.coverPositionX}% ${isEditing ? formState.coverPositionY : profile.coverPositionY}%`,
              transform: `scale(${isEditing ? formState.coverZoom / 100 : profile.coverZoom / 100})`,
            }}
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-b from-transparent via-white/50 to-white backdrop-blur-[2px] pointer-events-none" />

          {isEditing && (
            <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-10 duration-200">
              <button
                onClick={() => openImageModal("cover")}
                className="flex items-center gap-2 px-3 py-2.5 bg-white text-black hover:bg-zinc-50 rounded-xl text-[10px] font-light transition-all shadow-lg cursor-pointer"
              >
                <FaCamera className="w-3 h-3" />
                <span>Update Banner Image</span>
              </button>
            </div>
          )}
        </div>

        <div className="px-6 md:px-8 pb-8 pt-16 md:pt-20 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          <div className="absolute -top-16 left-6 md:left-8 w-28 h-28 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-white overflow-hidden shadow-md flex items-center justify-center shrink-0 group/avatar z-20">
            <img
              src={isEditing ? formState.avatarUrl : profile.avatarUrl}
              alt={isEditing ? formState.name : profile.name}
              className="w-full h-full object-cover rounded-2xl"
            />

            {isEditing && (
              <div className="absolute inset-0 bg-black/55 text-white flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 cursor-pointer">
                <button
                  onClick={() => openImageModal("avatar")}
                  className="flex items-center gap-1.5 bg-white text-black px-2 py-1.5 rounded-xl text-[9px] font-light hover:bg-zinc-50 transition-colors shadow-md cursor-pointer"
                >
                  <FaCamera className="w-2.5 h-2.5" />
                  <span>Update Photo</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 md:pl-36 text-left">
            <div className="group/verified relative flex items-center gap-1.5 mb-2 w-fit">
              <FaCircleCheck className="w-4 h-4 text-[#003c3a] cursor-pointer" />
              <span className="absolute bottom-full left-0 mb-1.5 hidden group-hover/verified:block bg-zinc-950 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 transition-all">
                Verified Developer
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formState.username}
                      onChange={(e) =>
                        setFormState({ ...formState, username: e.target.value })
                      }
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-900 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                    Subtitle / Role
                  </label>
                  <input
                    type="text"
                    value={formState.subtitle}
                    onChange={(e) =>
                      setFormState({ ...formState, subtitle: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-800 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                    Short Bio Statement
                  </label>
                  <input
                    type="text"
                    value={formState.bio}
                    onChange={(e) =>
                      setFormState({ ...formState, bio: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-black font-heading leading-tight">
                    {profile.name}
                  </h2>
                  <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">
                    @{profile.username}
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-zinc-400 mt-1">
                  {profile.subtitle}
                </p>
                <p className="text-[13px] text-zinc-600 mt-2 max-w-xl">
                  {profile.bio}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => {
                if (!isEditing) {
                  setFormState({ ...profile });
                }
                setIsEditing(!isEditing);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all shadow-sm cursor-pointer ${
                isEditing
                  ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200"
                  : "bg-black text-white hover:bg-zinc-800"
              }`}
            >
              {isEditing ? (
                <>
                  <FaLock className="w-3.5 h-3.5" />
                  <span>Lock Info</span>
                </>
              ) : (
                <>
                  <FaLockOpen className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* 1. Sidebar Navigation Menu Card */}
          <div className="bg-[#161616] rounded-3xl border border-zinc-800 shadow-xl p-5 space-y-4 text-white">
            {/* Profile Summary Row */}
            <div className="flex items-center gap-3 p-3 bg-zinc-800/40 rounded-2xl border border-zinc-700/50">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                <img
                  src={isEditing ? formState.avatarUrl : profile.avatarUrl}
                  alt={isEditing ? formState.name : profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left leading-none">
                <p className="text-[13px] font-bold text-white leading-tight">
                  {isEditing ? formState.name : profile.name}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  @{isEditing ? formState.username : profile.username}
                </p>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveModal("bookmarks")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800/60 transition-colors text-left text-[12px] font-bold text-zinc-200 cursor-pointer"
              >
                <FaBookmark className="w-4 h-4 text-zinc-400" />
                <span>Bookmarks</span>
                <span className="ml-auto text-[9px] font-bold text-zinc-400 bg-zinc-800 px-2.5 py-0.5 rounded-full">
                  {isEditing
                    ? formState.bookmarksCount
                    : profile.bookmarksCount}
                </span>
              </button>

              <div className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-800/60 transition-colors text-left text-[12px] font-bold text-zinc-200">
                <div className="flex items-center gap-3">
                  <FaBriefcase className="w-4 h-4 text-zinc-400" />
                  <span>Job Preferences</span>
                </div>
                {isEditing ? (
                  <select
                    value={formState.jobStatus}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        jobStatus: e.target.value as "Open" | "Closed",
                      })
                    }
                    className="text-[9px] font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 focus:outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                ) : (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      profile.jobStatus === "Open"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-zinc-500/15 text-zinc-400"
                    }`}
                  >
                    {profile.jobStatus === "Open" ? "Open" : "Closed"}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveModal("verification")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800/60 transition-colors text-left text-[12px] font-bold text-zinc-200 cursor-pointer"
              >
                <FaShield className="w-4 h-4 text-zinc-400" />
                <span>Verification</span>
                <span className="ml-auto text-[9px] font-bold text-emerald-400 bg-emerald-500/10 rounded-md px-2 py-0.5">
                  Verified
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("invite")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-800/60 transition-colors text-left text-[12px] font-bold text-zinc-200 cursor-pointer"
              >
                <FaUserPlus className="w-4 h-4 text-zinc-400" />
                <span>Invite Friends</span>
                <span className="ml-auto text-[9px] font-bold text-indigo-400 bg-indigo-500/10 rounded px-2 py-0.5">
                  Share
                </span>
              </button>
            </div>
          </div>

          {/* 2. Contact & Info Card */}
          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">
                Contact & Info
              </span>
            </div>

            <div className="space-y-4 text-left">
              <div>
                <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">
                  Email
                </p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full mt-1 rounded-lg border border-zinc-200 p-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                  />
                ) : (
                  <p className="text-[12px] font-bold text-zinc-700 mt-0.5 break-all">
                    {profile.email}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">
                  Phone
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({ ...formState, phone: e.target.value })
                    }
                    className="w-full mt-1 rounded-lg border border-zinc-200 p-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                  />
                ) : (
                  <p className="text-[12px] font-bold text-zinc-700 mt-0.5">
                    {profile.phone}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">
                  Location
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) =>
                      setFormState({ ...formState, location: e.target.value })
                    }
                    className="w-full mt-1 rounded-lg border border-zinc-200 p-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                  />
                ) : (
                  <p className="text-[12px] font-bold text-zinc-700 mt-0.5">
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 text-left">
              <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2.5">
                Contacts
              </p>
              <div className="flex items-center -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop"
                  alt="c1"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop"
                  alt="c2"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=64&auto=format&fit=crop"
                  alt="c3"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&auto=format&fit=crop"
                  alt="c4"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                  +75
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">
                  Activity
                </span>
                <span className="text-[9px] font-bold bg-[#003c3a]/15 text-[#005c58] px-2 py-0.5 rounded uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold text-zinc-800">
                  {profile.responseTime} response time
                </p>
                {isEditing && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-400 font-bold">
                      Gauge:
                    </span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formState.activityRate}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          activityRate: Math.max(
                            0,
                            Math.min(100, Number(e.target.value)),
                          ),
                        })
                      }
                      className="w-12 text-center rounded border border-zinc-200 p-0.5 text-[10px] font-bold text-zinc-700 bg-zinc-50"
                    />
                  </div>
                )}
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#003c3a] rounded-full transition-all duration-500"
                  style={{
                    width: `${isEditing ? formState.activityRate : profile.activityRate}%`,
                  }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-[9px] text-zinc-400 font-bold">
                  {isEditing ? formState.activityRate : profile.activityRate}
                  /100%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-left">
              <div>
                <p className="text-[10px] font-bold text-zinc-400">
                  Total Views
                </p>
                <p className="text-[20px] font-extrabold text-zinc-900 leading-none mt-1.5">
                  {profile.views.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400">Messages</p>
                <p className="text-[20px] font-extrabold text-zinc-900 leading-none mt-1.5">
                  {profile.messages}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Profile Analytics Card */}
          <div className="bg-[#161616] rounded-3xl border border-zinc-800 shadow-xl p-5 space-y-4 text-white text-left">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-white uppercase tracking-wider">
                Profile Analytics
              </span>
              <span className="text-[9px] font-semibold text-zinc-400 bg-zinc-800 rounded px-2 py-0.5">
                last 7 days
              </span>
            </div>

            <div className="flex gap-8 border-b border-zinc-800 pb-3">
              <div>
                <p className="text-[20px] font-extrabold text-white leading-none">
                  2{" "}
                  <span className="text-[11px] font-bold text-emerald-500">
                    ↑ 2
                  </span>
                </p>
                <p className="text-[10px] font-bold text-zinc-400 mt-1.5">
                  Views
                </p>
              </div>
              <div>
                <p className="text-[20px] font-extrabold text-white leading-none">
                  2{" "}
                  <span className="text-[11px] font-bold text-rose-500">
                    ↓ 2
                  </span>
                </p>
                <p className="text-[10px] font-bold text-zinc-400 mt-1.5">
                  Followers
                </p>
              </div>
            </div>

            {/* Line Chart */}
            <div className="h-28 w-full -ml-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { day: "09", views: 0 },
                    { day: "10", views: 0 },
                    { day: "11", views: 0 },
                    { day: "12", views: 0 },
                    { day: "13", views: 2 },
                    { day: "14", views: 0 },
                    { day: "15", views: 0 },
                  ]}
                  margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9, fill: "#71717a", fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ stroke: "#333", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "#1c1c1c",
                      borderColor: "#333",
                      borderRadius: "8px",
                      fontSize: "10px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      r: 2.5,
                      stroke: "#3b82f6",
                      strokeWidth: 1.5,
                      fill: "#161616",
                    }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <a
              href="/dashboard"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-800 hover:bg-zinc-700/80 text-white rounded-xl text-[11px] font-bold transition-all"
            >
              <span>Analytics Dashboard</span>
              <FaArrowUpRightFromSquare className="w-3 h-3 text-zinc-400" />
            </a>
          </div>

          {/* 4. Profile Highlights Card */}
          <div className="relative bg-linear-to-br from-zinc-800 to-zinc-950 text-white rounded-3xl border border-zinc-750 shadow-xl p-5 overflow-hidden text-left">
            {/* Noise overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-700/60">
                <span className="text-sm text-yellow-400">✦</span>
                <span className="text-[13px] font-bold font-heading uppercase tracking-wider">
                  Profile Highlights
                </span>
              </div>

              <ul className="space-y-3.5 text-[11.5px] leading-relaxed text-zinc-300 list-disc pl-4 text-left">
                {(isEditing ? formState : profile).experience[0] && (
                  <li>
                    Currently works at{" "}
                    <strong className="text-white font-extrabold">
                      {(isEditing ? formState : profile).experience[0].company}
                    </strong>{" "}
                    as a {(isEditing ? formState : profile).experience[0].role}{" "}
                    since{" "}
                    {
                      (isEditing
                        ? formState
                        : profile
                      ).experience[0].duration.split(" - ")[0]
                    }
                    .
                  </li>
                )}
                {(isEditing ? formState : profile).experience[1] && (
                  <li>
                    Currently also works at{" "}
                    <strong className="text-white font-extrabold">
                      {(isEditing ? formState : profile).experience[1].company}
                    </strong>{" "}
                    as a {(isEditing ? formState : profile).experience[1].role}{" "}
                    since{" "}
                    {
                      (isEditing
                        ? formState
                        : profile
                      ).experience[1].duration.split(" - ")[0]
                    }
                    .
                  </li>
                )}
                <li>
                  Has made{" "}
                  <strong className="text-[#00c9a7] font-extrabold">
                    2,238 contributions
                  </strong>{" "}
                  on GitHub in the last year.
                </li>
                {(isEditing ? formState : profile).education[0] && (
                  <li>
                    Pursuing{" "}
                    {(isEditing ? formState : profile).education[0].degree} from{" "}
                    <strong className="text-white font-extrabold">
                      {(isEditing ? formState : profile).education[0].school}
                    </strong>
                    .
                  </li>
                )}
                {(isEditing ? formState : profile).education[1] && (
                  <li>
                    Pursuing{" "}
                    {(isEditing ? formState : profile).education[1].degree} from{" "}
                    <strong className="text-white font-extrabold">
                      {(isEditing ? formState : profile).education[1].school}
                    </strong>
                    .
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-6 space-y-4">
            <span className="text-[14px] font-bold text-zinc-900 font-heading block pb-2 border-b border-zinc-100">
              Socials & Assets
            </span>

            <div className="space-y-4">
              {(() => {
                const standardSocialsList = [
                  {
                    key: "github",
                    name: "GitHub",
                    placeholder: "https://github.com/...",
                  },
                  {
                    key: "linkedin",
                    name: "LinkedIn",
                    placeholder: "https://linkedin.com/in/...",
                  },
                  {
                    key: "portfolio",
                    name: "Portfolio",
                    placeholder: "https://yourwebsite.com",
                  },
                  {
                    key: "dribbble",
                    name: "Dribbble",
                    placeholder: "https://dribbble.com/...",
                  },
                  {
                    key: "behance",
                    name: "Behance",
                    placeholder: "https://behance.net/...",
                  },
                  {
                    key: "medium",
                    name: "Medium",
                    placeholder: "https://medium.com/@...",
                  },
                ] as const;

                return (
                  <>
                    {standardSocialsList.map((item) => {
                      const value = isEditing
                        ? formState[item.key]
                        : profile[item.key];
                      if (!isEditing && !value) return null;

                      const logoUrl = getSocialLogoUrl(item.name, value || "");

                      return (
                        <div key={item.key} className="space-y-1 text-left">
                          <a
                            href={value || undefined}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => {
                              if (!value) e.preventDefault();
                            }}
                            className={`flex items-center justify-between p-3 rounded-2xl transition-colors group ${
                              value
                                ? "bg-zinc-50 hover:bg-zinc-100 cursor-pointer"
                                : "bg-zinc-50/50 cursor-default opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-3 font-medium">
                              <div className="w-8 h-8 rounded-xl bg-white border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                <img
                                  src={logoUrl}
                                  alt={item.name}
                                  className="w-5 h-5 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/globe.svg";
                                  }}
                                />
                              </div>
                              <span className="text-[12px] font-bold text-zinc-800">
                                {item.name}
                              </span>
                            </div>
                            {value && (
                              <FaArrowUpRightFromSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                            )}
                          </a>
                          {isEditing && (
                            <input
                              type="url"
                              value={formState[item.key] || ""}
                              onChange={(e) =>
                                setFormState({
                                  ...formState,
                                  [item.key]: e.target.value,
                                })
                              }
                              placeholder={item.placeholder}
                              className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                            />
                          )}
                        </div>
                      );
                    })}
                  </>
                );
              })()}

              {(() => {
                const customs = isEditing
                  ? formState.customSocials || []
                  : profile.customSocials || [];
                return (
                  <>
                    {customs.map((custom, index) => {
                      if (!isEditing && !custom.url) return null;

                      const logoUrl = getSocialLogoUrl(custom.name, custom.url);

                      return (
                        <div key={custom.id} className="space-y-1 text-left">
                          {isEditing ? (
                            <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-150 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-lg bg-white border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                    <img
                                      src={logoUrl}
                                      alt={custom.name || "Custom Link"}
                                      className="w-4 h-4 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src = "/globe.svg";
                                      }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                    Custom Platform
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (
                                      formState.customSocials || []
                                    ).filter((item) => item.id !== custom.id);
                                    setFormState({
                                      ...formState,
                                      customSocials: updated,
                                    });
                                  }}
                                  className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center border border-transparent hover:border-red-100 cursor-pointer"
                                >
                                  <FaTrashCan className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={custom.name}
                                  onChange={(e) => {
                                    const updated = [
                                      ...(formState.customSocials || []),
                                    ];
                                    updated[index] = {
                                      ...updated[index],
                                      name: e.target.value,
                                    };
                                    setFormState({
                                      ...formState,
                                      customSocials: updated,
                                    });
                                  }}
                                  placeholder="Platform name (e.g. YouTube)"
                                  className="w-1/3 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                                />
                                <input
                                  type="url"
                                  value={custom.url}
                                  onChange={(e) => {
                                    const updated = [
                                      ...(formState.customSocials || []),
                                    ];
                                    updated[index] = {
                                      ...updated[index],
                                      url: e.target.value,
                                    };
                                    setFormState({
                                      ...formState,
                                      customSocials: updated,
                                    });
                                  }}
                                  placeholder="https://..."
                                  className="flex-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                                />
                              </div>
                            </div>
                          ) : (
                            <a
                              href={custom.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                  <img
                                    src={logoUrl}
                                    alt={custom.name}
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = "/globe.svg";
                                    }}
                                  />
                                </div>
                                <span className="text-[12px] font-bold text-zinc-800">
                                  {custom.name || "Web Link"}
                                </span>
                              </div>
                              <FaArrowUpRightFromSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                            </a>
                          )}
                        </div>
                      );
                    })}

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          const newCustom: CustomSocial = {
                            id: Date.now().toString(),
                            name: "",
                            url: "",
                          };
                          setFormState({
                            ...formState,
                            customSocials: [
                              ...(formState.customSocials || []),
                              newCustom,
                            ],
                          });
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-dashed border-zinc-200 text-zinc-650 hover:text-zinc-800 text-[11px] font-bold transition-all cursor-pointer mt-2"
                      >
                        <FaPlus className="w-3 h-3" />
                        <span>Add Custom Social Link</span>
                      </button>
                    )}
                  </>
                );
              })()}

              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      <img
                        src="/file.svg"
                        alt="Resume"
                        className="w-5 h-5 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/globe.svg";
                        }}
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-[12px] font-bold text-zinc-800 leading-none">
                        Resume
                      </p>
                      <p className="text-[9px] text-zinc-400 leading-none mt-1">
                        {isEditing ? formState.resumeName : profile.resumeName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading ${profile.resumeName}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors text-[10px] font-bold cursor-pointer"
                  >
                    Download
                  </button>
                </div>
                {isEditing && (
                  <input
                    type="text"
                    value={formState.resumeName}
                    onChange={(e) =>
                      setFormState({ ...formState, resumeName: e.target.value })
                    }
                    placeholder="resume_filename.pdf"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-6 space-y-4">
            <span className="text-[14px] font-bold text-zinc-900 font-heading block pb-2 border-b border-zinc-100">
              About Me
            </span>
            {isEditing ? (
              <textarea
                rows={5}
                value={formState.aboutMe}
                onChange={(e) =>
                  setFormState({ ...formState, aboutMe: e.target.value })
                }
                className="w-full rounded-xl border border-zinc-200 p-3 text-[13px] text-zinc-650 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 leading-relaxed"
              />
            ) : (
              <p className="text-[13px] leading-relaxed text-zinc-650">
                {profile.aboutMe}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <span className="text-[14px] font-bold text-zinc-900 font-heading">
                    Activity Stats
                  </span>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]" />
                      <span>Commits</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#c026d3]" />
                      <span>PRs & Issues</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-zinc-600 bg-zinc-100 rounded-lg px-2.5 py-1.5">
                  This Week
                </span>
              </div>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyActivityData}
                    barGap={4}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#a1a1aa" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 10, fontWeight: 600, fill: "#a1a1aa" }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f4f4f5" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f4f4f5",
                        fontSize: "11px",
                      }}
                    />
                    <Bar
                      dataKey="commits"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={16}
                    />
                    <Bar
                      dataKey="problems"
                      fill="#c026d3"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="md:col-span-1 bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-5 flex flex-col justify-between">
              <span className="text-[14px] font-bold text-zinc-900 font-heading block pb-2 border-b border-zinc-100">
                Profile Gauge
              </span>

              <div className="relative flex items-center justify-center py-4">
                <div className="w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={radialData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={62}
                        startAngle={225}
                        endAngle={-45}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        <Cell key="cell-0" fill="#005c58" />
                        <Cell key="cell-1" fill="#f3f4f6" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
                  <span className="text-[28px] font-extrabold text-zinc-900 tracking-tight leading-none">
                    {isEditing ? formState.activityRate : profile.activityRate}%
                  </span>
                  <span className="text-[9px] font-bold text-[#005c58] uppercase tracking-widest mt-1">
                    Excellent
                  </span>
                </div>
              </div>

              <div className="text-center px-2">
                <p className="text-[11px] font-semibold text-zinc-800 leading-tight">
                  Your developer score is high!
                </p>
                <p className="text-[9px] text-zinc-400 mt-1 leading-normal">
                  Maintain your active streak to optimize placement readiness.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">
                Skills & Tech Stack
              </span>
              {isEditing && (
                <div className="flex items-center gap-2 relative">
                  {/* Search select container */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search tech..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                      className="border border-zinc-200 rounded p-1 text-[11px] w-36 bg-white text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    {isOpen && (
                      <div className="absolute top-full left-0 z-50 mt-1 w-48 max-h-48 overflow-y-auto bg-white border border-zinc-200 rounded-lg shadow-lg text-[11px] scrollbar-thin">
                        {filteredTechs.length > 0 ? (
                          filteredTechs.map((s) => (
                            <button
                              key={s.name}
                              type="button"
                              onClick={() => {
                                setNewSkillName(s.name);
                                setSearchQuery(s.name);
                                setIsOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-zinc-100 transition-colors flex items-center gap-2 text-zinc-700 cursor-pointer"
                            >
                              <img
                                src={s.logo}
                                className="w-4 h-4 object-contain shrink-0"
                                alt=""
                              />
                              <span>{s.name}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-1.5 text-zinc-400 italic">
                            No matches
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <select
                    value={newSkillLevel}
                    onChange={(e) =>
                      setNewSkillLevel(e.target.value as SkillLevel)
                    }
                    className="border border-zinc-200 rounded p-1 text-[11px] bg-white text-zinc-800"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkillName}
                    className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-xl text-[10px] font-bold hover:bg-zinc-800 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                  >
                    <FaPlus className="w-2.5 h-2.5" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                Tracked Proficiency
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userSkills.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 relative text-left"
                  >
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(s.name)}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FaTrashCan className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center justify-between mb-2 pr-6">
                      <div className="flex items-center gap-2">
                        {s.logo ? (
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${s.color}15` }}
                          >
                            <Image
                              src={s.logo}
                              alt={s.name}
                              width={14}
                              height={14}
                              className="w-3.5 h-3.5 object-contain"
                            />
                          </div>
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                        )}
                        <span className="text-[12px] font-bold text-zinc-800">
                          {s.name}
                        </span>
                      </div>

                      {isEditing ? (
                        <select
                          value={s.level}
                          onChange={(e) =>
                            handleSkillChange(s.name, "level", e.target.value)
                          }
                          className="rounded border border-zinc-200 p-0.5 text-[9px] text-zinc-700 font-bold bg-white"
                        >
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                      ) : (
                        <span
                          className="text-[9px] font-bold bg-zinc-100 px-2 py-0.5 rounded-md"
                          style={{ color: s.color }}
                        >
                          {s.level}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-1.5">
                      {isEditing ? (
                        <div className="flex items-center h-5">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={s.pct}
                            onChange={(e) =>
                              handleSkillChange(
                                s.name,
                                "pct",
                                Number(e.target.value),
                              )
                            }
                            className="w-full appearance-none h-1.5 rounded-full cursor-pointer focus:outline-none 
                                       [&::-webkit-slider-thumb]:appearance-none 
                                       [&::-webkit-slider-thumb]:w-5 
                                       [&::-webkit-slider-thumb]:h-5 
                                       [&::-webkit-slider-thumb]:rounded-full 
                                       [&::-webkit-slider-thumb]:bg-black 
                                       [&::-webkit-slider-thumb]:shadow-sm
                                       [&::-moz-range-thumb]:appearance-none 
                                       [&::-moz-range-thumb]:w-5 
                                       [&::-moz-range-thumb]:h-5 
                                       [&::-moz-range-thumb]:rounded-full 
                                       [&::-moz-range-thumb]:bg-black 
                                       [&::-moz-range-thumb]:border-0 
                                       [&::-moz-range-thumb]:shadow-sm"
                            style={{
                              background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${s.pct}%, #e4e4e7 ${s.pct}%, #e4e4e7 100%)`,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-1.5 bg-zinc-200/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${s.pct}%`,
                              backgroundColor: s.color,
                            }}
                          />
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold mt-1">
                        <span className="text-[9px] text-zinc-400">
                          {isEditing ? "Drag to adjust proficiency" : ""}
                        </span>
                        <span>{s.pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 text-left">
              <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                Technologies
              </p>

              <div className="flex flex-wrap gap-2">
                {(isEditing ? formState.techStack : profile.techStack).map(
                  (tech, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-xl border border-dashed border-zinc-200"
                    >
                      <span>{tech}</span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTechTag(tech)}
                          className="text-zinc-400 hover:text-red-500 text-[10px] font-bold cursor-pointer"
                        >
                          <FaXmark className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </span>
                  ),
                )}
              </div>

              {isEditing && (
                <form
                  onSubmit={handleAddTechTag}
                  className="flex items-center gap-2 mt-3 max-w-xs"
                >
                  <input
                    type="text"
                    value={newTechTag}
                    onChange={(e) => setNewTechTag(e.target.value)}
                    placeholder="Add technology tag..."
                    className="w-full rounded-lg border border-dashed border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-black text-white hover:bg-zinc-800 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">
                Work Experience
              </span>
              {isEditing && (
                <button
                  onClick={handleAddExperience}
                  className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-xl text-[10px] font-bold hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <FaPlus className="w-2.5 h-2.5" />
                  <span>Add Experience</span>
                </button>
              )}
            </div>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
              {(isEditing ? formState.experience : profile.experience).map(
                (exp, idx) => (
                  <div key={idx} className="relative pl-8 text-left group/item">
                    <span className="absolute left-[5px] top-1.5 w-3.5 h-3.5 bg-black border-4 border-white rounded-full group-hover/item:scale-110 transition-transform shadow-sm" />

                    {isEditing ? (
                      <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 relative">
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => moveExperience(idx, "up")}
                            disabled={idx === 0}
                            className={`p-1.5 rounded-lg border border-zinc-200 bg-white transition-colors cursor-pointer ${
                              idx === 0
                                ? "opacity-30 cursor-not-allowed"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                            title="Move Up"
                          >
                            <FaArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExperience(idx, "down")}
                            disabled={idx === formState.experience.length - 1}
                            className={`p-1.5 rounded-lg border border-zinc-200 bg-white transition-colors cursor-pointer ${
                              idx === formState.experience.length - 1
                                ? "opacity-30 cursor-not-allowed"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                            title="Move Down"
                          >
                            <FaArrowDown className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(idx)}
                            className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FaTrashCan className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pr-24">
                          <div>
                            <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                handleExperienceChange(
                                  idx,
                                  "company",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                              Role
                            </label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) =>
                                handleExperienceChange(
                                  idx,
                                  "role",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                            />
                          </div>
                        </div>

                        <div className="pr-24">
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                            Duration (e.g. Jan 2024 - Present)
                          </label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) =>
                              handleExperienceChange(
                                idx,
                                "duration",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                          />
                        </div>

                        <div className="pr-6">
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={exp.desc}
                            onChange={(e) =>
                              handleExperienceChange(
                                idx,
                                "desc",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-700 bg-white leading-normal"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                          {exp.duration}
                        </span>
                        <h4 className="text-[14px] font-bold text-zinc-900 mt-1">
                          {exp.role} at{" "}
                          <span className="text-zinc-600 font-extrabold">
                            {exp.company}
                          </span>
                        </h4>
                        <p className="text-[12px] text-zinc-550 mt-2 leading-relaxed">
                          {exp.desc}
                        </p>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">
                Education
              </span>
              {isEditing && (
                <button
                  onClick={handleAddEducation}
                  className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-xl text-[10px] font-bold hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <FaPlus className="w-2.5 h-2.5" />
                  <span>Add Education</span>
                </button>
              )}
            </div>

            <div className="space-y-5">
              {(isEditing ? formState.education : profile.education).map(
                (edu, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-left relative"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0 self-start">
                      <FaBookOpen className="w-5 h-5 text-zinc-800" />
                    </div>

                    {isEditing ? (
                      <div className="flex-1 space-y-3 pr-24">
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => moveEducation(idx, "up")}
                            disabled={idx === 0}
                            className={`p-1.5 rounded-lg border border-zinc-200 bg-white transition-colors cursor-pointer ${
                              idx === 0
                                ? "opacity-30 cursor-not-allowed"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                            title="Move Up"
                          >
                            <FaArrowUp className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveEducation(idx, "down")}
                            disabled={idx === formState.education.length - 1}
                            className={`p-1.5 rounded-lg border border-zinc-200 bg-white transition-colors cursor-pointer ${
                              idx === formState.education.length - 1
                                ? "opacity-30 cursor-not-allowed"
                                : "text-zinc-600 hover:bg-zinc-100"
                            }`}
                            title="Move Down"
                          >
                            <FaArrowDown className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <FaTrashCan className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                              School / Institution
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) =>
                                handleEducationChange(
                                  idx,
                                  "school",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(
                                  idx,
                                  "degree",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={edu.duration}
                            onChange={(e) =>
                              handleEducationChange(
                                idx,
                                "duration",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                            Achievements / Details
                          </label>
                          <textarea
                            rows={2}
                            value={edu.details}
                            onChange={(e) =>
                              handleEducationChange(
                                idx,
                                "details",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-700 bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                          {edu.duration}
                        </span>
                        <h4 className="text-[13px] font-extrabold text-zinc-900 mt-0.5">
                          {edu.school}
                        </h4>
                        <p className="text-[12px] font-semibold text-indigo-600 mt-0.5">
                          {edu.degree}
                        </p>
                        <p className="text-[11px] text-zinc-550 mt-1.5 leading-relaxed">
                          {edu.details}
                        </p>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing && hasChanges && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
          <div className="bg-zinc-950 border border-white/10 text-white rounded-2xl py-3.5 px-5 shadow-2xl flex items-center justify-between gap-6 w-full max-w-xl backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-2">
              <span className="text-[11px] md:text-[12px] font-bold tracking-tight">
                You have unsaved changes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3.5 py-2 rounded-xl text-[11px] font-bold text-zinc-400 hover:text-white transition-colors hover:bg-white/5 cursor-pointer"
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#003c3a] hover:bg-[#002d2b] text-white rounded-xl text-[11px] font-black transition-all shadow-md cursor-pointer"
              >
                <FaCheck className="w-3 h-3" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {imageModalType !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-in text-left">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center text-zinc-800">
                  <FaCamera className="w-4 h-4" />
                </div>
                <h3 className="text-[16px] font-extrabold text-zinc-900 font-heading">
                  {imageModalType === "cover"
                    ? "Update Cover Banner"
                    : "Update Profile Photo"}
                </h3>
              </div>
              <button
                onClick={() => setImageModalType(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer"
              >
                <FaXmark className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="flex bg-zinc-50 border border-dashed border-zinc-200 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setModalActiveTab("upload")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    modalActiveTab === "upload"
                      ? "bg-black text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <FaUpload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  onClick={() => setModalActiveTab("url")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    modalActiveTab === "url"
                      ? "bg-black text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <FaLink className="w-3.5 h-3.5" />
                  <span>Image URL</span>
                </button>
                <button
                  onClick={() => setModalActiveTab("presets")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                    modalActiveTab === "presets"
                      ? "bg-black text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <FaImage className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
              {modalActiveTab === "upload" && (
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    onChange={handleModalFileUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50 hover:border-zinc-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-white border border-dashed border-zinc-200 flex items-center justify-center text-zinc-500 shadow-sm">
                      <FaUpload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-zinc-800">
                        Select Image File
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Supports PNG, JPG, GIF or WEBP up to 5MB
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {modalActiveTab === "url" && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
                    Image Destination URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={modalInputUrl}
                      onChange={(e) => setModalInputUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 rounded-xl border border-dashed border-zinc-200 px-3 py-2 text-[12px] text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-medium"
                    />
                    <button
                      onClick={handleModalUrlApply}
                      className="px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded-xl text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {modalActiveTab === "presets" && (
                <div className="space-y-3">
                  <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">
                    Choose Template
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {(imageModalType === "cover"
                      ? COVER_PRESETS
                      : AVATAR_PRESETS
                    ).map((presetUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setModalPreview(presetUrl)}
                        className={`aspect-video md:aspect-square rounded-xl overflow-hidden border-2 transition-all relative cursor-pointer ${
                          modalPreview === presetUrl
                            ? "border-black scale-95 shadow-md"
                            : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={presetUrl}
                          alt={`Preset ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {modalPreview === presetUrl && (
                          <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white flex items-center justify-center rounded-full text-[9px]">
                            <FaCheck className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {modalPreview && (
                <div className="pt-4 border-t border-zinc-100 flex flex-col items-center">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-3 self-start">
                    Live Preview & Reposition
                  </span>

                  {imageModalType === "cover" ? (
                    <div
                      ref={previewContainerRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onWheel={handleWheel}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      className={`w-full h-36 rounded-xl overflow-hidden bg-zinc-100 border border-dashed border-zinc-200 relative group/preview select-none transition-shadow ${
                        isDragging
                          ? "cursor-grabbing shadow-inner"
                          : "cursor-grab"
                      }`}
                    >
                      <img
                        src={modalPreview}
                        alt="Cover Preview"
                        className="w-full h-full object-cover origin-center pointer-events-none select-none"
                        style={{
                          objectPosition: `${modalPositionX}% ${modalPositionY}%`,
                          transform: `scale(${modalZoom / 100})`,
                        }}
                      />

                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-b border-dashed border-white/50" />
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-b border-dashed border-white/50" />
                        <div className="border-r border-dashed border-white/50" />
                        <div className="border-r border-dashed border-white/50" />
                        <div className="border-transparent" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 border border-dashed border-zinc-200">
                      <img
                        src={modalPreview}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {imageModalType === "cover" && (
                    <div className="mt-3 text-center">
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                        Scroll wheel to zoom • Click & Drag image to position
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setImageModalType(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold text-zinc-500 hover:text-zinc-800 transition-colors bg-transparent border border-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImageModalSave}
                disabled={!modalPreview}
                className="flex items-center gap-1.5 px-5 py-2 bg-black text-white hover:bg-zinc-800 rounded-xl text-[12px] font-bold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FaCheck className="w-3.5 h-3.5" />
                <span>Apply Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Modals Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-[#161616] border border-zinc-800 text-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative space-y-4 text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-[14px] font-extrabold uppercase tracking-wider">
                {activeModal === "bookmarks" && "My Bookmarks"}
                {activeModal === "invite" && "Invite Friends & Earn"}
                {activeModal === "rewards" && "Rewards & Achievements"}
                {activeModal === "verification" && "Verification Status"}
                {activeModal === "domain" && "Custom Domain Setup"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700/85 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaXmark className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-2 text-[12.5px] leading-relaxed text-zinc-300">
              {activeModal === "bookmarks" && (
                <div className="space-y-3">
                  <p className="text-zinc-400">
                    You have bookmarked these tech platforms and resources:
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        name: "Next.js 15 Documentation",
                        url: "https://nextjs.org",
                        desc: "For reference on new App Router features",
                      },
                      {
                        name: "Simple Icons CDN",
                        url: "https://simpleicons.org",
                        desc: "Source of clean SVG brand logos",
                      },
                      {
                        name: "Agentic AI Developer Roadmap",
                        url: "https://dradix.dev",
                        desc: "Syllabus on building autonomous AI assistants",
                      },
                    ].map((b, i) => (
                      <a
                        key={i}
                        href={b.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
                      >
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {b.name}{" "}
                          <FaArrowUpRightFromSquare className="w-3 h-3 text-zinc-500" />
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1">
                          {b.desc}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === "invite" && (
                <div className="space-y-4">
                  <p className="text-zinc-400">
                    Share your referral link with developer friends. You both
                    unlock premium analytics features and get 100 XP rewards!
                  </p>
                  <div className="flex gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800">
                    <input
                      type="text"
                      readOnly
                      value={`https://dradix.dev/ref/${profile.username}`}
                      className="bg-transparent border-none text-[11px] text-zinc-300 flex-1 px-1 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `https://dradix.dev/ref/${profile.username}`,
                        );
                        alert("Referral link copied to clipboard!");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#00c9a7] text-black font-bold text-[10px] hover:bg-[#00b89a] transition-colors cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/65">
                    <span>Total Invites: 0</span>
                    <span>Pending Rewards: 0 XP</span>
                  </div>
                </div>
              )}

              {activeModal === "rewards" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
                    <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                      Your Balance
                    </p>
                    <p className="text-3xl font-black text-white mt-1">
                      {profile.rewardPoints} XP
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1.5">
                      Bronze Tier Developer
                    </p>
                  </div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest pt-2">
                    Unlocked Achievements
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        name: "Git Sync Master",
                        xp: "+100 XP",
                        desc: "Synced your GitHub profile details successfully.",
                      },
                      {
                        name: "Resume Analytics Pro",
                        xp: "+150 XP",
                        desc: "Analyzed your resume readiness for recruiters.",
                      },
                    ].map((badge, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-left"
                      >
                        <div>
                          <p className="font-bold text-white">{badge.name}</p>
                          <p className="text-[9px] text-zinc-500 mt-0.5">
                            {badge.desc}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md shrink-0">
                          {badge.xp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === "verification" && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
                    <FaCircleCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[16px] font-black text-white">
                      Profile Verified
                    </p>
                    <p className="text-[12px] text-zinc-400 max-w-xs mx-auto">
                      This developer profile has been fully authenticated with
                      verified GitHub and LinkedIn credentials.
                    </p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] text-zinc-500 flex justify-between">
                    <span>Verified: Oct 2025</span>
                    <span className="text-emerald-400 font-bold">
                      100% Genuine
                    </span>
                  </div>
                </div>
              )}

              {activeModal === "domain" && (
                <div className="space-y-3">
                  <p className="text-zinc-400">
                    Connect your custom domain (e.g.,{" "}
                    <code className="text-white">yourname.com</code>) to point
                    directly to your Dradix profile.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                      <p className="font-bold text-white text-[11px]">
                        1. Add a CNAME Record
                      </p>
                      <div className="flex justify-between text-[10px] text-zinc-400 bg-zinc-950 p-2 rounded">
                        <span>
                          Host: <code className="text-white">@</code>
                        </span>
                        <span>
                          Value:{" "}
                          <code className="text-[#00c9a7]">
                            profile.dradix.dev
                          </code>
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-2">
                      <p className="font-bold text-white text-[11px]">
                        2. Add an A Record
                      </p>
                      <div className="flex justify-between text-[10px] text-zinc-400 bg-zinc-950 p-2 rounded">
                        <span>
                          Host: <code className="text-white">@</code>
                        </span>
                        <span>
                          Value:{" "}
                          <code className="text-[#00c9a7]">76.76.21.21</code>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-dashed border-zinc-800 text-[10px] text-zinc-500 leading-normal">
                    DNS propagation can take up to 24 hours. Verify connection
                    using the custom domain text input in Settings edit mode.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
