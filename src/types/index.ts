export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  url?: string;
  description?: string;
  notes?: string;
  salary_range?: string;
  location?: string;
  remote: boolean;
  applied_at?: string;
  follow_up_at?: string;
  contact_name?: string;
  contact_email?: string;
  cover_letter?: string;
  ai_parsed?: ParsedJob | null;
  created_at: string;
  updated_at: string;
}

export interface ParsedJob {
  summary: string;
  requirements: string[];
  nice_to_have: string[];
  salary_range?: string;
  location?: string;
  remote?: boolean;
  company_info?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  resume_text?: string;
  plan: 'free' | 'pro';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
}

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  wishlist: { label: 'Wishlist', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', dot: 'bg-indigo-400' },
  applied: { label: 'Applied', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  phone_screen: { label: 'Phone Screen', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', dot: 'bg-cyan-400' },
  interview: { label: 'Interview', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', dot: 'bg-violet-400' },
  offer: { label: 'Offer', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-400' },
  rejected: { label: 'Rejected', color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/30', dot: 'bg-zinc-500' },
};

export const COLUMN_ORDER: ApplicationStatus[] = [
  'wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected',
];

export const FREE_TIER_LIMIT = 10;
