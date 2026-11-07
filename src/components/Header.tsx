import React, { useState } from 'react';
import {
  Film,
  BookOpen,
  Scissors,
  Bookmark,
  FileText,
  ExternalLink,
  ChevronDown,
  Plus
} from 'lucide-react';
import { ProjectSettings } from '../types';
import { SAMPLE_PROJECTS } from '../constants/playbookRules';
import { PlaybookCheatSheetModal } from './PlaybookCheatSheetModal';
import { TrimmingGuideModal } from './TrimmingGuideModal';
import { BookmarkletModal } from './BookmarkletModal';
import { ExportScriptModal } from './ExportScriptModal';

interface HeaderProps {
  settings: ProjectSettings;
  onSelectProject: (p: ProjectSettings) => void;
  onNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onSelectProject,
  onNewProject
}) => {
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isTrimmingGuideOpen, setIsTrimmingGuideOpen] = useState(false);
  const [isBookmarkletOpen, setIsBookmarkletOpen] = useState(false);
  const [isExportScriptOpen, setIsExportScriptOpen] = useState(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0f15]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <Film size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                Consistent Character Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Playbook v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Photorealistic consistent video producer for VideoExpress
            </p>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161922] border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition"
            >
              <span className="max-w-[130px] truncate">{settings.title}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {isPresetDropdownOpen && (
              <div className="absolute left-0 mt-1 w-56 bg-[#161922] border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Sample Projects
                </div>
                {SAMPLE_PROJECTS.map((proj, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectProject(proj);
                      setIsPresetDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 transition truncate"
                  >
                    {proj.title}
                  </button>
                ))}
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    onNewProject();
                    setIsPresetDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-purple-400 hover:text-purple-300 hover:bg-slate-800/60 transition flex items-center gap-1.5"
                >
                  <Plus size={13} /> New Custom Project
                </button>
              </div>
            )}
          </div>

          {/* Quick Reference Button */}
          <button
            onClick={() => setIsCheatSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <BookOpen size={13} className="text-purple-400" />
            <span className="hidden sm:inline">Playbook</span> Rules
          </button>

          {/* Trimming Guide Button */}
          <button
            onClick={() => setIsTrimmingGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Scissors size={13} className="text-rose-400" />
            <span className="hidden sm:inline">Trimming</span> Guide
          </button>

          {/* Bookmarklet Button */}
          <button
            onClick={() => setIsBookmarkletOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Bookmark size={13} className="text-amber-400" />
            Bookmarklet
          </button>

          {/* Export Script Button */}
          <button
            onClick={() => setIsExportScriptOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-xs font-semibold text-purple-300 hover:bg-purple-600/30 transition"
          >
            <FileText size={13} />
            Export Script
          </button>

          {/* Open VideoExpress Link */}
          <a
            href="https://app.videoexpress.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition ml-1"
          >
            VideoExpress <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Modals */}
      <PlaybookCheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />
      <TrimmingGuideModal
        isOpen={isTrimmingGuideOpen}
        onClose={() => setIsTrimmingGuideOpen(false)}
        projectTitle={settings.title}
        pacing={settings.pacing}
      />
      <BookmarkletModal
        isOpen={isBookmarkletOpen}
        onClose={() => setIsBookmarkletOpen(false)}
        settings={settings}
      />
      <ExportScriptModal
        isOpen={isExportScriptOpen}
        onClose={() => setIsExportScriptOpen(false)}
        settings={settings}
      />
    </header>
  );
};
