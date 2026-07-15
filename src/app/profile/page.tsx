"use client";

import React, { useState, useEffect } from "react";
import { 
  FaGithub, 
  FaLinkedin, 
  FaGlobe, 
  FaFileLines, 
  FaEnvelope, 
  FaPhone, 
  FaLocationDot, 
  FaPen, 
  FaPlus, 
  FaTrashCan, 
  FaCheck, 
  FaXmark, 
  FaCamera, 
  FaEllipsis, 
  FaBriefcase, 
  FaBookOpen, 
  FaAward,
  FaArrowUpRightFromSquare,
  FaEye,
  FaChartLine,
  FaWandMagicSparkles,
  FaLock,
  FaLockOpen
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
  Cell
} from "recharts";

// TypeScript Interfaces
interface Skill {
  name: string;
  level: "Advanced" | "Intermediate" | "Beginner";
  pct: number;
  color: string;
}

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
  github: string;
  linkedin: string;
  portfolio: string;
  resumeName: string;
  skills: Skill[];
  techStack: string[];
  experience: Experience[];
  education: Education[];
  views: number;
  messages: number;
  activityRate: number;
  responseTime: string;
}

// Initial Profile Mock Data
const initialProfile: ProfileState = {
  name: "Yatharth K.",
  username: "yatharthk",
  subtitle: "Full-Stack Developer",
  bio: "Building agentic AI tools and exploring next-gen developer platforms.",
  aboutMe: "I am a passionate software engineer focused on building robust developer tools. I love working with React, Next.js, and TypeScript, and have recently been exploring Rust and Go for systems programming. I believe in writing clean, well-tested code and sharing knowledge through open source.",
  email: "yatharth.k@dradix.dev",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop", // Beautiful abstract banner
  github: "https://github.com/yatharthk",
  linkedin: "https://linkedin.com/in/yatharthk",
  portfolio: "https://yatharthk.dev",
  resumeName: "yatharth_resume.pdf",
  skills: [
    { name: "Frontend Development", level: "Advanced", pct: 90, color: "#3b82f6" },
    { name: "Backend Development", level: "Advanced", pct: 85, color: "#00c9a7" },
    { name: "UI/UX & Design", level: "Intermediate", pct: 75, color: "#f59e0b" },
    { name: "System Architecture", level: "Intermediate", pct: 70, color: "#ef4444" }
  ],
  techStack: ["Next.js", "TypeScript", "React", "Node.js", "Rust", "Go", "Python", "Tailwind CSS", "PostgreSQL", "Docker", "Git"],
  experience: [
    {
      company: "Dradix",
      role: "Founding Engineer",
      duration: "Jan 2024 - Present",
      desc: "Leading the development of the AI-powered developer analytics platform using Next.js and TypeScript. Implemented automated profiling engines."
    },
    {
      company: "StarkTech Corp",
      role: "Software Engineer",
      duration: "Jun 2022 - Dec 2023",
      desc: "Built scalable microservices in Go and Python. Improved CI/CD pipeline deployment times by 45% using Docker containerization."
    }
  ],
  education: [
    {
      school: "Indian Institute of Information Technology",
      degree: "B.Tech in Computer Science",
      duration: "2018 - 2022",
      details: "Specialization in Software Engineering. Graduated with 9.1 CGPA. Active lead in Coding Club."
    }
  ],
  views: 95202,
  messages: 324,
  activityRate: 88,
  responseTime: "2 hours"
};

// Activity Charts mock data
const weeklyActivityData = [
  { day: "09. Mo.", commits: 800, problems: 1450 },
  { day: "10. Tue.", commits: 550, problems: 920 },
  { day: "11. Wed.", commits: 600, problems: 1200 },
  { day: "12. Thu.", commits: 450, problems: 880 },
  { day: "13. Fri.", commits: 620, problems: 1280 }
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<ProfileState>(initialProfile);
  const [hasChanges, setHasChanges] = useState(false);

  // Edit fields overlays toggles
  const [showBannerInput, setShowBannerInput] = useState(false);
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [newTechTag, setNewTechTag] = useState("");

  // Sync formState with profile when editing toggles
  useEffect(() => {
    if (isEditing) {
      setFormState({ ...profile });
    }
  }, [isEditing]);

  // Deep comparison to check for unsaved changes
  useEffect(() => {
    if (!isEditing) {
      setHasChanges(false);
      return;
    }
    const changed = JSON.stringify(profile) !== JSON.stringify(formState);
    setHasChanges(changed);
  }, [formState, profile, isEditing]);

  const handleSave = () => {
    setProfile(formState);
    setIsEditing(false);
    setShowBannerInput(false);
    setShowAvatarInput(false);
  };

  const handleCancel = () => {
    setFormState({ ...profile });
    setIsEditing(false);
    setShowBannerInput(false);
    setShowAvatarInput(false);
  };

  // Experience edit helpers
  const handleAddExperience = () => {
    setFormState({
      ...formState,
      experience: [...formState.experience, { company: "", role: "", duration: "", desc: "" }]
    });
  };

  const handleRemoveExperience = (index: number) => {
    const updated = formState.experience.filter((_, i) => i !== index);
    setFormState({ ...formState, experience: updated });
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updated = formState.experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    setFormState({ ...formState, experience: updated });
  };

  // Education edit helpers
  const handleAddEducation = () => {
    setFormState({
      ...formState,
      education: [...formState.education, { school: "", degree: "", duration: "", details: "" }]
    });
  };

  const handleRemoveEducation = (index: number) => {
    const updated = formState.education.filter((_, i) => i !== index);
    setFormState({ ...formState, education: updated });
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updated = formState.education.map((edu, i) => {
      if (i === index) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    setFormState({ ...formState, education: updated });
  };

  // Skills edit helpers
  const handleAddSkill = () => {
    setFormState({
      ...formState,
      skills: [...formState.skills, { name: "", level: "Intermediate", pct: 70, color: "#3b82f6" }]
    });
  };

  const handleRemoveSkill = (index: number) => {
    const updated = formState.skills.filter((_, i) => i !== index);
    setFormState({ ...formState, skills: updated });
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: any) => {
    const updated = formState.skills.map((skill, i) => {
      if (i === index) {
        const nextSkill = { ...skill, [field]: value };
        if (field === "level") {
          // Adjust percent roughly based on level selection
          if (value === "Advanced") nextSkill.pct = 90;
          if (value === "Intermediate") nextSkill.pct = 70;
          if (value === "Beginner") nextSkill.pct = 40;
        }
        return nextSkill;
      }
      return skill;
    });
    setFormState({ ...formState, skills: updated });
  };

  // Tech tags helpers
  const handleRemoveTechTag = (tagToRemove: string) => {
    setFormState({
      ...formState,
      techStack: formState.techStack.filter(t => t !== tagToRemove)
    });
  };

  const handleAddTechTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTechTag.trim() && !formState.techStack.includes(newTechTag.trim())) {
      setFormState({
        ...formState,
        techStack: [...formState.techStack, newTechTag.trim()]
      });
      setNewTechTag("");
    }
  };

  // Radial Graph data calculation for activity rate
  const radialData = [
    { name: "Activity", value: isEditing ? formState.activityRate : profile.activityRate, fill: "#00c9a7" },
    { name: "Remaining", value: 100 - (isEditing ? formState.activityRate : profile.activityRate), fill: "#e5e7eb" }
  ];

  return (
    <div className="relative pb-24 space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Banner & Profile Details Overlay Container */}
      <div className="relative bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm group/banner">
        
        {/* Cover Banner Image */}
        <div className="h-48 md:h-64 w-full relative overflow-hidden bg-zinc-200">
          <img 
            src={isEditing ? formState.coverUrl : profile.coverUrl} 
            alt="Cover Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          
          {/* Cover Edit Overlay */}
          {isEditing && (
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
              <button
                onClick={() => setShowBannerInput(!showBannerInput)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/80 hover:bg-black text-white rounded-xl text-[10px] font-bold transition-all shadow-md backdrop-blur-sm"
              >
                <FaCamera className="w-3.5 h-3.5" />
                <span>Change Cover Image</span>
              </button>
              
              {showBannerInput && (
                <div className="w-64 bg-white rounded-xl p-3 shadow-xl border border-zinc-100 text-left animate-slide-down">
                  <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Cover Image URL</label>
                  <input
                    type="url"
                    value={formState.coverUrl}
                    onChange={(e) => setFormState({ ...formState, coverUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-lg border border-zinc-200 p-2 text-[11px] text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-medium"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Overlay Details */}
        <div className="px-6 md:px-8 pb-8 pt-16 md:pt-20 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
          
          {/* Overlapping Profile Photo */}
          <div className="absolute -top-16 left-6 md:left-8 w-28 h-28 md:w-32 md:h-32 rounded-3xl border-4 border-white bg-white overflow-hidden shadow-md flex items-center justify-center shrink-0 group/avatar">
            <img 
              src={isEditing ? formState.avatarUrl : profile.avatarUrl} 
              alt={isEditing ? formState.name : profile.name}
              className="w-full h-full object-cover rounded-2xl" 
            />
            {/* Status Dot */}
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            
            {/* Avatar Edit Camera Overlay */}
            {isEditing && (
              <button
                onClick={() => setShowAvatarInput(!showAvatarInput)}
                className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
              >
                <FaCamera className="w-5 h-5" />
                <span className="text-[9px] font-bold">Edit Photo</span>
              </button>
            )}
          </div>

          {/* Inline Avatar URL Edit Input Box */}
          {isEditing && showAvatarInput && (
            <div className="absolute top-16 left-6 md:left-8 z-10 w-64 bg-white rounded-xl p-3 shadow-xl border border-zinc-100 text-left animate-slide-down">
              <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5">Avatar Image URL</label>
              <input
                type="url"
                value={formState.avatarUrl}
                onChange={(e) => setFormState({ ...formState, avatarUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-zinc-200 p-2 text-[11px] text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-medium"
              />
            </div>
          )}

          {/* Name & Basic Info Text */}
          <div className="flex-1 md:pl-36 text-left">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[14px] text-zinc-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Username</label>
                    <input
                      type="text"
                      value={formState.username}
                      onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                      className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[14px] text-zinc-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Subtitle / Role</label>
                  <input
                    type="text"
                    value={formState.subtitle}
                    onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-800 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Short Bio Statement</label>
                  <input
                    type="text"
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-black font-heading leading-tight">{profile.name}</h2>
                  <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">@{profile.username}</span>
                </div>
                <p className="text-[13px] font-semibold text-zinc-400 mt-1">{profile.subtitle}</p>
                <p className="text-[13px] text-zinc-600 mt-2 max-w-xl">{profile.bio}</p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button 
              onClick={() => setIsEditing(!isEditing)}
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

      {/* 2. Main Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Public Profile Details & Socials */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Public Profile card */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
            
            {/* Title Row */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">Public Profile</span>
              <button className="text-zinc-400 hover:text-zinc-600">
                <FaEllipsis className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col items-center text-center py-2">
              <div className="relative w-20 h-20 rounded-full border border-orange-200 bg-orange-100 overflow-hidden flex items-center justify-center p-1">
                <img 
                  src={isEditing ? formState.avatarUrl : profile.avatarUrl} 
                  alt={isEditing ? formState.name : profile.name}
                  className="w-full h-full object-cover rounded-full" 
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-orange-100 rounded-full" />
              </div>
              <p className="text-[15px] font-extrabold text-zinc-900 mt-3">{isEditing ? formState.name : profile.name}</p>
              <p className="text-[11px] font-bold text-indigo-600 mt-1 uppercase tracking-wider">{isEditing ? formState.subtitle : profile.subtitle}</p>
            </div>

            {/* Contact Details Fields */}
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-zinc-200 p-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                  />
                ) : (
                  <p className="text-[12px] font-bold text-zinc-700 mt-0.5 break-all">{profile.email}</p>
                )}
              </div>

              <div>
                <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Phone</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-zinc-200 p-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                  />
                ) : (
                  <p className="text-[12px] font-bold text-zinc-700 mt-0.5">{profile.phone}</p>
                )}
              </div>

              <div>
                <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-zinc-200 p-2 text-[12px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 font-bold"
                  />
                ) : (
                  <p className="text-[12px] font-bold text-zinc-700 mt-0.5">{profile.location}</p>
                )}
              </div>
            </div>

            {/* Contacts list */}
            <div className="pt-2">
              <p className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2.5">Contacts</p>
              <div className="flex items-center -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" alt="c1" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop" alt="c2" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=64&auto=format&fit=crop" alt="c3" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=64&auto=format&fit=crop" alt="c4" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                  +75
                </div>
              </div>
            </div>

            {/* Response Time Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Activity</span>
                <span className="text-[9px] font-bold bg-[#00c9a7]/10 text-[#00c9a7] px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold text-zinc-800">2 hours response time</p>
                {isEditing && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-400 font-bold">Gauge:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={formState.activityRate} 
                      onChange={(e) => setFormState({ ...formState, activityRate: Math.max(0, Math.min(100, Number(e.target.value))) })}
                      className="w-12 text-center rounded border border-zinc-200 p-0.5 text-[10px] font-bold text-zinc-700 bg-zinc-50"
                    />
                  </div>
                )}
              </div>
              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00c9a7] rounded-full transition-all duration-500" style={{ width: `${isEditing ? formState.activityRate : profile.activityRate}%` }} />
              </div>
              <div className="flex justify-end">
                <span className="text-[9px] text-zinc-400 font-bold">{isEditing ? formState.activityRate : profile.activityRate}/100%</span>
              </div>
            </div>

            {/* Views and Messages Count Footer */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-left">
              <div>
                <p className="text-[10px] font-bold text-zinc-400">Total Views</p>
                <p className="text-[20px] font-extrabold text-zinc-900 leading-none mt-1.5">{profile.views.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400">Messages</p>
                <p className="text-[20px] font-extrabold text-zinc-900 leading-none mt-1.5">{profile.messages}</p>
              </div>
            </div>

          </div>

          {/* Social Links & Resume Card */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-4">
            <span className="text-[14px] font-bold text-zinc-900 font-heading block pb-2 border-b border-zinc-100">Socials & Assets</span>
            
            <div className="space-y-4">
              
              {/* GitHub */}
              <div className="space-y-1">
                <a 
                  href={isEditing ? formState.github : profile.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
                      <FaGithub className="w-4 h-4" />
                    </div>
                    <span className="text-[12px] font-bold text-zinc-800">GitHub</span>
                  </div>
                  <FaArrowUpRightFromSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </a>
                {isEditing && (
                  <input
                    type="url"
                    value={formState.github}
                    onChange={(e) => setFormState({ ...formState, github: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <a 
                  href={isEditing ? formState.linkedin : profile.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white">
                      <FaLinkedin className="w-4 h-4" />
                    </div>
                    <span className="text-[12px] font-bold text-zinc-800">LinkedIn</span>
                  </div>
                  <FaArrowUpRightFromSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </a>
                {isEditing && (
                  <input
                    type="url"
                    value={formState.linkedin}
                    onChange={(e) => setFormState({ ...formState, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                )}
              </div>

              {/* Portfolio */}
              <div className="space-y-1">
                <a 
                  href={isEditing ? formState.portfolio : profile.portfolio} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                      <FaGlobe className="w-4 h-4" />
                    </div>
                    <span className="text-[12px] font-bold text-zinc-800">Portfolio</span>
                  </div>
                  <FaArrowUpRightFromSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                </a>
                {isEditing && (
                  <input
                    type="url"
                    value={formState.portfolio}
                    onChange={(e) => setFormState({ ...formState, portfolio: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                )}
              </div>

              {/* Resume */}
              <div className="space-y-1">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                      <FaFileLines className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[12px] font-bold text-zinc-800 leading-none">Resume</p>
                      <p className="text-[9px] text-zinc-400 leading-none mt-1">{isEditing ? formState.resumeName : profile.resumeName}</p>
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
                    onChange={(e) => setFormState({ ...formState, resumeName: e.target.value })}
                    placeholder="resume_filename.pdf"
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                )}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: About, Recharts Stats, Skills, Experience, Education */}
        <div className="lg:col-span-2 space-y-8">

          {/* About Me Card */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-4">
            <span className="text-[14px] font-bold text-zinc-900 font-heading block pb-2 border-b border-zinc-100">About Me</span>
            {isEditing ? (
              <textarea 
                rows={5}
                value={formState.aboutMe}
                onChange={(e) => setFormState({ ...formState, aboutMe: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 p-3 text-[13px] text-zinc-650 bg-white focus:outline-none focus:ring-2 focus:ring-black/10 leading-relaxed"
              />
            ) : (
              <p className="text-[13px] leading-relaxed text-zinc-650">{profile.aboutMe}</p>
            )}
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Double Bar Chart */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-zinc-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <span className="text-[14px] font-bold text-zinc-900 font-heading">Activity Stats</span>
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

              {/* Responsive Bar Chart */}
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyActivityData} barGap={4} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                      contentStyle={{ borderRadius: "12px", border: "1px solid #f4f4f5", fontSize: "11px" }}
                    />
                    <Bar dataKey="commits" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={16} />
                    <Bar dataKey="problems" fill="#c026d3" radius={[6, 6, 0, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radial Activity Gauge */}
            <div className="md:col-span-1 bg-white rounded-3xl border border-zinc-100 shadow-sm p-5 flex flex-col justify-between">
              <span className="text-[14px] font-bold text-zinc-900 font-heading block pb-2 border-b border-zinc-100">Profile Gauge</span>
              
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
                        <Cell key="cell-0" fill="#00c9a7" />
                        <Cell key="cell-1" fill="#f3f4f6" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-3">
                  <span className="text-[28px] font-extrabold text-zinc-900 tracking-tight leading-none">
                    {isEditing ? formState.activityRate : profile.activityRate}%
                  </span>
                  <span className="text-[9px] font-bold text-[#00c9a7] uppercase tracking-widest mt-1">Excellent</span>
                </div>
              </div>

              <div className="text-center px-2">
                <p className="text-[11px] font-semibold text-zinc-800 leading-tight">Your developer score is high!</p>
                <p className="text-[9px] text-zinc-400 mt-1 leading-normal">Maintain your active streak to optimize placement readiness.</p>
              </div>
            </div>

          </div>

          {/* Skills & Tech Stack Section */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">Skills & Tech Stack</span>
              {isEditing && (
                <button
                  onClick={handleAddSkill}
                  className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-xl text-[10px] font-bold hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  <FaPlus className="w-2.5 h-2.5" />
                  <span>Add Skill Track</span>
                </button>
              )}
            </div>

            {/* Core Tracked Skills */}
            <div className="space-y-4">
              <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Tracked Proficiency</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(isEditing ? formState.skills : profile.skills).map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 relative text-left">
                    
                    {/* Delete button inline when editing */}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FaTrashCan className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center justify-between mb-2 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {isEditing ? (
                          <input 
                            type="text"
                            value={s.name}
                            onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
                            className="w-28 rounded border border-zinc-200 p-0.5 text-[11px] text-zinc-800 font-bold bg-white"
                          />
                        ) : (
                          <span className="text-[12px] font-bold text-zinc-800">{s.name}</span>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <select
                          value={s.level}
                          onChange={(e) => handleSkillChange(idx, "level", e.target.value)}
                          className="rounded border border-zinc-200 p-0.5 text-[9px] text-zinc-700 font-bold bg-white"
                        >
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                      ) : (
                        <span className="text-[9px] font-bold bg-zinc-100 px-2 py-0.5 rounded-md" style={{ color: s.color }}>
                          {s.level}
                        </span>
                      )}
                    </div>
                    
                    {/* Progress Slider or Progress bar */}
                    <div className="space-y-1.5 pt-1.5">
                      {isEditing ? (
                        <div className="flex items-center h-5">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={s.pct}
                            onChange={(e) => handleSkillChange(idx, "pct", Number(e.target.value))}
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
                              background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${s.pct}%, #e4e4e7 ${s.pct}%, #e4e4e7 100%)`
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-1.5 bg-zinc-200/60 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold mt-1">
                        <span className="text-[9px] text-zinc-400">{isEditing ? "Drag to adjust proficiency" : ""}</span>
                        <span>{s.pct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack tags */}
            <div className="space-y-3 pt-2 text-left">
              <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Technologies</p>
              
              <div className="flex flex-wrap gap-2">
                {(isEditing ? formState.techStack : profile.techStack).map((tech, idx) => (
                  <span 
                    key={idx}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200/40"
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
                ))}
              </div>

              {/* Add Tech Tag input inline */}
              {isEditing && (
                <form onSubmit={handleAddTechTag} className="flex items-center gap-2 mt-3 max-w-xs">
                  <input
                    type="text"
                    value={newTechTag}
                    onChange={(e) => setNewTechTag(e.target.value)}
                    placeholder="Add technology tag..."
                    className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
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

          {/* Work Experience Timeline */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">Work Experience</span>
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
              {(isEditing ? formState.experience : profile.experience).map((exp, idx) => (
                <div key={idx} className="relative pl-8 text-left group">
                  
                  {/* Timeline Dot */}
                  <span className="absolute left-[5px] top-1.5 w-3.5 h-3.5 bg-black border-4 border-white rounded-full group-hover:scale-110 transition-transform shadow-sm" />
                  
                  {isEditing ? (
                    <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200/40 relative">
                      <button
                        onClick={() => handleRemoveExperience(idx)}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FaTrashCan className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-3 pr-6">
                        <div>
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                          />
                        </div>
                      </div>

                      <div className="pr-6">
                        <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Duration (e.g. Jan 2024 - Present)</label>
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(idx, "duration", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                        />
                      </div>

                      <div className="pr-6">
                        <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={exp.desc}
                          onChange={(e) => handleExperienceChange(idx, "desc", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-700 bg-white leading-normal"
                        />
                      </div>

                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">{exp.duration}</span>
                      <h4 className="text-[14px] font-bold text-zinc-900 mt-1">{exp.role} at <span className="text-zinc-600 font-extrabold">{exp.company}</span></h4>
                      <p className="text-[12px] text-zinc-550 mt-2 leading-relaxed">{exp.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <span className="text-[14px] font-bold text-zinc-900 font-heading">Education</span>
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
              {(isEditing ? formState.education : profile.education).map((edu, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-left relative">
                  
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/60 flex items-center justify-center text-zinc-400 shrink-0 self-start">
                    <FaBookOpen className="w-5 h-5 text-zinc-800" />
                  </div>
                  
                  {isEditing ? (
                    <div className="flex-1 space-y-3 pr-6">
                      <button
                        onClick={() => handleRemoveEducation(idx)}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <FaTrashCan className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => handleEducationChange(idx, "school", e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Duration</label>
                        <input
                          type="text"
                          value={edu.duration}
                          onChange={(e) => handleEducationChange(idx, "duration", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Achievements / Details</label>
                        <textarea
                          rows={2}
                          value={edu.details}
                          onChange={(e) => handleEducationChange(idx, "details", e.target.value)}
                          className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-[11px] text-zinc-700 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{edu.duration}</span>
                      <h4 className="text-[13px] font-extrabold text-zinc-900 mt-0.5">{edu.school}</h4>
                      <p className="text-[12px] font-semibold text-indigo-600 mt-0.5">{edu.degree}</p>
                      <p className="text-[11px] text-zinc-500 mt-1.5 leading-relaxed">{edu.details}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Floating Bottom Action Bar for Unsaved Changes */}
      {isEditing && hasChanges && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-slide-up">
          <div className="bg-zinc-950 border border-white/10 text-white rounded-2xl py-3.5 px-5 shadow-2xl flex items-center justify-between gap-6 w-full max-w-xl backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c9a7] animate-pulse" />
              <span className="text-[11px] md:text-[12px] font-bold tracking-tight">You have unsaved changes</span>
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
                className="flex items-center gap-1.5 px-4 py-2 bg-[#00c9a7] hover:bg-[#00b596] text-black rounded-xl text-[11px] font-black transition-all shadow-md cursor-pointer"
              >
                <FaCheck className="w-3 h-3" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
