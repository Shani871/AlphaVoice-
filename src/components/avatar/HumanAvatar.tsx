import React from 'react';
import { AudioLevels, CoreState, AvatarProfile } from '../../types';
import { AgentAvatar, SpeakerType, ConnectionStateType } from './AgentAvatar';

export { AgentAvatar };
export type { AgentAvatarProps, SpeakerType, ConnectionStateType } from './AgentAvatar';

interface HumanAvatarProps {
  isSpeaking: boolean;
  audioLevels: AudioLevels;
  coreState: CoreState;
  speakerName?: string;
  avatarProfile?: AvatarProfile;
  onChangeAvatarClick?: () => void;
  size?: 'compact' | 'normal' | 'hero';
  className?: string;
  enableHoverCircle?: boolean;
}

export const HumanAvatar: React.FC<HumanAvatarProps> = ({
  isSpeaking,
  audioLevels,
  coreState,
  speakerName = 'Aura Voice',
  avatarProfile,
  onChangeAvatarClick,
  size = 'normal',
  className = '',
}) => {
  // Map core state to AgentAvatar speaker and connection states
  const speaker: SpeakerType =
    coreState === 'USER_SPEAKING'
      ? 'user'
      : coreState === 'AI_SPEAKING' || isSpeaking
      ? 'agent'
      : 'none';

  const connectionState: ConnectionStateType =
    coreState === 'AI_INTERRUPTED'
      ? 'interrupted'
      : coreState === 'ERROR'
      ? 'disconnected'
      : 'connected';

  const isThinking = coreState === 'TRANSLATING';

  // Compute overall amplitude (max of overall and mid/bass for vocal responsiveness)
  const amplitude = Math.min(1.0, Math.max(audioLevels.overall, audioLevels.bass * 0.8, audioLevels.mid * 0.9));

  return (
    <AgentAvatar
      speaker={speaker}
      amplitude={amplitude}
      connectionState={connectionState}
      isThinking={isThinking}
      size={size}
      className={className}
      agentName={speakerName || avatarProfile?.name || 'Aura Digital Human'}
      agentRole={avatarProfile?.role || 'Virtual AI Representative'}
      onInteract={onChangeAvatarClick}
    />
  );
};
