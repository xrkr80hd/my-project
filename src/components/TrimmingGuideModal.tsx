import React, { useState } from 'react';
import { X, Scissors, AlertTriangle, Check, ExternalLink, Sparkles } from 'lucide-react';
import { TRIMMING_RULES } from '../constants/playbookRules';

interface TrimmingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  pacing: 'multi-shot' | 'single-shot';
}

export const TrimmingGuideModal: React.FC<TrimmingGuideModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  pacing
}) => {
  const [selectedClipLength, setSelectedClipLength] = useState<8 | 5>(pacing === 'multi-shot' ? 8 : 5);

  const rules = selectedClipLength === 8 ? TRIMMING_RULES.multiShot8s : TRIMMING_RULES.singleShot5s;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161922] border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Scissors size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Dead-Air Trimming &amp; Export Assistant
              </h3>
              <p className="text-xs text-slate-400">
                Playbook Section 9 • Frame-accurate timeline assembly inside VideoExpress
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Zoom & Scale Rule */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Timeline Calibration
              </div>
              <p className="text-xs text-slate-400">
                In VideoExpress, click <strong>Zoom in (🔍+) three times</strong> from default view.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-[#0d0f15] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-purple-300">
                40 px = 1.0 second
              </div>
              <div className="bg-[#0d0f15] border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-purple-300">
                1 Step ≈ 0.1 s
              </div>
            </div>
          </div>

          {/* Interactive Clip Trim Visualizer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Clip Trimming Calculator
              </h4>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setSelectedClipLength(8)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                    selectedClipLength === 8 ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  8 s Clip (Multi-shot)
                </button>
                <button
                  onClick={() => setSelectedClipLength(5)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition ${
                    selectedClipLength === 5 ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5 s Clip (Single-shot)
                </button>
              </div>
            </div>

            {/* Visual Bar Diagram */}
            <div className="bg-[#0d0f15] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="relative w-full h-14 bg-slate-800 rounded-lg overflow-hidden flex items-stretch border border-slate-700">
                {/* Start Trim Cut */}
                <div
                  style={{ width: `${(rules.startTrimSeconds / selectedClipLength) * 100}%` }}
                  className="bg-rose-500/30 border-r-2 border-rose-500 flex items-center justify-center text-[10px] text-rose-300 font-mono"
                >
                  Trim -{rules.startTrimSeconds}s
                </div>

                {/* Main Active Clip Body */}
                <div className="flex-1 bg-purple-600/30 flex items-center justify-center text-xs font-bold text-purple-200 font-mono">
                  Keep Active Clip ({rules.expectedRemaining})
                </div>

                {/* End Trim Cut */}
                <div
                  style={{ width: `${(rules.endTrimSeconds / selectedClipLength) * 100}%` }}
                  className="bg-rose-500/30 border-l-2 border-rose-500 flex items-center justify-center text-[10px] text-rose-300 font-mono"
                >
                  Trim -{rules.endTrimSeconds}s
                </div>
              </div>

              {/* Exact Trim Spec */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                  <span className="text-slate-400 text-[11px] block">Left Edge (Start Dead Air):</span>
                  <span className="text-rose-400 font-bold font-mono text-sm">
                    Drag right {rules.startTrimPixels} px (-{rules.startTrimSeconds} s)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Cuts the initial frozen setup frame before motion starts</p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                  <span className="text-slate-400 text-[11px] block">Right Edge (End Dead Air):</span>
                  <span className="text-rose-400 font-bold font-mono text-sm">
                    Drag left {rules.endTrimPixels} px (-{rules.endTrimSeconds} s)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Cuts the frozen hold after the last word/action</p>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Rules for VideoExpress */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Essential Timeline Warnings (Section 9)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-1">
                <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-400" />
                  Auto Align Clips (+|+)
                </div>
                <p className="text-[11px] text-slate-400">
                  Always click <strong>Auto Align Clips (+|+)</strong> at the left of track 1 immediately after making any trim to snap all clips together with zero black frames.
                </p>
              </div>

              <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-xl space-y-1">
                <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-rose-400" />
                  Beware Track Trash Icon!
                </div>
                <p className="text-[11px] text-slate-400">
                  The trash icon on the far left deletes the <em>entire track</em>. To delete a single clip, right-click it → Delete.
                </p>
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="bg-[#0d0f15] border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Check size={14} className="text-emerald-400" />
              Final Export Settings:
            </h4>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>Save project as: <code className="text-purple-300 font-mono font-semibold">{projectTitle || 'Project'} – Consistent Character</code></li>
              <li>Click the orange <strong>Export Video</strong> button.</li>
              <li>Preset: <strong>High</strong> • Resolution: <strong>FullHD</strong> (1080×1920) • Format: <strong>mp4</strong>.</li>
              <li>Export queues on server (30–60s). Check <strong>My Videos</strong> for download link!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#12141c]">
          <a
            href="https://app.videoexpress.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition"
          >
            Go to VideoExpress Editor <ExternalLink size={13} />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
