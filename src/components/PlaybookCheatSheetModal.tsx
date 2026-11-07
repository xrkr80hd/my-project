import React from 'react';
import { X, BookOpen, AlertTriangle, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { VIDEOEXPRESS_SETTINGS_CHECKLIST } from '../constants/playbookRules';

interface PlaybookCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaybookCheatSheetModal: React.FC<PlaybookCheatSheetModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161922] border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Consistent Character Playbook Quick Reference (v1.0.0)
              </h3>
              <p className="text-xs text-slate-400">
                Official rules and settings for VideoExpress AI video generation
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Section 4: VideoExpress Settings Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle size={15} className="text-purple-400" />
              VideoExpress Mandatory Settings Checklist (Section 4)
            </h4>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5 font-semibold">Setting</th>
                    <th className="p-2.5 font-semibold">Required Value</th>
                    <th className="p-2.5 font-semibold">Playbook Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {VIDEOEXPRESS_SETTINGS_CHECKLIST.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="p-2.5 font-sans font-medium text-white">{row.setting}</td>
                      <td className="p-2.5 text-purple-300 font-semibold">{row.value}</td>
                      <td className="p-2.5 text-slate-400 font-sans">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Golden Rules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-400" />
              The 5 Golden Rules of Consistent Characters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#0d0f15] border border-slate-800 p-3 rounded-xl space-y-1">
                <strong className="text-purple-300 block">1. Tight Face Cropping</strong>
                <p className="text-slate-400 text-[11px]">
                  Likeness fails with small or far faces. Crop reference photos tight to chest-up, front-facing, filling 50–70% of frame.
                </p>
              </div>

              <div className="bg-[#0d0f15] border border-slate-800 p-3 rounded-xl space-y-1">
                <strong className="text-purple-300 block">2. Creative Mode ALWAYS ON</strong>
                <p className="text-slate-400 text-[11px]">
                  Never generate with Creative mode off. In real tests, it produces significantly closer likeness to the real person.
                </p>
              </div>

              <div className="bg-[#0d0f15] border border-slate-800 p-3 rounded-xl space-y-1">
                <strong className="text-purple-300 block">3. Automatically Enhance Video OFF</strong>
                <p className="text-slate-400 text-[11px]">
                  VideoExpress enables video prompt enhancement by default. Untick it every time; otherwise it strips all multi-shot cuts.
                </p>
              </div>

              <div className="bg-[#0d0f15] border border-slate-800 p-3 rounded-xl space-y-1">
                <strong className="text-purple-300 block">4. Dialogue Budget: ≤8 words/shot</strong>
                <p className="text-slate-400 text-[11px]">
                  The video model lip-sync breaks on long speeches. Keep lines under 8 words, start with a 0.3s breath, and listener lips closed.
                </p>
              </div>
            </div>
          </div>

          {/* Section 11: Troubleshooting Common Issues */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle size={15} className="text-emerald-400" />
              Troubleshooting Quick Guide (Section 11)
            </h4>
            <div className="space-y-2 bg-[#0d0f15] border border-slate-800 p-3.5 rounded-xl text-[11px]">
              <div><strong>Face drifts:</strong> Make sure Creative mode is ON and the right anchor is in the slot. Remake anchor with a tighter, sharper photo.</div>
              <div><strong>Wrong person speaks:</strong> Name speaker by Short Tag right before the quote; add &quot;[listener] listens, lips closed, and does not speak&quot;.</div>
              <div><strong>No cuts appear:</strong> Confirm &quot;Automatically enhance my video prompt&quot; is OFF, and each cut is phrased &quot;A hard cut transitions to...&quot;.</div>
              <div><strong>Background music leaks:</strong> Always end video prompts with the words &quot;no music&quot;.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#12141c]">
          <a
            href="https://raw.githubusercontent.com/ai-playbooks/realistic-consistent-character-videos/main/PLAYBOOK.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
          >
            View Official Playbook on GitHub <ExternalLink size={12} />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
