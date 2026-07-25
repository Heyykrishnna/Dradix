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

const devicon = (path: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`;

const createSkill = (
  name: string,
  level: SkillLevel,
  pct: number,
  color: string,
  iconPath: string,
  relatedProjects: string[] = [],
): Skill => ({
  name,
  level,
  pct,
  color,
  logo: devicon(iconPath),
  relatedProjects,
});

export const MASTER_SKILLS_LIST: Skill[] = [
  createSkill("TypeScript", "Advanced", 90, "#3b82f6", "typescript/typescript-original.svg", ["dradix", "dradix-cli"]),
  createSkill("React", "Advanced", 88, "#61dafb", "react/react-original.svg", ["dradix", "algo-vault"]),
  createSkill("Next.js", "Advanced", 85, "#18181b", "nextjs/nextjs-original.svg", ["dradix"]),
  createSkill("Node.js", "Advanced", 80, "#5fa04e", "nodejs/nodejs-original.svg", ["dradix", "algo-vault"]),
  createSkill("Python", "Intermediate", 72, "#f59e0b", "python/python-original.svg", ["algo-vault"]),
  createSkill("Rust", "Intermediate", 55, "#f43f5e", "rust/rust-original.svg", ["rustify"]),
  createSkill("Go", "Beginner", 40, "#00add8", "go/go-original.svg", ["dradix-cli"]),
  createSkill("Docker", "Intermediate", 65, "#2496ed", "docker/docker-original.svg", ["dradix", "rustify"]),
  createSkill("Tailwind CSS", "Advanced", 95, "#38bdf8", "tailwindcss/tailwindcss-original.svg", ["dradix", "algo-vault"]),
  createSkill("PostgreSQL", "Intermediate", 70, "#336791", "postgresql/postgresql-original.svg", ["algo-vault"]),
  createSkill("JavaScript", "Advanced", 90, "#f7df1e", "javascript/javascript-original.svg", ["dradix"]),
  createSkill("HTML5", "Advanced", 95, "#e34f26", "html5/html5-original.svg", ["dradix"]),
  createSkill("CSS3", "Advanced", 90, "#1572b6", "css3/css3-original.svg", ["dradix"]),
  createSkill("Vue.js", "Intermediate", 60, "#4fc08d", "vuejs/vuejs-original.svg"),
  createSkill("Angular", "Intermediate", 55, "#dd0031", "angular/angular-original.svg"),
  createSkill("Svelte", "Intermediate", 50, "#ff3e00", "svelte/svelte-original.svg"),
  createSkill("Java", "Intermediate", 75, "#007396", "java/java-original.svg"),
  createSkill("C++", "Intermediate", 65, "#00599c", "cplusplus/cplusplus-original.svg", ["algo-vault"]),
  createSkill("C#", "Intermediate", 60, "#239120", "csharp/csharp-original.svg"),
  createSkill("PHP", "Intermediate", 60, "#777bb4", "php/php-original.svg"),
  createSkill("Ruby", "Intermediate", 50, "#cc342d", "ruby/ruby-original.svg"),
  createSkill("Swift", "Beginner", 40, "#f05138", "swift/swift-original.svg"),
  createSkill("Kotlin", "Beginner", 45, "#7f52ff", "kotlin/kotlin-original.svg"),
  createSkill("MySQL", "Intermediate", 80, "#4479a1", "mysql/mysql-original.svg"),
  createSkill("MongoDB", "Intermediate", 75, "#47a248", "mongodb/mongodb-original.svg"),
  createSkill("Redis", "Intermediate", 70, "#dc382d", "redis/redis-original.svg"),
  createSkill("AWS", "Intermediate", 65, "#ff9900", "amazonwebservices/amazonwebservices-original-wordmark.svg"),
  createSkill("Google Cloud", "Intermediate", 60, "#4285f4", "googlecloud/googlecloud-original.svg"),
  createSkill("Azure", "Beginner", 40, "#0078d4", "azure/azure-original.svg"),
  createSkill("Kubernetes", "Intermediate", 55, "#326ce5", "kubernetes/kubernetes-original.svg"),
  createSkill("Git", "Advanced", 90, "#f05032", "git/git-original.svg", ["dradix", "dradix-cli"]),
  createSkill("GraphQL", "Intermediate", 70, "#e10098", "graphql/graphql-plain.svg"),
  createSkill("Linux", "Intermediate", 75, "#fcc624", "linux/linux-original.svg"),
  createSkill("Bash", "Intermediate", 70, "#4eaa25", "bash/bash-original.svg", ["dradix-cli"]),
  createSkill("Webpack", "Intermediate", 60, "#8dd6f9", "webpack/webpack-original.svg"),
  createSkill("Vite", "Advanced", 85, "#646cff", "vite/vite-original.svg"),
  createSkill("Redux", "Intermediate", 75, "#764abc", "redux/redux-original.svg"),
  createSkill("Jest", "Intermediate", 70, "#c21325", "jest/jest-plain.svg"),
  createSkill("Figma", "Intermediate", 65, "#f24e1e", "figma/figma-original.svg"),
  createSkill("Sass", "Intermediate", 75, "#cc6699", "sass/sass-original.svg"),
  createSkill("Firebase", "Intermediate", 70, "#ffca28", "firebase/firebase-original.svg"),
  createSkill("Supabase", "Intermediate", 70, "#3ecf8e", "supabase/supabase-original.svg"),
  createSkill("SQLite", "Intermediate", 65, "#003b57", "sqlite/sqlite-original.svg"),
  createSkill("Prisma", "Intermediate", 75, "#2d3748", "prisma/prisma-original.svg"),
  createSkill("Django", "Intermediate", 60, "#092e20", "django/django-plain.svg"),
  createSkill("Flask", "Beginner", 50, "#000000", "flask/flask-original.svg"),
  createSkill("Spring", "Intermediate", 65, "#6db33f", "spring/spring-original.svg"),
  createSkill("NestJS", "Intermediate", 70, "#ea2845", "nestjs/nestjs-original.svg"),
  createSkill("Elasticsearch", "Beginner", 45, "#005571", "elasticsearch/elasticsearch-original.svg"),
  createSkill("Terraform", "Intermediate", 60, "#7b42bc", "terraform/terraform-original.svg"),
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
