import React, { useState } from 'react';
import { X, Bookmark, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { ProjectSettings } from '../types';

interface BookmarkletModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
}

export const BookmarkletModal: React.FC<BookmarkletModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Generate the JavaScript bookmarklet code containing the project prompts and an overlay script
  const bookmarkletCode = `javascript:(function(){
    var existing = document.getElementById('ve-producer-copilot');
    if(existing){ existing.remove(); return; }
    var d = document.createElement('div');
    d.id = 've-producer-copilot';
    d.style.cssText = 'position:fixed;top:20px;right:20px;width:380px;max-height:85vh;overflow-y:auto;background:#161922;color:#f1f5f9;border:2px solid #8b5cf6;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,0.8);z-index:999999;font-family:sans-serif;padding:16px;font-size:12px;';
    var clips = ${JSON.stringify(
      settings.clips.map((c) => ({
        id: c.id,
        role: c.role,
        imagePrompt: c.startImagePrompt,
        videoPrompt: c.videoPrompt
      }))
    )};
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:10px;margin-bottom:12px;">' +
      '<strong style="color:#c4b5fd;font-size:14px;">🎬 Consistent Character Copilot</strong>' +
      '<button id="ve-copilot-close" style="background:#334155;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;">✕</button>' +
      '</div>';
    html += '<div style="background:#2e1065;border:1px solid #7c3aed;padding:8px;border-radius:8px;margin-bottom:12px;font-size:11px;">⚠️ <b>REMINDER:</b> Creative mode ALWAYS ON • Prompt enhancer OFF!</div>';
    clips.forEach(function(c, i){
      html += '<div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:10px;margin-bottom:10px;">' +
        '<div style="display:flex;justify-content:space-between;font-weight:bold;margin-bottom:6px;">' +
        '<span>' + c.id + ' (' + c.role + ')</span>' +
        '</div>' +
        '<button class="ve-copy-btn" data-text="' + encodeURIComponent(c.imagePrompt) + '" style="background:#6d28d9;color:#fff;border:none;padding:5px 8px;border-radius:6px;cursor:pointer;margin-right:6px;font-size:11px;">Copy Image</button>' +
        '<button class="ve-copy-btn" data-text="' + encodeURIComponent(c.videoPrompt) + '" style="background:#4338ca;color:#fff;border:none;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:11px;">Copy Video</button>' +
        '</div>';
    });
    d.innerHTML = html;
    document.body.appendChild(d);
    document.getElementById('ve-copilot-close').onclick = function(){ d.remove(); };
    var btns = d.querySelectorAll('.ve-copy-btn');
    btns.forEach(function(b){
      b.onclick = function(){
        navigator.clipboard.writeText(decodeURIComponent(b.getAttribute('data-text')));
        var orig = b.innerText;
        b.innerText = 'Copied!';
        setTimeout(function(){ b.innerText = orig; }, 1500);
      };
    });
  })();`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#161922] border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#12141c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bookmark size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                VideoExpress In-Browser Bookmarklet Copilot
              </h3>
              <p className="text-xs text-slate-400">
                1-Click floating panel right inside app.videoexpress.ai
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
        <div className="p-6 space-y-5 text-sm">
          <p className="text-xs text-slate-300 leading-relaxed">
            Drag the button below to your browser&apos;s Bookmarks bar (or copy the code). Whenever you are on <strong className="text-purple-300">app.videoexpress.ai</strong>, click it to open an instant floating drawer with all your clip prompts and one-click copy buttons right alongside the VideoExpress dialog!
          </p>

          {/* Draggable bookmark link */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#0d0f15] border border-slate-800 rounded-xl space-y-3">
            <a
              href={bookmarkletCode}
              onClick={(e) => e.preventDefault()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-grab active:cursor-grabbing border border-purple-400/30 flex items-center gap-2 select-none"
            >
              <Sparkles size={14} />
              Drag to Bookmarks: 🎬 VideoExpress Copilot
            </a>
            <span className="text-[11px] text-slate-500">
              ↑ Drag this button to your Chrome / Safari / Edge Bookmarks Bar
            </span>
          </div>

          {/* Or copy code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Or copy raw bookmarklet JavaScript:</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? 'Copied JavaScript!' : 'Copy Code'}
              </button>
            </div>
            <textarea
              readOnly
              value={bookmarkletCode}
              rows={3}
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-xl p-2.5 text-[11px] text-slate-400 font-mono resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#12141c]">
          <a
            href="https://app.videoexpress.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
          >
            Open app.videoexpress.ai <ExternalLink size={12} />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
