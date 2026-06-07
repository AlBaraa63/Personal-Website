import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, LogOut, Settings, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApplications } from '../hooks/useApplications';
import { KanbanBoard } from '../components/kanban/Board';
import { StatsBar } from '../components/StatsBar';
import type { Profile } from '../types';
import type { User } from '@supabase/supabase-js';

interface DashboardProps { user: User; profile: Profile | null; signOut: () => Promise<void>; }

export function Dashboard({ user, profile, signOut }: DashboardProps) {
  const { applications, loading, byStatus, addApplication, updateApplication, deleteApplication } = useApplications(user.id);
  const [search, setSearch] = useState('');
  const isPro = profile?.plan === 'pro';

  const filtered = search
    ? applications.filter((a) =>
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase()) ||
        a.location?.toLowerCase().includes(search.toLowerCase())
      )
    : applications;

  const filteredByStatus = (status: Parameters<typeof byStatus>[0]) => filtered.filter((a) => a.status === status);

  async function handleAdd(app: Parameters<typeof addApplication>[0]) {
    try { return await addApplication(app); }
    catch { toast.error('Failed to add application'); return null; }
  }

  async function handleUpdate(id: string, updates: Parameters<typeof updateApplication>[1]) {
    try { await updateApplication(id, updates); }
    catch { toast.error('Failed to update application'); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-zinc-500">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg"><Briefcase size={16} className="text-blue-400" /></div>
          <span className="font-bold text-zinc-100">Trackr</span>
          {isPro && <span className="px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full font-medium">Pro</span>}
        </div>
        <div className="flex-1 max-w-xs mx-6">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applications..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isPro && (
            <motion.button whileHover={{ scale: 1.02 }}
              className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 rounded-lg hover:from-amber-500/30 hover:to-orange-500/30 transition-all">
              Upgrade to Pro
            </motion.button>
          )}
          <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors" title="Settings"><Settings size={16} /></button>
          <button onClick={signOut} className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors" title="Sign out"><LogOut size={16} /></button>
        </div>
      </header>
      <StatsBar applications={applications} />
      <div className="flex-1 overflow-hidden pt-4">
        <KanbanBoard applications={filtered} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={deleteApplication}
          byStatus={filteredByStatus} isPro={isPro} totalCount={applications.length} />
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => window.dispatchEvent(new CustomEvent('trackr:add'))}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg shadow-blue-500/20 transition-colors z-40">
        <Plus size={16} />Add Application
      </motion.button>
    </div>
  );
}
