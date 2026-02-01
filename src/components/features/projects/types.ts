// Project types for the Projects section

export type ProjectCategory = 'ai-cv' | 'web-dev' | 'robotics' | 'other';
export type ProjectStatus = 'Production' | 'Prototype' | 'In Progress' | 'Archived';

export interface ProjectThumbnail {
  url: string;
  alt: string;
}

export interface ProjectData {
  id: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  tags: string[];
  techStack: string[];
  status: ProjectStatus;
  isFeatured?: boolean;
  thumbnail?: ProjectThumbnail;
  demoUrl?: string;
  githubUrl?: string;
}

export interface CategoryFilter {
  id: 'all' | ProjectCategory;
  label: string;
  icon: string;
  count: number;
}

export interface PortfolioStats {
  totalProjects: number;
  liveDemos: number;
  avgSkillsPerProject: number;
  categoryBreakdown: {
    id: ProjectCategory;
    label: string;
    count: number;
    percent: number;
  }[];
}
