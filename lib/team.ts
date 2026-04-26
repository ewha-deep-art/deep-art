import data from "@/data/team.json";

export type Member = {
  name: string;
  role: string | null;
  github: string;
  blog: string | null;
};

export type Project = {
  name: string;
  desc: string;
  url: string;
  tags: string[];
};

export type Presentation = {
  title: string;
  url: string;
  date: string;
};

export type Blog = {
  title: string;
  url: string;
  author: string;
};

export type Doc = {
  slug: string;
  title: string;
  desc: string;
};

export type TeamData = {
  team: {
    name: string;
    nameEn: string;
    tagline: string;
    course: string;
    github: string;
  };
  members: Member[];
  projects: Project[];
  presentations: Presentation[];
  blogs: Blog[];
  docs: Doc[];
};

export const TEAM = data as TeamData;
