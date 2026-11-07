import React from 'react';
import { Layers, Play, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Clip } from '../types';

interface WaveTrackerProps {
  clips: Clip[];
  onUpdateClipStatus: (clipIndex: number, status: Clip['status'], progress: number, videoId?: string) => void;
}

export const WaveTracker: React.FC<WaveTrackerProps> = ({
  clips,
  onUpdateClipStatus
}) => {
  const renderingClips = clips.filter((c) => c.status === 'rendering');
  const slotsUsed = renderingClips.length;
  const maxSlots = 5;
  const isLimitReached = slotsUsed >= maxSlots;

  const handleStartRender = (idx: number) => {
    if (isLimitReached) return;
    onUpdateClipStatus(idx, 'rendering', 15);
  };

  const handleComplete = (idx: number) => {
    onUpdateClipStatus(idx, 'completed', 100);
  };

  const handleReset = (idx: number) => {
    onUpdateClipStatus(idx, 'ready', 0);
  };

  return (
    <div className="bg-[#161922] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers size={16} className="text-purple-400" />
            <span>VideoExpress Wave Manager (5-Parallel Limit)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Playbook Section 8 • Tracks live render slots to prevent &quot;Up to 5 AI videos in parallel&quot; refusal errors
          </p>
        </div>

        {/* Slot usage meter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0d0f15] px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Parallel Slots:</span>
            <span
              className={`font-mono font-bold text-xs ${
                isLimitReached ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {slotsUsed} / {maxSlots} Active
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((slot) => (
              <div
                key={slot}
                className={`w-3 h-5 rounded-sm transition ${
                  slot <= slotsUsed
                    ? isLimitReached
                      ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                      : 'bg-purple-500 shadow-sm shadow-purple-500/50'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {isLimitReached && (
        <div className="bg-rose-950/30 border border-rose-900/50 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-300">
          <AlertTriangle size={16} className="text-rose-400 shrink-0" />
          <span>
            <strong>5-Parallel limit reached!</strong> Do not submit another clip yet in VideoExpress. Wait for one rendering clip to finish (or mark it completed below) before clicking Create Video on the next clip.
          </span>
        </div>
      )}

      {/* Clips Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {clips.map((clip, idx) => {
          const isRendering = clip.status === 'rendering';
          const isCompleted = clip.status === 'completed';

          return (
            <div
              key={clip.id}
              className={`p-3 rounded-xl border text-xs flex flex-col justify-between transition ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-900/40'
                  : isRendering
                  ? 'bg-purple-950/30 border-purple-500/40 shadow-md shadow-purple-950/40'
                  : 'bg-[#0d0f15] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-white text-sm">{clip.id}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                    isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : isRendering
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {clip.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                {clip.title}
              </div>

              {/* Progress bar if rendering */}
              {isRendering && (
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[10px] text-purple-300">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="animate-spin text-purple-400" />
                      Rendering in VideoExpress
                    </span>
                    <span>{clip.renderProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${clip.renderProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-auto">
                {!isRendering && !isCompleted && (
                  <button
                    onClick={() => handleStartRender(idx)}
                    disabled={isLimitReached}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition text-[11px]"
                  >
                    <Play size={12} />
                    Mark Rendering
                  </button>
                )}

                {isRendering && (
                  <button
                    onClick={() => handleComplete(idx)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition text-[11px]"
                  >
                    <CheckCircle size={12} />
                    Mark Finished ✓
                  </button>
                )}

                {isCompleted && (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                      <CheckCircle size={12} /> Ready for timeline
                    </span>
                    <button
                      onClick={() => handleReset(idx)}
                      className="text-slate-500 hover:text-slate-300 p-1"
                      title="Reset status"
                    >
                      <RefreshCw size={11} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
        <span>
          💡 <strong>Wave Rule:</strong> Multi-shot 30s videos are 4 clips, which fits completely in 1 wave. Check <strong>Media Library → My AI Videos</strong> in VideoExpress to see the % ring update.
        </span>
      </div>
    </div>
  );
};
