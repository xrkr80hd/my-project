import { useState } from 'react';
import { Plus, Users, Sparkles, CheckSquare, Layers } from 'lucide-react';
import { ProjectSettings, Character } from './types';
import { SAMPLE_PROJECTS } from './constants/playbookRules';
import {
  generateClipsForProject,
  buildCharacterDescription,
  buildShortTag,
  buildVoiceLock
} from './utils/playbookGenerator';
import { Header } from './components/Header';
import { CharacterCard } from './components/CharacterCard';
import { StoryAndWorldSetup } from './components/StoryAndWorldSetup';
import { ClipEditor } from './components/ClipEditor';
import { WaveTracker } from './components/WaveTracker';

export function App() {
  const [project, setProject] = useState<ProjectSettings>(() => {
    const base = SAMPLE_PROJECTS[0];
    const initialClips = generateClipsForProject(
      base.story,
      base.characters,
      base.worldLock,
      base.lengthSeconds,
      base.pacing
    );
    return { ...base, clips: initialClips };
  });

  const [activeStepTab, setActiveStepTab] = useState<'bible' | 'clips' | 'waves' | 'checklist'>('clips');

  // Checklist state for VideoExpress run
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    step1_upload: false,
    step2_disclaimer: false,
    step3_anchor1: false,
    step4_anchor2: false,
    step5_consistent_setup: false,
    step6_clips_submitted: false,
    step7_trimmed: false,
    step8_exported: false
  });

  const handleUpdateProject = (partial: Partial<ProjectSettings>) => {
    setProject((prev) => {
      const updated = { ...prev, ...partial };
      // If pacing, length, or worldLock changed, regenerate clips if requested
      return updated;
    });
  };

  const handleRegenerateAllClips = () => {
    const newClips = generateClipsForProject(
      project.story,
      project.characters,
      project.worldLock,
      project.lengthSeconds,
      project.pacing
    );
    setProject((prev) => ({ ...prev, clips: newClips }));
  };

  const handleUpdateCharacter = (index: number, updatedChar: Character) => {
    setProject((prev) => {
      const newChars = [...prev.characters];
      newChars[index] = updatedChar;
      return { ...prev, characters: newChars };
    });
  };

  const handleAddCharacter = () => {
    if (project.characters.length >= 2) return;
    const newChar: Character = {
      id: `char-${Date.now()}`,
      name: 'Character 2',
      accent: 'British (RP)',
      gender: 'male',
      ageRange: 'mid-30s',
      build: 'medium athletic build',
      faceShape: 'square jawline and defined chin',
      cheeksJaw: 'sculpted jawline',
      eyes: 'dark brown expressive eyes',
      brows: 'straight dark brows',
      nose: 'straight defined nose',
      lips: 'natural resting lips',
      restingExpression: 'neutral closed-mouth expression',
      skinTone: 'light brown skin tone',
      skinTexture: 'natural skin texture with visible pores',
      facialHair: 'neat light stubble',
      hairStyle: 'short neat parted hair',
      hairColor: 'dark brown hair',
      fixedOutfit: 'charcoal grey jacket over a clean white crewneck tee, dark trousers',
      fullDescription: '',
      shortTag: '',
      voiceLock: ''
    };
    newChar.fullDescription = buildCharacterDescription(newChar);
    newChar.shortTag = buildShortTag(newChar);
    newChar.voiceLock = buildVoiceLock(newChar);

    setProject((prev) => {
      const updatedChars = [...prev.characters, newChar];
      const updatedClips = generateClipsForProject(
        prev.story,
        updatedChars,
        prev.worldLock,
        prev.lengthSeconds,
        prev.pacing
      );
      return { ...prev, characters: updatedChars, clips: updatedClips };
    });
  };

  const handleRemoveCharacter = (index: number) => {
    if (project.characters.length <= 1) return;
    setProject((prev) => {
      const updatedChars = prev.characters.filter((_, i) => i !== index);
      const updatedClips = generateClipsForProject(
        prev.story,
        updatedChars,
        prev.worldLock,
        prev.lengthSeconds,
        prev.pacing
      );
      return { ...prev, characters: updatedChars, clips: updatedClips };
    });
  };

  const handleNewProject = () => {
    const blankChar: Character = {
      id: 'char-1',
      name: 'Maya',
      accent: 'natural Australian',
      gender: 'female',
      ageRange: 'early 30s',
      build: 'slender athletic build',
      faceShape: 'oval face with natural soft cheekbones',
      cheeksJaw: 'softly sculpted jawline and rounded chin',
      eyes: 'dark brown almond-shaped eyes with subtle laugh lines',
      brows: 'arched naturally neat dark brows',
      nose: 'straight slender nose with a defined tip',
      lips: 'natural rose-toned lips with a defined bow',
      restingExpression: 'neutral closed-mouth resting expression',
      skinTone: 'warm olive-toned skin',
      skinTexture: 'natural skin texture with visible pores',
      facialHair: 'none',
      hairStyle: 'shoulder-length wavy dark brown hair',
      hairColor: 'dark brown',
      fixedOutfit: 'rust-orange ribbed knit crewneck sweater, dark slim jeans',
      fullDescription: '',
      shortTag: '',
      voiceLock: ''
    };
    blankChar.fullDescription = buildCharacterDescription(blankChar);
    blankChar.shortTag = buildShortTag(blankChar);
    blankChar.voiceLock = buildVoiceLock(blankChar);

    const newProj: ProjectSettings = {
      title: 'New Video Project',
      story: 'A surprising revelation between two characters that changes everything in seconds.',
      format: '9:16',
      pacing: 'multi-shot',
      lengthSeconds: 30,
      worldLock: {
        name: 'MODERN CAFÉ',
        location: 'wooden indoor café table',
        landmarks: 'espresso machine behind, glass window on right, warm wall sconces',
        timeOfDay: 'afternoon',
        lightLogic: 'soft daylight from right window, warm indoor fill',
        fullTag: 'MODERN CAFÉ — wooden tables, espresso machine behind, glass window on right, afternoon, soft daylight from right window'
      },
      characters: [blankChar],
      clips: []
    };
    newProj.clips = generateClipsForProject(
      newProj.story,
      newProj.characters,
      newProj.worldLock,
      newProj.lengthSeconds,
      newProj.pacing
    );
    setProject(newProj);
  };

  const handleSelectProject = (p: ProjectSettings) => {
    const clips = generateClipsForProject(
      p.story,
      p.characters,
      p.worldLock,
      p.lengthSeconds,
      p.pacing
    );
    setProject({ ...p, clips });
  };

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0b0d13] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Header
        settings={project}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Production Card Banner */}
        <div className="bg-gradient-to-r from-purple-950/40 via-[#161922] to-indigo-950/40 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider font-mono">
                Production Card
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {project.format} • ~{project.lengthSeconds}s • {project.clips.length} clips • {project.pacing}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              🎬 {project.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              <strong>Cast:</strong> {project.characters.map((c) => `${c.name} (${c.accent})`).join(' · ')} <br />
              <strong>Hook:</strong> {project.story}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://app.videoexpress.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Open VideoExpress
            </a>
          </div>
        </div>

        {/* Section 1: Story & World Setup */}
        <StoryAndWorldSetup
          settings={project}
          onUpdate={handleUpdateProject}
          onRegenerateAllClips={handleRegenerateAllClips}
        />

        {/* Navigation Tabs for Production Flow */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
          <button
            onClick={() => setActiveStepTab('clips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStepTab === 'clips'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles size={14} />
            1. Prompts Workbench ({project.clips.length} Clips)
          </button>

          <button
            onClick={() => setActiveStepTab('bible')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStepTab === 'bible'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users size={14} />
            2. Character Bibles &amp; Anchors ({project.characters.length})
          </button>

          <button
            onClick={() => setActiveStepTab('waves')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStepTab === 'waves'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers size={14} />
            3. Wave Render Tracker (Max 5)
          </button>

          <button
            onClick={() => setActiveStepTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeStepTab === 'checklist'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckSquare size={14} />
            4. Step-by-Step Production Checklist
          </button>
        </div>

        {/* Step Tab 1: Clips Prompts Workbench */}
        {activeStepTab === 'clips' && (
          <div className="space-y-6">
            <ClipEditor
              clips={project.clips}
              characters={project.characters}
              worldLock={project.worldLock}
              pacing={project.pacing}
              onUpdateClip={(index, updated) => {
                const newClips = [...project.clips];
                newClips[index] = updated;
                setProject((prev) => ({ ...prev, clips: newClips }));
              }}
            />
          </div>
        )}

        {/* Step Tab 2: Character Bibles */}
        {activeStepTab === 'bible' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Cast &amp; Likeness Anchors</span>
                  <span className="text-xs text-slate-400">({project.characters.length} of 2 max)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Playbook Section 2a &amp; 5 • 90–140 word descriptions + Head-and-Shoulders face cropper
                </p>
              </div>

              {project.characters.length < 2 && (
                <button
                  type="button"
                  onClick={handleAddCharacter}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition"
                >
                  <Plus size={14} />
                  Add Second Character
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5">
              {project.characters.map((char, idx) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  index={idx}
                  worldLock={project.worldLock}
                  onUpdate={(updated) => handleUpdateCharacter(idx, updated)}
                  onRemove={() => handleRemoveCharacter(idx)}
                  canRemove={project.characters.length > 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step Tab 3: Wave Tracker */}
        {activeStepTab === 'waves' && (
          <WaveTracker
            clips={project.clips}
            onUpdateClipStatus={(idx, status, progress, videoId) => {
              const newClips = [...project.clips];
              newClips[idx] = {
                ...newClips[idx],
                status,
                renderProgress: progress,
                videoExpressId: videoId || newClips[idx].videoExpressId
              };
              setProject((prev) => ({ ...prev, clips: newClips }));
            }}
          />
        )}

        {/* Step Tab 4: Production Run Checklist */}
        {activeStepTab === 'checklist' && (
          <div className="bg-[#161922] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare size={16} className="text-purple-400" />
                <span>VideoExpress Production Run Checklist</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tick off each step as you execute it inside https://app.videoexpress.ai/
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                {
                  id: 'step1_upload',
                  title: '1. Upload Reference Photos',
                  desc: 'In VideoExpress, open Media Library → My Media → Images → Upload file. Name them "[Name] - reference photo".'
                },
                {
                  id: 'step2_disclaimer',
                  title: '2. Accept One-Time Consistent Character Disclaimer',
                  desc: 'Tick "Use Consistent Character". Click "I Agree" on the one-time disclaimer modal.'
                },
                {
                  id: 'step3_anchor1',
                  title: `3. Generate Character 1 Anchor (${project.characters[0]?.name || 'Char 1'})`,
                  desc: 'Clear slots. Set Reference Photo = photo 1. Turn Creative mode ALWAYS ON. Paste Anchor Prompt. Pick best carousel image, click "+ Consistent Character".'
                },
                ...(project.characters.length > 1
                  ? [
                      {
                        id: 'step4_anchor2',
                        title: `4. Generate Character 2 Anchor (${project.characters[1]?.name || 'Char 2'})`,
                        desc: 'Repeat for Character 2. Click "+ Consistent Character". Now Slot 1 = Anchor 1, Slot 2 = Anchor 2.'
                      }
                    ]
                  : []),
                {
                  id: 'step5_consistent_setup',
                  title: '5. Slot Setup for Clips',
                  desc: 'Reference Photo = Character 1 Anchor portrait. Reference Photo 2 = Character 2 Anchor portrait (from My AI Images).'
                },
                {
                  id: 'step6_clips_submitted',
                  title: '6. Generate Clips (Wave Rule: Max 5 Parallel)',
                  desc: 'Advanced Mode ON → Untick "Automatically enhance my video prompt" → Manual Video Length 8s (Multi-shot). Submit clips in order.'
                },
                {
                  id: 'step7_trimmed',
                  title: '7. Assemble & Trim Dead Air',
                  desc: 'Media Library → My AI Videos → Drag clips to Track 1 → Auto Align Clips (+|+) → Zoom in ×3 (40px/s) → Trim 12px start and 20px end → Auto Align Clips (+|+).'
                },
                {
                  id: 'step8_exported',
                  title: '8. Save & Export Video',
                  desc: 'Save as "[Title] – Consistent Character" → Click orange Export Video → High / FullHD / mp4 → Grab download link in My Videos!'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                    checklist[item.id]
                      ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-200'
                      : 'bg-[#0d0f15] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checklist[item.id]}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-purple-600 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <div className={`font-semibold ${checklist[item.id] ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d0f15] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Consistent Character Studio • Built according to the official Playbook v1.0.0
          </span>
          <div className="flex items-center gap-4 text-purple-400">
            <a
              href="https://app.videoexpress.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              app.videoexpress.ai
            </a>
            <a
              href="https://github.com/ai-playbooks/realistic-consistent-character-videos"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub Playbook
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
