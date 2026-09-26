import React, { useState } from 'react';
import { TaskItem } from '../../types';
import { Check, Calendar, User, CheckCircle, Edit2, Ban, Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface TaskCardProps {
  task: TaskItem;
  onStatusChange?: (id: string, newStatus: TaskItem['status']) => void;
  onEditTitle?: (id: string, newTitle: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEditTitle,
}) => {
  const { id, title, owner, deadline, status, timestamp } = task;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const statusBadge = {
    pending: { label: 'Pending', bg: 'bg-[#E3A54A]/10 text-[#E3A54A] border-[#E3A54A]/30' },
    confirmed: { label: 'Confirmed', bg: 'bg-[#3ECF8E]/10 text-[#3ECF8E] border-[#3ECF8E]/30' },
    edited: { label: 'Edited', bg: 'bg-[#5B7FFF]/10 text-[#5B7FFF] border-[#5B7FFF]/30' },
    ignored: { label: 'Ignored', bg: 'bg-[#5F6773]/10 text-[#5F6773] border-[#5F6773]/30' },
  }[status];

  const handleSaveEdit = () => {
    if (onEditTitle && editValue.trim()) {
      onEditTitle(id, editValue.trim());
    }
    if (onStatusChange) {
      onStatusChange(id, 'edited');
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`group rounded-xl border p-3.5 transition-all ${
        status === 'confirmed'
          ? 'border-[#3ECF8E]/30 bg-[#1C1F24]'
          : status === 'ignored'
          ? 'border-[#26292F] bg-[#141619]/60 opacity-60'
          : 'border-[#5B7FFF]/30 bg-[#1C1F24]'
      }`}
    >
      {/* Top Header: Title & Status */}
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full rounded-lg border border-[#5B7FFF] bg-[#141619] px-2.5 py-1 text-xs text-[#EDEFF2] focus:outline-none"
              autoFocus
            />
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSaveEdit}
                className="text-[11px] font-semibold text-[#3ECF8E] bg-[#3ECF8E]/15 px-2 py-0.5 rounded border border-[#3ECF8E]/30 hover:bg-[#3ECF8E]/25"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-[11px] text-[#A3AAB5] px-2 py-0.5 rounded hover:bg-[#26292F]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h4
            className={`text-sm font-semibold leading-snug ${
              status === 'ignored' ? 'line-through text-[#5F6773]' : 'text-[#EDEFF2]'
            }`}
          >
            {title}
          </h4>
        )}

        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold border ${statusBadge.bg}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Meta info: Owner, Deadline */}
      <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#A3AAB5]">
        <span className="flex items-center gap-1.5">
          <User className="h-3 w-3 text-[#5B7FFF]" />
          <span>{owner}</span>
        </span>
        <span className="text-[#5F6773]">•</span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 text-[#E3A54A]" />
          <span className="font-medium text-[#EDEFF2]">{deadline}</span>
        </span>
        <span className="text-[#5F6773]">•</span>
        <span className="flex items-center gap-1 text-[11px] text-[#5F6773] font-mono">
          <Clock className="h-2.5 w-2.5" />
          {timestamp}
        </span>
      </div>

      {/* Actions footer */}
      {status !== 'ignored' && (
        <div className="mt-3.5 flex items-center justify-end gap-1.5 border-t border-[#26292F] pt-2.5">
          {status !== 'confirmed' && (
            <Button
              size="sm"
              variant="success"
              onClick={() => onStatusChange?.(id, 'confirmed')}
              icon={<Check className="h-3 w-3" />}
            >
              Confirm
            </Button>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#A3AAB5] hover:bg-[#26292F] hover:text-[#EDEFF2] transition-colors"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
          )}

          <button
            onClick={() => onStatusChange?.(id, 'ignored')}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[#5F6773] hover:bg-[#EF4B52]/10 hover:text-[#EF4B52] transition-colors"
          >
            <Ban className="h-3 w-3" />
            Ignore
          </button>
        </div>
      )}
    </div>
  );
};
