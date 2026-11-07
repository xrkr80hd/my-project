import React, { useState } from 'react';
import { Camera, Crop, Sparkles, Copy, Check, User, AlertCircle, RefreshCw } from 'lucide-react';
import { Character, WorldLock } from '../types';
import { COMMON_ACCENTS } from '../constants/playbookRules';
import {
  countWords,
  buildCharacterDescription,
  buildShortTag,
  buildVoiceLock
} from '../utils/playbookGenerator';
import { PhotoCropperModal } from './PhotoCropperModal';
import { AnchorModal } from './AnchorModal';

interface CharacterCardProps {
  character: Character;
  index: number;
  worldLock: WorldLock;
  onUpdate: (updated: Character) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  index,
  worldLock,
  onUpdate,
  onRemove,
  canRemove
}) => {
  const [isCropperOpen, setIsCropperOpen] = useState<boolean>(false);
  const [isAnchorModalOpen, setIsAnchorModalOpen] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const wordCount = countWords(character.fullDescription);
  const isWordCountOptimal = wordCount >= 90 && wordCount <= 140;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setRawImageSrc(result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegenerateBible = () => {
    const desc = buildCharacterDescription(character);
    const shortTag = buildShortTag(character);
    const voiceLock = buildVoiceLock(character);
    onUpdate({
      ...character,
      fullDescription: desc,
      shortTag,
      voiceLock
    });
  };

  return (
    <div className="bg-[#161922] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col gap-4 relative">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-400">
            #{index + 1}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{character.name || `Character ${index + 1}`}</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Slot {index + 1}: {index === 0 ? 'Reference Photo' : 'Reference Photo 2'})
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAnchorModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg transition"
          >
            <Sparkles size={13} />
            Anchor Prompt
          </button>
          {canRemove && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/30 transition"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Photo & Basics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Photo Box */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="relative w-36 h-48 rounded-xl bg-slate-900 border-2 border-slate-800 overflow-hidden flex flex-col items-center justify-center group shadow-md">
            {character.croppedPhotoUrl || character.photoUrl ? (
              <>
                <img
                  src={character.croppedPhotoUrl || character.photoUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => {
                      if (character.photoUrl || character.croppedPhotoUrl) {
                        setRawImageSrc(character.photoUrl || character.croppedPhotoUrl!);
                        setIsCropperOpen(true);
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 text-white text-[11px] font-medium shadow"
                  >
                    <Crop size={12} /> Re-crop
                  </button>
                  <label className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-[11px] font-medium cursor-pointer hover:bg-slate-700">
                    <Camera size={12} /> Replace
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-slate-800/50 transition">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                  <User size={20} />
                </div>
                <span className="text-xs font-medium text-slate-300">Upload Reference Photo</span>
                <span className="text-[10px] text-slate-500 mt-1">Front-facing, sharp head & shoulders</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Name in VideoExpress: <br />
            <strong className="text-purple-400 font-mono">{character.name || 'NAME'} - reference photo</strong>
          </p>
        </div>

        {/* Form Fields */}
        <div className="md:col-span-8 grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Character Name</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => {
                const name = e.target.value;
                onUpdate({
                  ...character,
                  name,
                  fullDescription: character.fullDescription.replace(/^[A-Z0-9\s—]+—/i, `${name.toUpperCase()} —`)
                });
              }}
              placeholder="e.g. Maya"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Accent (English Only)</label>
            <select
              value={character.accent}
              onChange={(e) => {
                const accent = e.target.value;
                const voiceLock = buildVoiceLock({ ...character, accent });
                onUpdate({ ...character, accent, voiceLock });
              }}
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              {COMMON_ACCENTS.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Gender & Age</label>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={character.gender}
                onChange={(e) => onUpdate({ ...character, gender: e.target.value as Character['gender'] })}
                className="bg-[#0d0f15] border border-slate-800 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
              </select>
              <input
                type="text"
                value={character.ageRange}
                onChange={(e) => onUpdate({ ...character, ageRange: e.target.value })}
                placeholder="e.g. early 30s"
                className="bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Hair Style & Color</label>
            <input
              type="text"
              value={character.hairStyle}
              onChange={(e) => onUpdate({ ...character, hairStyle: e.target.value })}
              placeholder="e.g. shoulder-length wavy dark brown"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-slate-400 font-medium mb-1">Fixed Wardrobe (Identical Every Shot)</label>
            <input
              type="text"
              value={character.fixedOutfit}
              onChange={(e) => onUpdate({ ...character, fixedOutfit: e.target.value })}
              placeholder="e.g. rust-orange ribbed knit crewneck sweater, dark denim jeans"
              className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Character Bible & Playbook compliance */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Character Description (Playbook Section 2a)
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                isWordCountOptimal
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                  : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
              }`}
            >
              {wordCount} words {isWordCountOptimal ? '✓ (Target: 90–140)' : '(Target: 90–140 words)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRegenerateBible}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-purple-300 transition"
              title="Regenerate full sentence chain from fields"
            >
              <RefreshCw size={11} /> Format & Align
            </button>
            <button
              type="button"
              onClick={() => handleCopy(character.fullDescription, 'bible')}
              className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition"
            >
              {copiedField === 'bible' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copiedField === 'bible' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={character.fullDescription}
          onChange={(e) => onUpdate({ ...character, fullDescription: e.target.value })}
          className="w-full bg-[#0d0f15] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-purple-500 selection:bg-purple-600"
        />

        {!isWordCountOptimal && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-900/30">
            <AlertCircle size={12} className="shrink-0" />
            <span>
              Playbook requires 90–140 words verbatim in every image prompt. Click &quot;Format &amp; Align&quot; to rebalance!
            </span>
          </div>
        )}
      </div>

      {/* Short Tag & Voice Lock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-400">Short Tag (Video Prompts)</span>
            <button
              onClick={() => handleCopy(character.shortTag, 'shortTag')}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              {copiedField === 'shortTag' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
              {copiedField === 'shortTag' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={character.shortTag}
            onChange={(e) => onUpdate({ ...character, shortTag: e.target.value })}
            className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-400">Voice Lock (Verbatim Audio)</span>
            <button
              onClick={() => handleCopy(character.voiceLock, 'voiceLock')}
              className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              {copiedField === 'voiceLock' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
              {copiedField === 'voiceLock' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <input
            type="text"
            value={character.voiceLock}
            onChange={(e) => onUpdate({ ...character, voiceLock: e.target.value })}
            className="w-full bg-[#0d0f15] border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Cropper Modal */}
      {rawImageSrc && (
        <PhotoCropperModal
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          characterName={character.name}
          imageSrc={rawImageSrc}
          onSaveCropped={(croppedUrl) => {
            onUpdate({ ...character, croppedPhotoUrl: croppedUrl, photoUrl: rawImageSrc });
          }}
        />
      )}

      {/* Anchor Modal */}
      <AnchorModal
        isOpen={isAnchorModalOpen}
        onClose={() => setIsAnchorModalOpen(false)}
        character={character}
        worldLock={worldLock}
      />
    </div>
  );
};
