"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SkillLevel = "Advanced" | "Intermediate" | "Beginner";

export interface Skill {
  name: string;
  level: SkillLevel;
  pct: number;
  color: string;
  logo: string;
  relatedProjects: string[];
}

export const MASTER_SKILLS_LIST: Skill[] = [
  {
    name: "TypeScript",
    level: "Advanced",
    pct: 90,
    color: "#3b82f6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    relatedProjects: ["dradix", "dradix-cli"],
  },
  {
    name: "React",
    level: "Advanced",
    pct: 88,
    color: "#61dafb",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    relatedProjects: ["dradix", "algo-vault"],
  },
  {
    name: "Next.js",
    level: "Advanced",
    pct: 85,
    color: "#18181b",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
    relatedProjects: ["dradix"],
  },
  {
    name: "Node.js",
    level: "Advanced",
    pct: 80,
    color: "#5fa04e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    relatedProjects: ["dradix", "algo-vault"],
  },
  {
    name: "Python",
    level: "Intermediate",
    pct: 72,
    color: "#f59e0b",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
    relatedProjects: ["algo-vault"],
  },
  {
    name: "Rust",
    level: "Intermediate",
    pct: 55,
    color: "#f43f5e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    relatedProjects: ["rustify"],
  },
  {
    name: "Go",
    level: "Beginner",
    pct: 40,
    color: "#00add8",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
    relatedProjects: ["dradix-cli"],
  },
  {
    name: "Docker",
    level: "Intermediate",
    pct: 65,
    color: "#2496ed",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    relatedProjects: ["dradix", "rustify"],
  },
  {
    name: "Tailwind CSS",
    level: "Advanced",
    pct: 95,
    color: "#38bdf8",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    relatedProjects: ["dradix", "algo-vault"],
  },
  {
    name: "PostgreSQL",
    level: "Intermediate",
    pct: 70,
    color: "#336791",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
    relatedProjects: ["algo-vault"],
  },
  {
    name: "JavaScript",
    level: "Advanced",
    pct: 90,
    color: "#f7df1e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
    relatedProjects: ["dradix"],
  },
  {
    name: "HTML5",
    level: "Advanced",
    pct: 95,
    color: "#e34f26",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    relatedProjects: ["dradix"],
  },
  {
    name: "CSS3",
    level: "Advanced",
    pct: 90,
    color: "#1572b6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
    relatedProjects: ["dradix"],
  },
  {
    name: "Vue.js",
    level: "Intermediate",
    pct: 60,
    color: "#4fc08d",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
    relatedProjects: [],
  },
  {
    name: "Angular",
    level: "Intermediate",
    pct: 55,
    color: "#dd0031",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg",
    relatedProjects: [],
  },
  {
    name: "Svelte",
    level: "Intermediate",
    pct: 50,
    color: "#ff3e00",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg",
    relatedProjects: [],
  },
  {
    name: "Java",
    level: "Intermediate",
    pct: 75,
    color: "#007396",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    relatedProjects: [],
  },
  {
    name: "C++",
    level: "Intermediate",
    pct: 65,
    color: "#00599c",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
    relatedProjects: ["algo-vault"],
  },
  {
    name: "C#",
    level: "Intermediate",
    pct: 60,
    color: "#239120",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    relatedProjects: [],
  },
  {
    name: "PHP",
    level: "Intermediate",
    pct: 60,
    color: "#777bb4",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
    relatedProjects: [],
  },
  {
    name: "Ruby",
    level: "Intermediate",
    pct: 50,
    color: "#cc342d",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
    relatedProjects: [],
  },
  {
    name: "Swift",
    level: "Beginner",
    pct: 40,
    color: "#f05138",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
    relatedProjects: [],
  },
  {
    name: "Kotlin",
    level: "Beginner",
    pct: 45,
    color: "#7f52ff",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg",
    relatedProjects: [],
  },
  {
    name: "MySQL",
    level: "Intermediate",
    pct: 80,
    color: "#4479a1",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
    relatedProjects: [],
  },
  {
    name: "MongoDB",
    level: "Intermediate",
    pct: 75,
    color: "#47a248",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
    relatedProjects: [],
  },
  {
    name: "Redis",
    level: "Intermediate",
    pct: 70,
    color: "#dc382d",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg",
    relatedProjects: [],
  },
  {
    name: "AWS",
    level: "Intermediate",
    pct: 65,
    color: "#ff9900",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    relatedProjects: [],
  },
  {
    name: "Google Cloud",
    level: "Intermediate",
    pct: 60,
    color: "#4285f4",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg",
    relatedProjects: [],
  },
  {
    name: "Azure",
    level: "Beginner",
    pct: 40,
    color: "#0078d4",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg",
    relatedProjects: [],
  },
  {
    name: "Kubernetes",
    level: "Intermediate",
    pct: 55,
    color: "#326ce5",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg",
    relatedProjects: [],
  },
  {
    name: "Git",
    level: "Advanced",
    pct: 90,
    color: "#f05032",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
    relatedProjects: ["dradix", "dradix-cli"],
  },
  {
    name: "GraphQL",
    level: "Intermediate",
    pct: 70,
    color: "#e10098",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg",
    relatedProjects: [],
  },
  {
    name: "Linux",
    level: "Intermediate",
    pct: 75,
    color: "#fcc624",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
    relatedProjects: [],
  },
  {
    name: "Bash",
    level: "Intermediate",
    pct: 70,
    color: "#4eaa25",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg",
    relatedProjects: ["dradix-cli"],
  },
  {
    name: "Webpack",
    level: "Intermediate",
    pct: 60,
    color: "#8dd6f9",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webpack/webpack-original.svg",
    relatedProjects: [],
  },
  {
    name: "Vite",
    level: "Advanced",
    pct: 85,
    color: "#646cff",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vite/vite-original.svg",
    relatedProjects: [],
  },
  {
    name: "Redux",
    level: "Intermediate",
    pct: 75,
    color: "#764abc",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg",
    relatedProjects: [],
  },
  {
    name: "Jest",
    level: "Intermediate",
    pct: 70,
    color: "#c21325",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg",
    relatedProjects: [],
  },
  {
    name: "Figma",
    level: "Intermediate",
    pct: 65,
    color: "#f24e1e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    relatedProjects: [],
  },
  {
    name: "Sass",
    level: "Intermediate",
    pct: 75,
    color: "#cc6699",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg",
    relatedProjects: [],
  },
  {
    name: "Firebase",
    level: "Intermediate",
    pct: 70,
    color: "#ffca28",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    relatedProjects: [],
  },
  {
    name: "Supabase",
    level: "Intermediate",
    pct: 70,
    color: "#3ecf8e",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
    relatedProjects: [],
  },
  {
    name: "SQLite",
    level: "Intermediate",
    pct: 65,
    color: "#003b57",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg",
    relatedProjects: [],
  },
  {
    name: "Prisma",
    level: "Intermediate",
    pct: 75,
    color: "#2d3748",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg",
    relatedProjects: [],
  },
  {
    name: "Django",
    level: "Intermediate",
    pct: 60,
    color: "#092e20",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg",
    relatedProjects: [],
  },
  {
    name: "Flask",
    level: "Beginner",
    pct: 50,
    color: "#000000",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg",
    relatedProjects: [],
  },
  {
    name: "Spring",
    level: "Intermediate",
    pct: 65,
    color: "#6db33f",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
    relatedProjects: [],
  },
  {
    name: "NestJS",
    level: "Intermediate",
    pct: 70,
    color: "#ea2845",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg",
    relatedProjects: [],
  },
  {
    name: "Elasticsearch",
    level: "Beginner",
    pct: 45,
    color: "#005571",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg",
    relatedProjects: [],
  },
  {
    name: "Terraform",
    level: "Intermediate",
    pct: 60,
    color: "#7b42bc",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg",
    relatedProjects: [],
  },
];

interface SkillsContextType {
  userSkills: Skill[];
  addSkill: (skillName: string, level: SkillLevel) => void;
  removeSkill: (skillName: string) => void;
  updateSkillPct: (skillName: string, pct: number) => void;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export function SkillsProvider({ children }: { children: React.ReactNode }) {
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dradix_user_skills");
    const loadSkills = () => {
      if (saved) {
        try {
          setUserSkills(JSON.parse(saved));
        } catch {
          setUserSkills(MASTER_SKILLS_LIST.slice(0, 8)); // default to first 8
        }
      } else {
        setUserSkills(MASTER_SKILLS_LIST.slice(0, 8)); // default starting skills
      }
      setIsLoaded(true);
    };

    const timer = setTimeout(loadSkills, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("dradix_user_skills", JSON.stringify(userSkills));
    }
  }, [userSkills, isLoaded]);

  const addSkill = (skillName: string, level: SkillLevel) => {
    const masterSkill = MASTER_SKILLS_LIST.find((s) => s.name === skillName);
    if (!masterSkill) return;

    // Check if already added
    if (userSkills.some((s) => s.name === skillName)) return;

    setUserSkills((prev) => [...prev, { ...masterSkill, level }]);
  };

  const removeSkill = (skillName: string) => {
    setUserSkills((prev) => prev.filter((s) => s.name !== skillName));
  };

  const updateSkillPct = (skillName: string, pct: number) => {
    setUserSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, pct } : s)),
    );
  };

  return (
    <SkillsContext.Provider
      value={{ userSkills, addSkill, removeSkill, updateSkillPct }}
    >
      {children}
    </SkillsContext.Provider>
  );
}

export function useSkills() {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
}
