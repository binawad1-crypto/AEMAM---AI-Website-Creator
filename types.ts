
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export enum WizardStep {
  LANDING = 0,
  TOPIC = 1,
  GOALS = 2,
  NAME = 3,
  STRUCTURE = 4,
  PALETTE = 5,
  FONTS = 6,
  DASHBOARD = 7
}

export interface SiteConfig {
  topic: string;
  goals: string[];
  name: string;
  structure: string[];
  palette: string; // ID of palette
  fontPair: string; // ID of font pair
  description?: string; // AI Generated
  content?: Record<string, string>; // Key-value store for editable content
}

export interface Palette {
  id: string;
  name: string;
  colors: [string, string, string, string]; // Background, Surface, Text, Accent
}

export interface FontPair {
  id: string;
  name: string;
  heading: string;
  body: string;
}

export const TOPICS = [
  'Photography', 'Design', 'Education', 'Consulting', 'Art', 'Health', 'Marketing', 'Technology', 'Fashion', 'Food'
];

export const GOALS = [
  'Showcase Portfolio', 'Sell Products', 'Publish Blog', 'Offer Services', 'Collect Leads', 'Schedule Appointments'
];

export const PALETTES: Palette[] = [
  // --- Minimal & Clean ---
  { id: 'minimal', name: 'Minimal White', colors: ['#ffffff', '#f4f4f5', '#18181b', '#000000'] },
  { id: 'concrete', name: 'Concrete Gray', colors: ['#f3f4f6', '#e5e7eb', '#111827', '#4b5563'] },
  { id: 'paper', name: 'Warm Paper', colors: ['#fafaf9', '#f5f5f4', '#292524', '#44403c'] },

  // --- Formal & Corporate ---
  { id: 'corporate', name: 'Trust Blue', colors: ['#ffffff', '#f0f9ff', '#0f172a', '#0369a1'] },
  { id: 'executive', name: 'Executive Slate', colors: ['#ffffff', '#f8fafc', '#334155', '#475569'] },
  { id: 'law', name: 'Legal Navy', colors: ['#f8fafc', '#e2e8f0', '#1e293b', '#0f172a'] },
  { id: 'finance', name: 'Finance Green', colors: ['#ffffff', '#f0fdf4', '#052e16', '#15803d'] },

  // --- Dynamic & Vibrant ---
  { id: 'electric', name: 'Electric Violet', colors: ['#09090b', '#18181b', '#ffffff', '#7c3aed'] },
  { id: 'neon', name: 'Cyber Lime', colors: ['#000000', '#111111', '#ffffff', '#bef264'] },
  { id: 'pop', name: 'Pop Pink', colors: ['#fff1f2', '#ffe4e6', '#881337', '#e11d48'] },
  { id: 'sunset', name: 'Sunset Orange', colors: ['#fff7ed', '#ffedd5', '#7c2d12', '#ea580c'] },

  // --- Luxury & Elegant ---
  { id: 'luxury', name: 'Gold & Black', colors: ['#0f0f0f', '#1a1a1a', '#ffffff', '#d4af37'] },
  { id: 'royal', name: 'Royal Purple', colors: ['#faf5ff', '#f3e8ff', '#3b0764', '#7e22ce'] },
  { id: 'champagne', name: 'Champagne', colors: ['#fffbeb', '#fef3c7', '#78350f', '#b45309'] },

  // --- Nature & Earthy ---
  { id: 'forest', name: 'Deep Forest', colors: ['#f2fce2', '#dcfce7', '#14532d', '#166534'] },
  { id: 'ocean', name: 'Deep Ocean', colors: ['#ecfeff', '#cffafe', '#164e63', '#0891b2'] },
  { id: 'earth', name: 'Terracotta', colors: ['#fff7ed', '#ffedd5', '#431407', '#9a3412'] },
  { id: 'sage', name: 'Sage & Olive', colors: ['#f4f7f0', '#e9edc9', '#283618', '#606c38'] },

  // --- Dark Modes ---
  { id: 'midnight', name: 'Midnight Blue', colors: ['#020617', '#0f172a', '#e2e8f0', '#38bdf8'] },
  { id: 'dark', name: 'Classic Dark', colors: ['#18181b', '#27272a', '#fafafa', '#a1a1aa'] },
];

export const FONT_PAIRS: FontPair[] = [
  { id: 'modern', name: 'Modern Clean', heading: 'font-sans', body: 'font-sans' },
  { id: 'classic', name: 'Editorial Serif', heading: 'font-serif', body: 'font-sans' },
  { id: 'tech', name: 'Technical Mono', heading: 'font-mono', body: 'font-sans' },
  { id: 'bold', name: 'Bold Display', heading: 'font-sans font-black', body: 'font-sans' },
];
