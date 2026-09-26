export type CoreState =
  | 'IDLE'
  | 'LISTENING'
  | 'USER_SPEAKING'
  | 'AI_SPEAKING'
  | 'AI_INTERRUPTED'
  | 'TRANSLATING'
  | 'ERROR';

export interface AudioLevels {
  bass: number;
  mid: number;
  treble: number;
  overall: number;
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  isSpeaking: boolean;
  isOnline: boolean;
  language: string;
  speakingTimeSec: number;
}

export interface LanguageInfo {
  code: string;
  name: string;
  percentage: number;
  isPrimary?: boolean;
}

export type InlineEventType = 'DECISION' | 'TASK' | 'LANGUAGE' | 'INTERRUPTED' | 'QUESTION';

export interface InlineEvent {
  type: InlineEventType;
  label: string;
  detail?: string;
}

export interface TranscriptItemData {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  language: string;
  translation?: string;
  inlineEvent?: InlineEvent;
}

export interface DecisionItem {
  id: string;
  title: string;
  timestamp: string;
  sourceSpeaker: string;
  context?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  owner: string;
  deadline: string;
  status: 'pending' | 'confirmed' | 'edited' | 'ignored';
  timestamp: string;
}

export interface QuestionItem {
  id: string;
  text: string;
  askedBy: string;
  timestamp: string;
  isResolved: boolean;
  resolvedAnswer?: string;
}

export interface AvatarProfile {
  id: string;
  name: string;
  age: string;
  role: string;
  tagline: string;
  tone: string;
  gender: 'male' | 'female' | 'neutral';
  restImage: string;
  talkImage: string;
  vocalStyle: string;
}

export interface ScriptStep {
  timeSec: number;
  coreState: CoreState;
  activeSpeaker?: string; // name
  audioLevels: AudioLevels;
  statusLabel: string;
  statusSubLabel: string;
  // Events triggered at this step
  newTranscript?: TranscriptItemData;
  newDecision?: DecisionItem;
  newTask?: TaskItem;
  newQuestion?: QuestionItem;
  resolveQuestionId?: string;
  speakingUpdates?: { [participantName: string]: boolean };
  languageShare?: LanguageInfo[];
}
