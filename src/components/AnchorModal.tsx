import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { Character, WorldLock } from '../types';
import { generateAnchorPrompt, countWords } from '../utils/playbookGenerator';

interface AnchorModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  worldLock: WorldLock;
}

export const AnchorModal: React.FC<AnchorModalProps> = ({
  isOpen,
  onClose,
  character,
  worldLock
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const prompt = generateAnchorPrompt(character, worldLock);
  const words = countWords(prompt);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161922] border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Character Anchor Portrait Prompt
              </h3>
              <p className="text-xs text-slate-400">
                Playbook Section 5 • Generates master wardrobe & face reference for <strong className="text-purple-300">{character.name}</strong>
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
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Step by Step for VideoExpress */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              How to run this in VideoExpress:
            </h4>
            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1">
              <li>Open <strong>Create with AI</strong> → <strong>Create Video From Prompt</strong>.</li>
              <li>Clear both reference slots (trash icon).</li>
              <li>Under <strong>Reference Photo</strong>, pick <code className="bg-slate-800 text-purple-300 px-1 py-0.5 rounded">{character.name} - reference photo</code>.</li>
              <li>Ensure <strong>Use Creative mode</strong> is <strong>ALWAYS ON</strong>.</li>
              <li>Paste the anchor prompt below into <strong>Image Prompt</strong> and click <strong>Create Image</strong>.</li>
              <li>Check the 2 results against the photo. Click the closest one in the carousel (so it shows ✓), then click <strong className="text-emerald-300">+ Consistent Character</strong>.</li>
            </ol>
          </div>

          {/* Prompt Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Anchor Image Prompt</span>
                <span className="text-[11px] text-slate-500 font-normal">({words} words)</span>
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-sm transition"
              >
                {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Prompt'}
              </button>
            </div>
            <textarea
              readOnly
              value={prompt}
              rows={8}
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-purple-500 resize-none selection:bg-purple-600"
            />
          </div>

          <div className="bg-purple-950/20 border border-purple-800/30 rounded-xl p-3 text-xs text-purple-300 flex items-center justify-between">
            <span>After clicking <strong>+ Consistent Character</strong>, this anchor portrait will sit in Reference Photo slot 1 for all clip generations.</span>
            <a
              href="https://app.videoexpress.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300 underline ml-2 shrink-0"
            >
              Open VideoExpress <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-[#12141c]">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
