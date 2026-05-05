export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  github?: string;
  live?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  type: string;
  description: string;
}

export interface Profile {
  name: string;
  title: string;
  level: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Skills {
  frontend: string[];
  mobile: string[];
  backend: string[];
  tools: string[];
}

export type Category = keyof Skills;

export interface ContactMethod {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}
