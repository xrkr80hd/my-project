import React, { useState } from 'react';
import { Copy, Check, Sparkles, CheckCircle2, Sliders, MessageSquare, Film } from 'lucide-react';
import { Clip, Character, WorldLock } from '../types';
import { validatePrompt, countWords, generateVideoPrompt, generateStartImagePrompt } from '../utils/playbookGenerator';

interface ClipEditorProps {
  clips: Clip[];
  characters: Character[];
  worldLock: WorldLock;
  pacing: 'multi-shot' | 'single-shot';
  onUpdateClip: (index: number, updated: Clip) => void;
}

export const ClipEditor: React.FC<ClipEditorProps> = ({
  clips,
  characters,
  worldLock,
  pacing,
  onUpdateClip
}) => {
  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'shots'>('video');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const activeClip = clips[activeClipIndex] || clips[0];
  if (!activeClip) return null;

  const videoValidation = validatePrompt(activeClip.videoPrompt, 'video', activeClip.duration);
  const imageValidation = validatePrompt(activeClip.startImagePrompt, 'image');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2200);
  };

  const handleRegeneratePrompts = () => {
    const startImg = generateStartImagePrompt(
      activeClip.number,
      characters,
      activeClip.visibleCharacterIds,
      worldLock
    );
    const vidPrompt = generateVideoPrompt(
      activeClip.number,
      activeClip.role,
      activeClip.duration,
      characters,
      activeClip.visibleCharacterIds,
      activeClip.speakerId,
      activeClip.role === 'hook' ? "Front row. Tonight. Don't say you're busy." : '',
      worldLock,
      pacing
    );

    onUpdateClip(activeClipIndex, {
      ...activeClip,
      startImagePrompt: startImg,
      videoPrompt: vidPrompt
    });
  };

  const roleColors: Record<Clip['role'], { bg: string; text: string; border: string }> = {
    hook: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/60' },
    escalation: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/60' },
    twist: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/60' },
    payoff: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-800/60' }
  };

  return (
    <div className="bg-[#161922] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Top Header & Clips Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Video & Image Prompts Workbench</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              {clips.length} Clips Total
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict compliance with Playbook Sections 6, 7 & 8 for VideoExpress
          </p>
        </div>

        {/* Clip Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0d0f15] p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {clips.map((c, idx) => {
            const roleStyle = roleColors[c.role];
            const isSelected = idx === activeClipIndex;
            return (
              <button
                key={c.id}
                onClick={() => setActiveClipIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{c.id}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-purple-800 text-purple-200' : `${roleStyle.bg} ${roleStyle.text}`
                  }`}
                >
                  {c.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Clip Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-sm text-purple-400">
            {activeClip.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{activeClip.title}</h4>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md font-mono border ${roleColors[activeClip.role].bg} ${roleColors[activeClip.role].text} ${roleColors[activeClip.role].border}`}>
                {activeClip.role}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeClip.duration}s duration
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Visible: {activeClip.visibleCharacterIds.map((id) => characters.find((c) => c.id === id)?.name || id).join(' & ')}
            </p>
          </div>
        </div>

        {/* Validation Score & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0d0f15] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Playbook Score:</span>
            <span
              className={`text-xs font-mono font-bold ${
                videoValidation.score >= 90
                  ? 'text-emerald-400'
                  : videoValidation.score >= 70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {videoValidation.score}%
            </span>
          </div>

          <button
            onClick={handleRegeneratePrompts}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            title="Recalculate prompt texts"
          >
            <Sparkles size={13} className="text-purple-400" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Tabs: Video Prompt vs Start Image Prompt vs Shot Breakdown */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('video')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'video'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film size={14} />
          Video and Audio Prompt
          <span className="text-[10px] font-mono opacity-80">({countWords(activeClip.videoPrompt)} words)</span>
        </button>

        <button
          onClick={() => setActiveTab('image')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'image'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={14} />
          Start Image Prompt (Frame 1)
          <span className="text-[10px] font-mono opacity-80">({countWords(activeClip.startImagePrompt)} words)</span>
        </button>

        <button
          onClick={() => setActiveTab('shots')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            activeTab === 'shots'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders size={14} />
          Shot Beats & Dialogue
        </button>
      </div>

      {/* Tab 1: Video and Audio Prompt */}
      {activeTab === 'video' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Paste into VideoExpress &quot;Video and Audio Prompt&quot;
              </span>
              <span className="text-[11px] text-slate-500">
                (Advanced Mode ON → &quot;Automatically enhance my video prompt&quot; UNTICKED)
              </span>
            </div>

            <button
              onClick={() => handleCopy(activeClip.videoPrompt, 'video')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-sm transition"
            >
              {copiedType === 'video' ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              {copiedType === 'video' ? 'Copied for VideoExpress!' : 'Copy Video Prompt'}
            </button>
          </div>

          <textarea
            rows={5}
            value={activeClip.videoPrompt}
            onChange={(e) => onUpdateClip(activeClipIndex, { ...activeClip, videoPrompt: e.target.value })}
            className="w-full bg-[#0d0f15] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-purple-500 selection:bg-purple-600"
          />

          {/* Real-time Playbook Linter / Compliance Box */}
          <div className="bg-[#11131a] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Playbook Rule Inspector (Section 7)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {videoValidation.checks.map((check, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded-lg border ${
                    check.passed
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
                      : check.severity === 'error'
                      ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                      : 'bg-amber-950/30 border-amber-900/50 text-amber-300'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {check.passed ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <span className="text-[11px] font-bold">⚠️</span>
                    )}
                  </span>
                  <div>
                    <div className="font-semibold text-[11px]">{check.name}</div>
                    <div className="text-[10px] opacity-80">{check.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Start Image Prompt */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Paste into VideoExpress &quot;Image Prompt&quot;
              </span>
              <span className="text-[11px] text-slate-500">
                (Creative Mode: ALWAYS ON • Format: Vertical 9:16)
              </span>
            </div>

            <button
              onClick={() => handleCopy(activeClip.startImagePrompt, 'image')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-sm transition"
            >
              {copiedType === 'image' ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              {copiedType === 'image' ? 'Copied for VideoExpress!' : 'Copy Start Image Prompt'}
            </button>
          </div>

          <textarea
            rows={5}
            value={activeClip.startImagePrompt}
            onChange={(e) => onUpdateClip(activeClipIndex, { ...activeClip, startImagePrompt: e.target.value })}
            className="w-full bg-[#0d0f15] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-purple-500 selection:bg-purple-600"
          />

          {/* Image Prompt Linter */}
          <div className="bg-[#11131a] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Image Playbook Checklist (Section 4 & 6)
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {imageValidation.checks.map((check, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded-lg border ${
                    check.passed
                      ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
                      : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {check.passed ? <Check size={13} className="text-emerald-400" /> : '⚠️'}
                  </span>
                  <div>
                    <div className="font-semibold text-[11px]">{check.name}</div>
                    <div className="text-[10px] opacity-80">{check.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shots Breakdown */}
      {activeTab === 'shots' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Shot-by-Shot Timing &amp; Action Flow ({activeClip.duration}s total)
            </span>
            <span className="text-[11px] text-slate-500">
              Dialogue Rule: Max 1 quote per shot, max 8 words per quote
            </span>
          </div>

          <div className="space-y-2.5">
            {activeClip.shots.map((shot, idx) => (
              <div
                key={shot.id}
                className="bg-[#0d0f15] border border-slate-800 rounded-xl p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-300 text-xs">
                    {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{shot.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({shot.camera})</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{shot.action}</div>
                  </div>
                </div>

                {shot.speakerId && (
                  <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                    <MessageSquare size={13} className="text-purple-400" />
                    <span className="text-purple-300 font-medium">
                      {characters.find((c) => c.id === shot.speakerId)?.name || 'Speaker'}:
                    </span>
                    <span className="text-slate-300 italic">&quot;{shot.dialogue || 'Front row. Tonight.'}&quot;</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
