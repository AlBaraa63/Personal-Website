import { useState, useEffect } from 'react';
import { Trash2, Sparkles, Copy, Check, ExternalLink, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { Application, ApplicationStatus } from '../types';
import { STATUS_CONFIG, COLUMN_ORDER, FREE_TIER_LIMIT } from '../types';
import { parseJobDescription, generateCoverLetter } from '../lib/ai';
import { supabase } from '../lib/supabase';

interface Props {
  open: boolean;
  onClose: () => void;
  application: Application | null;
  defaultStatus: ApplicationStatus;
  onSave: (app: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Application | null>;
  onUpdate: (id: string, updates: Partial<Application>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isPro: boolean;
  totalCount: number;
}

const empty = (status: ApplicationStatus): Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'> => ({
  company: '', role: '', status, url: '', description: '', notes: '', salary_range: '',
  location: '', remote: false, applied_at: new Date().toISOString().split('T')[0],
  follow_up_at: '', contact_name: '', contact_email: '', cover_letter: '', ai_parsed: null,
});

type Tab = 'details' | 'description' | 'cover_letter';

export function ApplicationModal({ open, onClose, application, defaultStatus, onSave, onUpdate, onDelete, isPro, totalCount }: Props) {
  const isEdit = !!application;
  const [form, setForm] = useState(empty(defaultStatus));
  const [tab, setTab] = useState<Tab>('details');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumeText, setResumeText] = useState('');

  useEffect(() => {
    if (open) {
      setTab('details');
      setForm(application ? { ...application } : empty(defaultStatus));
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return;
        supabase.from('profiles').select('resume_text').eq('id', user.id).single()
          .then(({ data }) => setResumeText(data?.resume_text ?? ''));
      });
    }
  }, [open, application, defaultStatus]);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.company || !form.role) { toast.error('Company and role are required'); return; }
    if (!isEdit && !isPro && totalCount >= FREE_TIER_LIMIT) {
      toast.error(`Free plan is limited to ${FREE_TIER_LIMIT} applications. Upgrade to Pro!`);
      return;
    }
    setSaving(true);
    try {
      if (isEdit && application) { await onUpdate(application.id, form); toast.success('Application updated'); }
      else { await onSave(form); toast.success('Application added'); }
      onClose();
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!application || !window.confirm('Delete this application?')) return;
    setDeleting(true);
    try { await onDelete(application.id); toast.success('Application deleted'); onClose(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  }

  async function handleParseJob() {
    if (!form.description) { toast.error('Paste a job description first'); return; }
    setParsing(true);
    try {
      const parsed = await parseJobDescription(form.description);
      set('ai_parsed', parsed);
      if (parsed.salary_range && !form.salary_range) set('salary_range', parsed.salary_range);
      if (parsed.location && !form.location) set('location', parsed.location);
      if (parsed.remote !== undefined && !form.remote) set('remote', parsed.remote);
      toast.success('Job description parsed');
    } catch { toast.error('AI parsing failed — check your Supabase Edge Function'); }
    finally { setParsing(false); }
  }

  async function handleGenerateCL() {
    if (!isPro) { toast.error('Cover letter generation is a Pro feature'); return; }
    if (!form.company || !form.role || !form.description) { toast.error('Add company, role, and job description first'); return; }
    setGeneratingCL(true);
    try {
      const letter = await generateCoverLetter({ company: form.company, role: form.role, jobDescription: form.description, resumeText });
      set('cover_letter', letter);
      setTab('cover_letter');
      toast.success('Cover letter generated');
    } catch { toast.error('Generation failed — check your Supabase Edge Function'); }
    finally { setGeneratingCL(false); }
  }

  async function handleCopy() {
    if (!form.cover_letter) return;
    await navigator.clipboard.writeText(form.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const atLimit = !isPro && !isEdit && totalCount >= FREE_TIER_LIMIT;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `${form.company} — ${form.role}` : 'New Application'} size="xl">
      <div className="flex border-b border-zinc-800">
        {(['details', 'description', 'cover_letter'] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'text-blue-400 border-blue-400' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
          >
            {t === 'details' ? 'Details' : t === 'description' ? 'Job Description' : 'Cover Letter'}
            {t === 'cover_letter' && !isPro && <Lock size={11} className="inline ml-1 mb-0.5 text-zinc-600" />}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === 'details' && (
          <div className="space-y-4">
            {atLimit && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
                You've reached the free tier limit ({FREE_TIER_LIMIT} applications). Upgrade to Pro for unlimited tracking.
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Company *</label>
                <input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Google"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Role *</label>
                <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Senior Frontend Engineer"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as ApplicationStatus)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors">
                  {COLUMN_ORDER.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Salary Range</label>
                <input value={form.salary_range ?? ''} onChange={(e) => set('salary_range', e.target.value)} placeholder="AED 20,000 – 30,000/mo"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Location</label>
                <input value={form.location ?? ''} onChange={(e) => set('location', e.target.value)} placeholder="Dubai, UAE"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Job URL</label>
                <div className="relative">
                  <input value={form.url ?? ''} onChange={(e) => set('url', e.target.value)} placeholder="https://linkedin.com/jobs/..."
                    className="w-full px-3 py-2 pr-8 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
                  {form.url && <a href={form.url} target="_blank" rel="noopener noreferrer" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-blue-400"><ExternalLink size={13} /></a>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date Applied</label>
                <input type="date" value={form.applied_at ?? ''} onChange={(e) => set('applied_at', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Follow-up Date</label>
                <input type="date" value={form.follow_up_at ?? ''} onChange={(e) => set('follow_up_at', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Contact Name</label>
                <input value={form.contact_name ?? ''} onChange={(e) => set('contact_name', e.target.value)} placeholder="Hiring Manager"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Contact Email</label>
                <input value={form.contact_email ?? ''} onChange={(e) => set('contact_email', e.target.value)} placeholder="hr@company.com"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remote" checked={form.remote} onChange={(e) => set('remote', e.target.checked)} className="w-4 h-4 accent-blue-500" />
              <label htmlFor="remote" className="text-sm text-zinc-300">Remote position</label>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Notes</label>
              <textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)}
                placeholder="Interview notes, recruiter feedback, anything relevant..." rows={4}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none" />
            </div>
          </div>
        )}

        {tab === 'description' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-300 font-medium">Job Description</p>
                <p className="text-xs text-zinc-500 mt-0.5">Paste the full job description. AI will extract key requirements.</p>
              </div>
              <Button variant="secondary" size="sm" icon={<Sparkles size={13} />} loading={parsing} onClick={handleParseJob}>Parse with AI</Button>
            </div>
            <textarea value={form.description ?? ''} onChange={(e) => set('description', e.target.value)}
              placeholder="Paste the full job description here..." rows={10}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none font-mono" />
            {form.ai_parsed && (
              <div className="p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl space-y-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Analysis</p>
                {form.ai_parsed.summary && <p className="text-sm text-zinc-300">{form.ai_parsed.summary}</p>}
                {form.ai_parsed.requirements?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-2">Requirements</p>
                    <ul className="space-y-1">
                      {form.ai_parsed.requirements.map((r, i) => <li key={i} className="text-sm text-zinc-300 flex gap-2"><span className="text-blue-400 mt-0.5">·</span>{r}</li>)}
                    </ul>
                  </div>
                )}
                {form.ai_parsed.nice_to_have?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-2">Nice to have</p>
                    <ul className="space-y-1">
                      {form.ai_parsed.nice_to_have.map((r, i) => <li key={i} className="text-sm text-zinc-400 flex gap-2"><span className="text-zinc-600 mt-0.5">·</span>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'cover_letter' && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-300 font-medium">Cover Letter</p>
                <p className="text-xs text-zinc-500 mt-0.5">{isPro ? 'AI-generated cover letter tailored to the job description.' : 'Upgrade to Pro to generate cover letters with AI.'}</p>
              </div>
              <div className="flex gap-2">
                {form.cover_letter && (
                  <Button variant="ghost" size="sm" icon={copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />} onClick={handleCopy}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                )}
                <Button variant={isPro ? 'primary' : 'secondary'} size="sm" icon={isPro ? <Sparkles size={13} /> : <Lock size={13} />}
                  loading={generatingCL} onClick={handleGenerateCL} disabled={!isPro}>
                  {form.cover_letter ? 'Regenerate' : 'Generate'}
                </Button>
              </div>
            </div>
            <textarea value={form.cover_letter ?? ''} onChange={(e) => set('cover_letter', e.target.value)}
              placeholder={isPro ? 'Click "Generate" to create an AI cover letter...' : 'Upgrade to Pro to unlock AI cover letter generation.'}
              rows={16} disabled={!isPro && !form.cover_letter}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
        <div>{isEdit && <Button variant="danger" size="sm" icon={<Trash2 size={13} />} loading={deleting} onClick={handleDelete}>Delete</Button>}</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Application'}</Button>
        </div>
      </div>
    </Modal>
  );
}
