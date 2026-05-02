import data from "@/data/team.json";

export type Member = {
  name: string;
  role: string | null;
  github: string;
  blog: string | null;
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  name: string;
  desc: string;
  url: string;
  tags: string[];
  links: ProjectLink[];
};

export type Doc = {
  slug: string;
  title: string;
  desc: string;
  file: string;
};

export type TeamData = {
  team: {
    name: string;
    nameEn: string;
    tagline: string;
    course: string;
  };
  members: Member[];
  projects: Project[];
  docs: Doc[];
};

export const TEAM = data as TeamData;
