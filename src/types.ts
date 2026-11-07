export type VideoFormat = '9:16' | '16:9';
export type VideoPacing = 'multi-shot' | 'single-shot';
export type VideoLength = 20 | 30 | 45;

export interface Character {
  id: string;
  name: string;
  accent: string;
  gender: 'female' | 'male' | 'non-binary';
  ageRange: string;
  build: string;
  faceShape: string;
  cheeksJaw: string;
  eyes: string;
  brows: string;
  nose: string;
  lips: string;
  restingExpression: string;
  skinTone: string;
  skinTexture: string;
  facialHair: string;
  hairStyle: string;
  hairColor: string;
  fixedOutfit: string;
  fullDescription: string;
  shortTag: string;
  voiceLock: string;
  photoUrl?: string;
  croppedPhotoUrl?: string;
}

export interface WorldLock {
  name: string;
  location: string;
  landmarks: string;
  timeOfDay: string;
  lightLogic: string;
  fullTag: string;
}

export interface ShotBeat {
  id: string;
  label: string; // e.g. "Shot A (~3s)"
  camera: string;
  action: string;
  speakerId?: string;
  dialogue?: string;
  silentReactionId?: string;
}

export interface Clip {
  id: string; // e.g. "C01", "C02"
  number: number;
  role: 'hook' | 'escalation' | 'twist' | 'payoff';
  duration: number; // 8 or 5
  title: string;
  visibleCharacterIds: string[];
  speakerId?: string;
  shots: ShotBeat[];
  startImagePrompt: string;
  videoPrompt: string;
  status: 'draft' | 'ready' | 'rendering' | 'completed' | 'failed';
  renderProgress: number; // 0 - 100
  videoExpressId?: string;
  renderStartTime?: number;
}

export interface ProjectSettings {
  title: string;
  story: string;
  format: VideoFormat;
  pacing: VideoPacing;
  lengthSeconds: VideoLength;
  worldLock: WorldLock;
  characters: Character[];
  clips: Clip[];
}

export interface PromptValidation {
  valid: boolean;
  score: number; // 0 - 100
  checks: {
    name: string;
    passed: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }[];
  wordCount: number;
  spokenWordCount: number;
  cutsCount: number;
}
