import React from 'react';
import { AvatarProfile } from '../../types';
import { AVATAR_PROFILES } from '../../config/avatars';
import { AgentAvatar } from './AgentAvatar';
import { X, Check, Sparkles, Volume2, ShieldCheck, User } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeAvatar: AvatarProfile;
  onSelectAvatar: (avatar: AvatarProfile) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  activeAvatar,
  onSelectAvatar,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#141619] border border-[#26292F] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#26292F] bg-[#1C1F24]/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#EDEFF2]">
                Virtual AI Digital Human
              </h2>
              <p className="text-xs text-[#A3AAB5]">
                Cinematic 2D studio portrait with 6-stage continuous lip-sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Digital Human Card */}
        <div className="p-6">
          {AVATAR_PROFILES.map((avatar) => {
            const isSelected = activeAvatar.id === avatar.id;
            return (
              <div
                key={avatar.id}
                onClick={() => {
                  onSelectAvatar(avatar);
                  onClose();
                }}
                className={`group relative flex flex-col rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1C1F24] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'bg-[#141619] border-[#26292F] hover:border-cyan-500/60 hover:bg-[#1C1F24]/60'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold px-3 py-0.5 rounded-full border text-cyan-400 bg-cyan-500/10 border-cyan-500/25">
                    Digital Human • {avatar.age}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                    Active Virtual Representative
                  </span>
                </div>

                {/* Avatar Preview */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#26292F] mb-4 bg-gradient-to-b from-[#141922] to-[#090B0E] flex items-center justify-center">
                  <AgentAvatar
                    speaker="agent"
                    amplitude={0.5}
                    connectionState="connected"
                    size="compact"
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-[#EDEFF2] font-semibold drop-shadow pointer-events-none">
                    <span>{avatar.name}</span>
                    <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                      <Volume2 className="h-3 w-3" />
                      6-State Neural Lip Sync
                    </span>
                  </div>
                </div>

                {/* Bio & Details */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#EDEFF2] group-hover:text-cyan-400 transition-colors">
                      {avatar.name}
                    </h3>
                    <p className="text-xs font-medium text-cyan-400">
                      {avatar.role}
                    </p>
                    <p className="text-xs text-[#A3AAB5] mt-1 leading-relaxed">
                      {avatar.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#26292F]/60 mt-3 flex items-center justify-between text-[11px] text-[#5F6773] font-mono">
                    <span>Studio Cinematic Lighting</span>
                    <span className="text-cyan-400 font-semibold">{avatar.vocalStyle}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#26292F] bg-[#141619] text-xs text-[#A3AAB5]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            High-Quality Digital Human Asset (Zero primitive SVG shapes)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
