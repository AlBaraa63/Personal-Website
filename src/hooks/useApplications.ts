import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Application, ApplicationStatus } from '../types';

export function useApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('applications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel('applications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  async function addApplication(app: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    if (!userId) return null;
    const { data, error } = await supabase.from('applications').insert({ ...app, user_id: userId }).select().single();
    if (error) throw error;
    return data;
  }

  async function updateApplication(id: string, updates: Partial<Application>) {
    const { error } = await supabase.from('applications')
      .update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  }

  async function updateStatus(id: string, status: ApplicationStatus) {
    await updateApplication(id, { status });
  }

  async function deleteApplication(id: string) {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
  }

  const byStatus = (status: ApplicationStatus) => applications.filter((a) => a.status === status);

  return { applications, loading, byStatus, addApplication, updateApplication, updateStatus, deleteApplication, refetch: fetchAll };
}
