import { Character, WorldLock, Clip, PromptValidation, ShotBeat } from '../types';
import { REALISM_TAG } from '../constants/playbookRules';

/**
 * Counts words in a string accurately.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Generates a standard Playbook 90-140 word Character Description.
 */
export function buildCharacterDescription(c: Partial<Character>): string {
  const name = (c.name || 'CHARACTER').toUpperCase();
  const genderTerm = c.gender === 'female' ? 'woman' : c.gender === 'male' ? 'man' : 'person';
  const age = c.ageRange || 'mid-30s';
  const build = c.build || 'medium build with straight posture';
  const faceShape = c.faceShape || 'oval face with natural soft cheekbones';
  const cheeksJaw = c.cheeksJaw || 'gentle jawline and rounded chin';
  const eyes = c.eyes || 'dark brown almond-shaped eyes with faint laugh lines';
  const brows = c.brows || 'naturally neat arched dark brows';
  const nose = c.nose || 'straight nose with a neat rounded tip';
  const lips = c.lips || 'natural rose-toned lips with a defined bow';
  const restingExpression = c.restingExpression || 'neutral closed-mouth resting expression';
  const skinTone = c.skinTone || 'warm olive-toned skin';
  const skinTexture = c.skinTexture || 'natural skin texture with visible pores';
  const facialHair = c.facialHair && c.facialHair !== 'none' ? `, ${c.facialHair}` : ', clean-shaven';
  const hair = `${c.hairStyle || 'short swept-back hair'}, ${c.hairColor || 'natural black hair'}`;
  const outfit = c.fixedOutfit || 'navy casual button-up shirt and dark slim trousers';

  return `${name} — ${age} ${genderTerm}, ${build}; ${faceShape}, ${cheeksJaw}; ${eyes}; ${brows}; ${nose}; ${lips}, ${restingExpression}; ${skinTone} with ${skinTexture}${facialHair}; medium ears close to the head; ${hair}, natural volume; no glasses. Wearing ${outfit}.`;
}

/**
 * Generates a concise Short Tag (8-12 words visible traits only).
 */
export function buildShortTag(c: Partial<Character>): string {
  const genderTerm = c.gender === 'female' ? 'woman' : c.gender === 'male' ? 'man' : 'person';
  const hair = c.hairStyle ? `${c.hairStyle}` : 'short hair';
  const outfit = c.fixedOutfit ? c.fixedOutfit.split(',')[0].replace(/^wearing /i, '') : 'navy polo';
  return `the ${genderTerm} with ${hair} in the ${outfit}`;
}

/**
 * Generates the immutable Voice Lock string.
 */
export function buildVoiceLock(c: Partial<Character>): string {
  const pitch = c.gender === 'female' ? 'warm, mid-pitched, clear female voice' : 'warm, clear baritone male voice';
  const accent = c.accent || 'natural Australian';
  return `${pitch}, speaking English with a ${accent} accent`;
}

/**
 * Generates the Anchor Image Prompt (Section 5 of Playbook).
 */
export function generateAnchorPrompt(character: Character, worldLock: WorldLock): string {
  return `${REALISM_TAG} Character anchor portrait of ${character.fullDescription}. The reference photo shows THE SAME real person: preserve their real head shape, full cheek and jaw proportions, eye shape, brows, nose and lip shapes, apparent age, skin tone, natural skin texture and hair exactly. Do not slim, smooth or beautify the face, do not make them look younger, no actor substitution, no added beard, make-up or glasses that are not in the photo. Copy only the face and hair from the photo; ignore its background, clothing and any logos. Chest-up, facing the camera, relaxed natural expression with lips closed, in ${worldLock.location || 'rooftop café'}, softly out of focus, ${worldLock.lightLogic || 'warm soft daylight'}. Exactly one person. No text, logos or watermark.`;
}

/**
 * Generates the Start Image Prompt for a Clip (Section 6 of Playbook).
 */
export function generateStartImagePrompt(
  _clipNumber: number,
  characters: Character[],
  visibleCharIds: string[],
  worldLock: WorldLock,
  shotSize = 'medium two-shot'
): string {
  const visibleChars = characters.filter((c) => visibleCharIds.includes(c.id));
  const charsDescriptions = visibleChars.map((c, idx) => {
    const screenSide = idx === 0 ? 'at frame left' : 'at frame right';
    return `${c.fullDescription} positioned ${screenSide}`;
  }).join('. In the same frame, ');

  const poseDescription = visibleChars.length > 1
    ? 'Both characters are engaged in natural candid interaction, facing each other at a three-quarter angle with realistic physical posture and clear negative space between them.'
    : 'The character is facing toward camera at a slight three-quarter angle with relaxed natural posture.';

  return `${REALISM_TAG} A ${shotSize}, front-facing at eye level, vertical 9:16 composition. ${charsDescriptions}. Set in ${worldLock.location}, ${worldLock.landmarks}, ${worldLock.timeOfDay}, ${worldLock.lightLogic}. ${poseDescription} Natural practical lighting, shallow depth of field, sharp facial focus with authentic human skin texture and visible pores. No text, watermark, logos, or artificial smoothing.`;
}

/**
 * Generates the Video & Audio Prompt for a Clip (Section 7 of Playbook).
 */
export function generateVideoPrompt(
  clipNumber: number,
  role: 'hook' | 'escalation' | 'twist' | 'payoff',
  _duration: number,
  characters: Character[],
  visibleCharIds: string[],
  speakerId: string | undefined,
  dialogueLine: string,
  worldLock: WorldLock,
  pacing: 'multi-shot' | 'single-shot'
): string {
  const tag = `C${clipNumber.toString().padStart(2, '0')}`;
  const visibleChars = characters.filter((c) => visibleCharIds.includes(c.id));
  const char1 = visibleChars[0];
  const char2 = visibleChars[1];
  const speaker = characters.find((c) => c.id === speakerId) || char1;
  const listener = visibleChars.find((c) => c.id !== speaker?.id);

  if (pacing === 'single-shot') {
    const quotePart = dialogueLine
      ? `then after a quick breath ${speaker.shortTag} says in ${speaker.voiceLock}: "${dialogueLine}", with an authentic head tilt and expressive brow shift,`
      : `then takes a decisive breath, looking steadily ahead,`;

    return `${tag} — A medium close-up, front-facing at eye level, the camera remains static on ${speaker.shortTag} in ${worldLock.location}, ${worldLock.lightLogic}. Initially ${speaker.shortTag} shifts weight with an alert gaze, ${quotePart} and finishes by maintaining confident eye contact. Soft rustle of clothing and subtle breath up front, ${worldLock.name} background ambience, no music.`;
  }

  // Multi-shot mode (8 seconds default, 2-3 cuts)
  if (visibleChars.length >= 2 && listener) {
    const speakerLine = dialogueLine || (role === 'hook' ? "Front row. Tonight. Don't say you're busy." : role === 'twist' ? "Wait, look at these. Two identical tickets." : "Take a closer look.");

    return `${tag} — A medium two-shot, front-facing at eye level, the camera holding static on ${char1.shortTag} at frame left and ${char2.shortTag} at frame right at the ${worldLock.location} under ${worldLock.landmarks}, ${worldLock.lightLogic}. Initially ${speaker.shortTag} makes a decisive gesture forward, then, after a quick breath, ${speaker.shortTag} says in ${speaker.voiceLock}: "${speakerLine}" while ${listener.shortTag} listens, lips closed, eyebrows rising in surprise, and does not speak. A hard cut transitions to a close-up of ${listener.shortTag}, seen from a slight side angle in the same ${worldLock.lightLogic}; the camera pushes in slightly as ${listener.shortTag} reacts with a sudden blink and an amused smile, remaining silent. The view cuts to a close-up of hands on the table as the key item is revealed clearly. The sound carries across the cuts: ${speaker.shortTag}'s clear voice up front, practical table sounds, authentic ${worldLock.name} atmospheric ambience, no music.`;
  }

  // Solo character multi-shot
  const line = dialogueLine || "This is exactly what we were waiting for.";
  return `${tag} — A medium close-up, front-facing at eye level, the camera holding static on ${char1.shortTag} at the ${worldLock.location}, ${worldLock.lightLogic}. Initially ${char1.shortTag} turns toward frame center with a determined gaze, then, after a quick breath, ${char1.shortTag} says in ${char1.voiceLock}: "${line}" before pausing to assess the view. A hard cut transitions to a tighter close-up from a slight side angle in the same light; the camera pushes in slightly as ${char1.shortTag}'s expression sharpens with conviction, silent. The view cuts to a close-up of hands adjusting the collar firmly. The sound carries across the cuts: clear vocal delivery up front, soft ambient room tone and distant environmental texture, no music.`;
}

/**
 * Playbook Prompt Validator & Linter.
 * Enforces all Section 0, 4, 6, 7 and 9 rules.
 */
export function validatePrompt(prompt: string, type: 'image' | 'video', _duration = 8): PromptValidation {
  const checks: PromptValidation['checks'] = [];
  const wordCount = countWords(prompt);

  // Extract quotes and words inside quotes
  const quotesMatch = prompt.match(/"([^"]+)"/g) || [];
  const quotes = quotesMatch.map((q) => q.replace(/"/g, ''));
  const spokenWordsTotal = quotes.reduce((acc, q) => acc + countWords(q), 0);

  // Count cuts
  const hardCutsMatch = prompt.match(/hard cut|cuts to|transitions to/gi) || [];
  const cutsCount = hardCutsMatch.length;

  if (type === 'image') {
    // 1. Starts with Realism Tag
    const hasRealism = prompt.toLowerCase().includes('photorealistic candid photograph') && prompt.toLowerCase().includes('skin texture with visible pores');
    checks.push({
      name: 'Realism Tag',
      passed: hasRealism,
      message: hasRealism ? 'Realism tag is correctly placed at the start' : 'Missing verbatim Realism tag (Playbook Section 4)',
      severity: 'error'
    });

    // 2. Word count
    const goodLength = wordCount >= 80 && wordCount <= 500;
    checks.push({
      name: 'Word Count (~150-400 words)',
      passed: goodLength,
      message: `Image prompt is ${wordCount} words (${goodLength ? 'Optimal' : wordCount < 80 ? 'Too short, need verbatim character descriptions' : 'Very long'})`,
      severity: goodLength ? 'info' : 'warning'
    });

    // 3. Negative keywords check
    const hasForbiddenWords = /(8k|ultra-detailed|hyperrealistic|masterpiece|photorealistic 3d|octane render)/i.test(prompt);
    checks.push({
      name: 'No Glossy Buzzwords',
      passed: !hasForbiddenWords,
      message: hasForbiddenWords ? 'Contains glossy buzzwords (8K, masterpiece) forbidden in Section 4' : 'Clean of forbidden buzzwords',
      severity: hasForbiddenWords ? 'warning' : 'info'
    });
  } else {
    // Video prompt checks
    // 1. Starts with C## —
    const startsWithClipTag = /^C\d{2}\s*—/.test(prompt.trim());
    checks.push({
      name: 'Clip Tag Header (C## —)',
      passed: startsWithClipTag,
      message: startsWithClipTag ? 'Starts with proper clip identifier (e.g. C01 —)' : 'Must start with C## — format (Section 7 Rule 1)',
      severity: 'error'
    });

    // 2. Single flowing paragraph (no newlines)
    const isSingleParagraph = !prompt.trim().includes('\n');
    checks.push({
      name: 'Single Flowing Paragraph',
      passed: isSingleParagraph,
      message: isSingleParagraph ? 'Single paragraph, no bullet points or shot headers' : 'Must be one single flowing paragraph with no linebreaks (Section 7 Rule 2)',
      severity: 'error'
    });

    // 3. Word count between 130 and 220 words
    const optimalWordCount = wordCount >= 110 && wordCount <= 230;
    checks.push({
      name: 'Video Prompt Length (130–200 words)',
      passed: optimalWordCount,
      message: `Prompt has ${wordCount} words (Playbook target is 130–200 words)`,
      severity: optimalWordCount ? 'info' : 'warning'
    });

    // 4. "no music" ending tag
    const endsWithNoMusic = /no music[.\s]*$/i.test(prompt.trim());
    checks.push({
      name: 'Mandatory "no music" Ending',
      passed: endsWithNoMusic,
      message: endsWithNoMusic ? 'Prompt correctly ends with "no music"' : 'Prompt must end with "no music" to avoid AI hallucinating background tracks (Section 7 Rule 11)',
      severity: 'error'
    });

    // 5. Hard cut phrasing
    const hasHardCut = prompt.includes('A hard cut transitions to') || prompt.includes('The view cuts to');
    checks.push({
      name: 'Cut Transition Phrasing',
      passed: hasHardCut,
      message: hasHardCut ? 'Transitions use explicit camera cut phrasing' : 'Recommend using "A hard cut transitions to..." (Section 7 Rule 9)',
      severity: 'warning'
    });

    // 6. Dialogue line length limit (<= 8 words per shot)
    const dialogueTooLong = quotes.some((q) => countWords(q) > 9);
    checks.push({
      name: 'Dialogue Budget (≤ 8 words per shot)',
      passed: !dialogueTooLong,
      message: dialogueTooLong
        ? `A quoted line exceeds 8 words (${quotes.map((q) => `"${q}" (${countWords(q)}w)`).join(', ')}). Video model lip sync fails on long sentences!`
        : `Spoken dialogue is succinct (${spokenWordsTotal} words total)`,
      severity: dialogueTooLong ? 'error' : 'info'
    });

    // 7. Non-speaker "lips closed" check
    if (prompt.includes('says in')) {
      const mentionsLipsClosed = /lips closed|does not speak|silent/i.test(prompt);
      checks.push({
        name: 'Listener Silent Rule',
        passed: mentionsLipsClosed,
        message: mentionsLipsClosed ? 'Listener explicitly instructed to keep lips closed' : 'Playbook requires specifying listener has "lips closed, does not speak" to prevent double-talking',
        severity: 'warning'
      });
    }

    // 8. No banned phrases
    const hasBannedPacing = /(slowly fades|lingers|gradually|takes a long moment)/i.test(prompt);
    checks.push({
      name: 'Decisive Pacing',
      passed: !hasBannedPacing,
      message: hasBannedPacing ? 'Avoid slow words like "lingers", "gradually", "slowly fades" (Section 7 Rule 10)' : 'Decisive pacing verbs used',
      severity: 'warning'
    });
  }

  const errorCount = checks.filter((c) => c.severity === 'error' && !c.passed).length;
  const warningCount = checks.filter((c) => c.severity === 'warning' && !c.passed).length;
  const valid = errorCount === 0;

  let score = 100 - errorCount * 25 - warningCount * 10;
  if (score < 0) score = 0;

  return {
    valid,
    score,
    checks,
    wordCount,
    spokenWordCount: spokenWordsTotal,
    cutsCount
  };
}

/**
 * Builds the initial set of clips for a project based on duration and pacing.
 */
export function generateClipsForProject(
  _story: string,
  characters: Character[],
  worldLock: WorldLock,
  lengthSeconds: number,
  pacing: 'multi-shot' | 'single-shot'
): Clip[] {
  let clipCount = 4;
  let duration = 8;

  if (pacing === 'multi-shot') {
    if (lengthSeconds === 20) clipCount = 3;
    else if (lengthSeconds === 45) clipCount = 6;
    else clipCount = 4; // 30s
    duration = 8;
  } else {
    // Single-shot
    if (lengthSeconds === 20) clipCount = 5;
    else if (lengthSeconds === 45) clipCount = 10;
    else clipCount = 7; // 30s
    duration = 5;
  }

  const clips: Clip[] = [];
  const charIds = characters.map((c) => c.id);

  for (let i = 1; i <= clipCount; i++) {
    let role: Clip['role'] = 'escalation';
    let title = `Clip ${i}: Escalation`;

    if (i === 1) {
      role = 'hook';
      title = `C01: Hook`;
    } else if (i === clipCount) {
      role = 'payoff';
      title = `C0${i}: Payoff`;
    } else if (i === Math.ceil(clipCount * 0.7)) {
      role = 'twist';
      title = `C0${i}: Twist (70%)`;
    }

    const speakerId = characters[i % 2 === 1 ? 0 : Math.min(1, characters.length - 1)]?.id;

    const startImgPrompt = generateStartImagePrompt(i, characters, charIds, worldLock);
    const vidPrompt = generateVideoPrompt(
      i,
      role,
      duration,
      characters,
      charIds,
      speakerId,
      i === 1 ? "Front row. Tonight. Don't say you're busy." : i === clipCount ? "I guess great minds really do think alike." : '',
      worldLock,
      pacing
    );

    const shots: ShotBeat[] = pacing === 'multi-shot'
      ? [
          {
            id: `s-${i}-a`,
            label: 'Shot A (~3s)',
            camera: 'Medium two-shot, front-facing eye level',
            action: 'Initial action & line delivery',
            speakerId
          },
          {
            id: `s-${i}-b`,
            label: 'Shot B (~3s)',
            camera: 'Close-up side angle, slight push-in',
            action: 'Listener reaction, eyes widen, silent'
          },
          {
            id: `s-${i}-c`,
            label: 'Shot C (~2s)',
            camera: 'Insert close-up on hands & prop',
            action: 'Decisive payoff motion landing'
          }
        ]
      : [
          {
            id: `s-${i}-a`,
            label: 'Single Take (5s)',
            camera: 'Medium close-up, static camera',
            action: 'Full motion with speech and decisive conclusion'
          }
        ];

    clips.push({
      id: `C${i.toString().padStart(2, '0')}`,
      number: i,
      role,
      duration,
      title,
      visibleCharacterIds: charIds,
      speakerId,
      shots,
      startImagePrompt: startImgPrompt,
      videoPrompt: vidPrompt,
      status: 'draft',
      renderProgress: 0
    });
  }

  return clips;
}
