export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  coverImage: string;
  date: string;
  author: string;
  readingTime: number;
  published: boolean;
  content?: string;
}

export interface EducationCase {
  id: string;
  slug: string;
  title: string;
  organization: string;
  participants: number;
  category: string;
  coverImage: string;
  date: string;
  summary: string;
  published: boolean;
  content?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface Testimonial {
  name: string;
  role: string;
  organization: string;
  content: string;
  rating: number;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}
