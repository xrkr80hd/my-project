import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText } from 'lucide-react';
import { ProjectSettings } from '../types';
import { generateAnchorPrompt } from '../utils/playbookGenerator';

interface ExportScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
}

export const ExportScriptModal: React.FC<ExportScriptModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const castSummary = settings.characters
    .map((c) => `${c.name} (${c.accent})`)
    .join(' · ');

  // Build the complete markdown playbook script
  const markdownContent = `# 🎬 ${settings.title} — VideoExpress Production Script

> 🎬 **${settings.title}** · Realistic · ${settings.format} · ~${settings.lengthSeconds} s · ${settings.clips.length} clips · ${settings.pacing === 'multi-shot' ? 'Multi-shot' : 'Single-shot'}  
> **Cast:** ${castSummary}  
> **Hook:** ${settings.story}  

---

## 1. WORLD LOCK
\`\`\`
${settings.worldLock.fullTag}
\`\`\`

---

## 2. CAST & CHARACTER BIBLES

${settings.characters
  .map(
    (c, i) => `### Character ${i + 1}: ${c.name}
- **Short Tag:** \`${c.shortTag}\`
- **Voice Lock:** \`${c.voiceLock}\`
- **Reference Slot:** ${i === 0 ? 'Reference Photo (Slot 1)' : 'Reference Photo 2 (Slot 2)'}

**Description (Verbatim in image prompts):**
\`\`\`
${c.fullDescription}
\`\`\`

**Anchor Portrait Prompt (Chest-up, Creative Mode ALWAYS ON):**
\`\`\`
${generateAnchorPrompt(c, settings.worldLock)}
\`\`\`
`
  )
  .join('\n\n')}

---

## 3. CLIPS GENERATION RUN SHEET

${settings.clips
  .map(
    (c) => `### ${c.id} — ${c.title} (${c.duration}s, ${c.role.toUpperCase()})

#### Start Image Prompt (Creative Mode: ON, Photorealistic Cinematic):
\`\`\`
${c.startImagePrompt}
\`\`\`

#### Video and Audio Prompt (Advanced Mode: ON, Video Enhancer: OFF):
\`\`\`
${c.videoPrompt}
\`\`\`
`
  )
  .join('\n\n')}

---

## 4. TIMELINE ASSEMBLY & DEAD-AIR TRIMMING
1. Add clips in sequential order (C01, C02, ...) onto Track 1.
2. Click **Auto Align Clips** (\`+||\`).
3. Zoom in ×3 (40 px = 1 second).
4. Trim Start dead air: drag left edge rightward by 12 px (-0.3 s).
5. Trim End dead air: drag right edge leftward by 20 px (-0.5 s).
6. Click **Auto Align Clips** (\`+||\`).
7. Save project as \`${settings.title} – Consistent Character\`.
8. Click **Export Video** → High / FullHD (1080×1920) / mp4.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${settings.title.toLowerCase().replace(/\s+/g, '-')}-playbook-script.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${settings.title.toLowerCase().replace(/\s+/g, '-')}-project.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161922] border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Production Card &amp; Full Script Export
              </h3>
              <p className="text-xs text-slate-400">
                Complete production package ready for VideoExpress
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
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Production Card Preview */}
          <div className="bg-[#0d0f15] border border-purple-500/40 rounded-xl p-4 space-y-1.5 font-mono text-xs text-purple-200">
            <div className="font-bold text-white">
              🎬 {settings.title} · Realistic · {settings.format} · ~{settings.lengthSeconds} s · {settings.clips.length} clips · {settings.pacing === 'multi-shot' ? 'Multi-shot' : 'Single-shot'}
            </div>
            <div><strong>Cast:</strong> {castSummary}</div>
            <div><strong>Hook:</strong> {settings.story}</div>
          </div>

          {/* Full Markdown Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Full Markdown Production Document</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
              >
                {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                {copied ? 'Copied Full Script!' : 'Copy Markdown'}
              </button>
            </div>
            <textarea
              readOnly
              value={markdownContent}
              rows={14}
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#12141c]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMd}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              <Download size={13} />
              Download Script (.md)
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            >
              <Download size={13} />
              Download Project (.json)
            </button>
          </div>

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
