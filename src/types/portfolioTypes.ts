// Portfolio Data Types
export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  designDescription: string;
  aboutDescription: string;
  contact: {
    instagram: string;
    github: string;
    email: string;
  };
  avatar: string;
}

export interface Skills {
  technical: {
    frontend: string[];
    backend: string[];
    devops: string[];
    tools: string[];
  };
  design: {
    visual: string[];
    uiux: string[];
    motion: string[];
    threed: string[];
  };
}

export interface CodeFile {
  fileName: string;
  language: string;
  code: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'development' | 'design';
  description: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
  longDescription?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  images?: string[] | {
    final?: string[];
    process?: string[];
    mockups?: string[];
  };
  videoDemo?: string;
  features?: string[];
  challenges?: string[];
  client?: string;
  year?: string;
  role?: string;
  tools?: string[];
  colorPalette?: string[];
  typography?: {
    primary: string;
    secondary: string;
    body: string;
  };
  thoughtProcess?: {
    problem: string;
    solution: string;
    approach: string;
    outcome: string;
  };
  achievements?: string[];
}

export interface SimpleProjectCategory {
  name: string;
  title: string;
  description: string;
  tech: string[];
}

export interface SimplePortfolioData {
  projectCategories: SimpleProjectCategory[];
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  skills: Skills;
  projects: {
    development: Project[];
    design: Project[];
  };
  simplePortfolio: SimplePortfolioData;
  codePreview: {
    [projectId: string]: CodeFile[];
  };
}
