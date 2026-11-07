import React from 'react';
import { Compass, Film, Clock, Sparkles } from 'lucide-react';
import { ProjectSettings, VideoLength } from '../types';

interface StoryAndWorldSetupProps {
  settings: ProjectSettings;
  onUpdate: (updated: Partial<ProjectSettings>) => void;
  onRegenerateAllClips: () => void;
}

export const StoryAndWorldSetup: React.FC<StoryAndWorldSetupProps> = ({
  settings,
  onUpdate,
  onRegenerateAllClips
}) => {
  const { worldLock, format, pacing, lengthSeconds, story, title } = settings;

  // Clip calculation from Section 2c
  const clipCount = pacing === 'multi-shot'
    ? lengthSeconds === 20 ? 3 : lengthSeconds === 45 ? 6 : 4
    : lengthSeconds === 20 ? 5 : lengthSeconds === 45 ? 10 : 7;
  const clipDuration = pacing === 'multi-shot' ? 8 : 5;
  const totalRawDuration = clipCount * clipDuration;

  return (
    <div className="bg-[#161922] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
      {/* Title & Story */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Project / Video Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="e.g. Rooftop Concert Tickets"
            className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>

        <div className="md:col-span-8">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Story Premise (1–2 sentences)
          </label>
          <input
            type="text"
            value={story}
            onChange={(e) => onUpdate({ story: e.target.value })}
            placeholder="e.g. Maya surprises Liam with concert tickets to his favourite band, only for him to reveal he bought the exact same tickets."
            className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Format, Pacing, Length Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
        {/* Format */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Film size={13} className="text-purple-400" />
            Format (Aspect Ratio)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdate({ format: '9:16' })}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1.5 ${
                format === '9:16'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <span>Vertical 9:16</span>
              <span className="text-[10px] opacity-75">(Default)</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ format: '16:9' })}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition ${
                format === '16:9'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              Landscape 16:9
            </button>
          </div>
        </div>

        {/* Pacing */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Clock size={13} className="text-purple-400" />
            Pacing & Cuts
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdate({ pacing: 'multi-shot' })}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition text-left ${
                pacing === 'multi-shot'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-[11px]">Multi-shot (8s)</div>
              <div className="text-[10px] opacity-80">2–3 quick cuts / clip</div>
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ pacing: 'single-shot' })}
              className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border transition text-left ${
                pacing === 'single-shot'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              <div className="font-semibold text-[11px]">Single-shot (5s)</div>
              <div className="text-[10px] opacity-80">1 continuous take</div>
            </button>
          </div>
        </div>

        {/* Length & Clip Math */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Target Length</span>
            <span className="text-purple-400 font-mono text-[11px]">
              {clipCount} clips × {clipDuration}s = ~{totalRawDuration}s
            </span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {([20, 30, 45] as VideoLength[]).map((len) => (
              <button
                key={len}
                type="button"
                onClick={() => onUpdate({ lengthSeconds: len })}
                className={`py-1.5 rounded-lg text-xs font-medium border transition ${
                  lengthSeconds === len
                    ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
                }`}
              >
                {len}s {len === 30 ? '(Default)' : ''}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* World Lock (Section 2b) */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-purple-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              World Lock (Playbook Section 2b)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Fixed location, 3–5 landmarks, consistent lighting logic
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Location Name</label>
            <input
              type="text"
              value={worldLock.name}
              onChange={(e) => {
                const name = e.target.value;
                const fullTag = `${name.toUpperCase()} — ${worldLock.landmarks}, ${worldLock.timeOfDay}, ${worldLock.lightLogic}`;
                onUpdate({ worldLock: { ...worldLock, name, fullTag } });
              }}
              placeholder="e.g. ROOFTOP CAFÉ"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Landmarks (left/right/behind)</label>
            <input
              type="text"
              value={worldLock.landmarks}
              onChange={(e) => {
                const landmarks = e.target.value;
                const fullTag = `${worldLock.name.toUpperCase()} — ${landmarks}, ${worldLock.timeOfDay}, ${worldLock.lightLogic}`;
                onUpdate({ worldLock: { ...worldLock, landmarks, fullTag } });
              }}
              placeholder="e.g. string lights overhead, glass railing on right"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Time of Day</label>
            <input
              type="text"
              value={worldLock.timeOfDay}
              onChange={(e) => {
                const timeOfDay = e.target.value;
                const fullTag = `${worldLock.name.toUpperCase()} — ${worldLock.landmarks}, ${timeOfDay}, ${worldLock.lightLogic}`;
                onUpdate({ worldLock: { ...worldLock, timeOfDay, fullTag } });
              }}
              placeholder="e.g. late golden hour"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Light Logic</label>
            <input
              type="text"
              value={worldLock.lightLogic}
              onChange={(e) => {
                const lightLogic = e.target.value;
                const fullTag = `${worldLock.name.toUpperCase()} — ${worldLock.landmarks}, ${worldLock.timeOfDay}, ${lightLogic}`;
                onUpdate({ worldLock: { ...worldLock, lightLogic, fullTag } });
              }}
              placeholder="e.g. warm sun from frame left, soft cool fill"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* World Lock Full Preview & Regenerate Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-purple-300 font-mono bg-purple-950/30 border border-purple-800/40 px-3 py-1.5 rounded-lg w-full sm:w-auto truncate">
            {worldLock.fullTag}
          </div>

          <button
            type="button"
            onClick={onRegenerateAllClips}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/30 shrink-0 transition"
          >
            <Sparkles size={14} />
            Generate / Align All Clips
          </button>
        </div>
      </div>
    </div>
  );
};
