import { useState } from 'react';
import type { Application, ApplicationStatus } from '../../types';
import { COLUMN_ORDER } from '../../types';
import { KanbanColumn } from './Column';
import { ApplicationModal } from '../ApplicationModal';

interface BoardProps {
  applications: Application[];
  onAdd: (app: Omit<Application, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Application | null>;
  onUpdate: (id: string, updates: Partial<Application>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  byStatus: (status: ApplicationStatus) => Application[];
  isPro: boolean;
  totalCount: number;
}

export function KanbanBoard({ byStatus, onAdd, onUpdate, onDelete, isPro, totalCount }: BoardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ApplicationStatus>('applied');

  function handleAddClick(status: ApplicationStatus) {
    setSelectedApp(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }

  function handleCardClick(app: Application) {
    setSelectedApp(app);
    setModalOpen(true);
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 px-6">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn key={status} status={status} applications={byStatus(status)}
            onCardClick={handleCardClick} onAddClick={handleAddClick} />
        ))}
      </div>
      <ApplicationModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedApp(null); }}
        application={selectedApp} defaultStatus={defaultStatus}
        onSave={onAdd} onUpdate={onUpdate} onDelete={onDelete} isPro={isPro} totalCount={totalCount} />
    </>
  );
}
