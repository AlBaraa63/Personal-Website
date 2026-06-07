import { supabase } from './supabase';
import type { ParsedJob } from '../types';

async function callEdgeFunction<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke(fn, { body });
  if (error) throw new Error(error.message);
  return data as T;
}

export async function parseJobDescription(description: string): Promise<ParsedJob> {
  return callEdgeFunction<ParsedJob>('parse-job', { description });
}

export async function generateCoverLetter(params: {
  company: string;
  role: string;
  jobDescription: string;
  resumeText: string;
  tone?: 'professional' | 'friendly' | 'concise';
}): Promise<string> {
  const { letter } = await callEdgeFunction<{ letter: string }>('generate-cover-letter', params);
  return letter;
}
