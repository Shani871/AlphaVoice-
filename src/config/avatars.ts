import { AvatarProfile } from '../types';

export const AVATAR_PROFILES: AvatarProfile[] = [
  {
    id: 'digital_human',
    name: 'Aura Digital Human',
    age: 'Young Professional',
    role: 'Virtual AI Representative',
    tagline: 'Calm, intelligent, and articulate neural AI assistant',
    tone: 'Composed, articulate, and receptive cadence',
    gender: 'neutral',
    restImage: '/avatars/digital_human_rest.jpg',
    talkImage: '/avatars/digital_human_speaking.jpg',
    vocalStyle: '48kHz Neural Articulation • Studio Portrait',
  },
];

export const DEFAULT_AVATAR = AVATAR_PROFILES[0];
