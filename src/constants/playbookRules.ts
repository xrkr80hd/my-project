import { ProjectSettings } from '../types';

export const REALISM_TAG =
  'Photorealistic candid photograph, real people, natural skin texture with visible pores, true-to-life colour, soft natural contrast, shot on a full-frame cinema camera, 35mm lens, shallow depth of field, motivated practical lighting.';

export const COMMON_ACCENTS = [
  'natural Australian',
  'British (RP)',
  'British (London/Estuary)',
  'American (Standard General)',
  'American (Southern)',
  'American (New York/East Coast)',
  'Irish (Dublin)',
  'Scottish (Edinburgh)',
  'Indian English (neutral urban)',
  'Canadian',
  'South African',
  'New Zealand'
];

export const VIDEOEXPRESS_SETTINGS_CHECKLIST = [
  { setting: 'Format', value: 'Vertical 9:16 (default) or Landscape 16:9', required: true, note: 'Re-check before every generate; dialog resets it' },
  { setting: 'Image Type', value: 'Photorealistic (Cinematic)', required: true, note: 'Crucial for photo likeness' },
  { setting: 'Use Creative mode', value: 'ALWAYS ON', required: true, note: 'Gives clearly closer likeness to real person; recheck every time!' },
  { setting: 'Automatically enhance my image prompt', value: 'OFF', required: true, note: 'Prevents unwanted alterations' },
  { setting: 'Use Consistent Character', value: 'ON', required: true, note: 'Slot 1 = Char 1 anchor, Slot 2 = Char 2 anchor' },
  { setting: 'Lipsync HD Video / Narration Video', value: 'OFF', required: true, note: 'Video model generates voice natively' },
  { setting: 'Share this in the public gallery', value: 'OFF', required: true, note: 'Real people likenesses - keep private!' },
  { setting: 'Advanced Mode', value: 'ON', required: true, note: 'Unlocks manual length & enhancer toggles' },
  { setting: 'Automatically enhance my video prompt', value: 'OFF (Untick)', required: true, note: '⚠️ ON by default! Strips cuts if left on' },
  { setting: 'Video Only (No Sound)', value: 'OFF', required: true, note: 'Ensures audio and speech are rendered' },
  { setting: 'Manual Video Length', value: '8 sec (Multi-shot) or 5 sec (Single-shot)', required: true, note: 'Adjust slider after ticking' }
];

export const TRIMMING_RULES = {
  zoomLevel: 'Zoom in × 3 from default',
  pixelRate: '40 px = 1 second',
  stepRate: '1 step ≈ 0.1 s',
  multiShot8s: {
    startTrimSeconds: 0.3,
    startTrimPixels: 12,
    endTrimSeconds: 0.5,
    endTrimPixels: 20,
    expectedRemaining: '7.2 s'
  },
  singleShot5s: {
    startTrimSeconds: 0.3,
    startTrimPixels: 12,
    endTrimSeconds: 0.4,
    endTrimPixels: 16,
    expectedRemaining: '4.3 s'
  }
};

export const SAMPLE_PROJECTS: ProjectSettings[] = [
  {
    title: 'Rooftop Concert Tickets',
    story: 'Maya surprises Liam with front-row concert tickets to his favourite band, only for him to guiltily reveal he bought the exact same tickets earlier that day.',
    format: '9:16',
    pacing: 'multi-shot',
    lengthSeconds: 30,
    worldLock: {
      name: 'Rooftop Café',
      location: 'wooden rooftop café table',
      landmarks: 'string lights overhead, glass railing on the right, city skyline behind',
      timeOfDay: 'late golden hour',
      lightLogic: 'warm sun from frame left, soft cool fill from the sky',
      fullTag: 'ROOFTOP CAFÉ — wooden tables, string lights overhead, glass railing on the right, city skyline behind, late golden hour, warm sun from frame left, soft cool fill from the sky'
    },
    characters: [
      {
        id: 'char-1',
        name: 'Maya',
        accent: 'natural Australian',
        gender: 'female',
        ageRange: 'early 30s',
        build: 'slender build with athletic posture',
        faceShape: 'oval face with defined cheekbones',
        cheeksJaw: 'softly sculpted jawline and slightly tapered chin',
        eyes: 'expressive dark brown almond-shaped eyes',
        brows: 'arched, dark, naturally neat brows',
        nose: 'straight slender nose with a defined tip',
        lips: 'full lips with a gentle bow and natural rosy tone',
        restingExpression: 'confident closed-mouth neutral expression',
        skinTone: 'warm olive-toned skin',
        skinTexture: 'natural skin texture with faint smile lines and visible pores',
        facialHair: 'none',
        hairStyle: 'shoulder-length wavy hair',
        hairColor: 'rich dark brown hair with subtle warm caramel highlights',
        fixedOutfit: 'rust-orange ribbed knit crewneck sweater with pushed-up sleeves, dark denim jeans, minimalist gold hoop earrings',
        fullDescription: 'MAYA — South Asian woman in her early 30s, slender build with athletic posture; oval face with defined cheekbones, softly sculpted jawline and slightly tapered chin; expressive dark brown almond-shaped eyes with subtle laugh lines; arched, dark, naturally neat brows; straight slender nose with a defined tip; full lips with a gentle bow and natural rosy tone, closed-mouth neutral resting expression; warm olive-toned skin with natural texture and visible pores, faint smile lines; small ears with minimalist gold hoop earrings; shoulder-length wavy dark brown hair parted off-center with natural volume; no glasses. Wearing a rust-orange ribbed knit crewneck sweater with pushed-up sleeves, dark denim slim jeans.',
        shortTag: 'the woman with shoulder-length wavy dark hair in the rust-orange sweater',
        voiceLock: 'warm, mid-pitched, confident female voice, speaking English with a natural Australian accent'
      },
      {
        id: 'char-2',
        name: 'Liam',
        accent: 'British (RP)',
        gender: 'male',
        ageRange: 'mid-30s',
        build: 'lean broad-shouldered build',
        faceShape: 'square-jawed face',
        cheeksJaw: 'prominent jawline and cleft chin',
        eyes: 'hazel-green deep-set eyes',
        brows: 'thick straight brown brows',
        nose: 'straight nose with a narrow bridge',
        lips: 'medium-full lips with natural color',
        restingExpression: 'relaxed closed-mouth expression',
        skinTone: 'fair skin with a light warm undertone',
        skinTexture: 'natural texture with light stubble along the jawline',
        facialHair: 'neat two-day stubble along the jaw and chin',
        hairStyle: 'short curly hair cropped close on the sides',
        hairColor: 'chestnut brown hair',
        fixedOutfit: 'charcoal grey wool overcoat over an oatmeal crewneck sweater, dark trousers',
        fullDescription: 'LIAM — Caucasian man in his mid-30s, lean broad-shouldered build; square-jawed face with a defined chin; hazel-green deep-set eyes with faint under-eye creases; thick straight brown brows; straight nose with a narrow bridge; medium-full lips, natural colour, relaxed closed-mouth resting expression; fair skin with warm undertone, natural texture with neat two-day stubble shadow along the jaw and chin; medium ears close to the head; short curly chestnut brown hair cropped close on the sides with natural texture on top; no glasses. Wearing a charcoal wool overcoat over an oatmeal knit sweater, dark slim trousers.',
        shortTag: 'the man with short curly chestnut hair in the charcoal overcoat',
        voiceLock: 'gentle, warm baritone male voice, speaking English with a British (RP) accent'
      }
    ],
    clips: []
  }
];
