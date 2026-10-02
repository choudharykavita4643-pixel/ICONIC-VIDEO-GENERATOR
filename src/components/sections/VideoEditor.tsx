import React, { useState, useRef, useEffect } from 'react';
import {
  Scissors,
  Play,
  Pause,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderPlus,
  Check,
  Type,
  Music,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { TimelineClip, TextOverlay, SubtitleItem, Project } from '../../types';
import { storageService, heroImg, cyberpunkImg, jungleRobotImg } from '../../services/storageService';

interface VideoEditorProps {
  onSaveToProjects: (project: Project) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({ onSaveToProjects }) => {
  const [projectTitle, setProjectTitle] = useState('YouTube Quick Cut Timeline');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string>('clip_1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Timeline Clips
  const [clips, setClips] = useState<TimelineClip[]>([
    {
      id: 'clip_1',
      type: 'image',
      title: 'Hook - Cyber City',
      src: cyberpunkImg,
      startSec: 0,
      durationSec: 4,
      transition: 'fade',
    },
    {
      id: 'clip_2',
      type: 'image',
      title: 'Action - Jungle Robot',
      src: jungleRobotImg,
      startSec: 4,
      durationSec: 5,
      transition: 'zoom',
    },
    {
      id: 'clip_3',
      type: 'image',
      title: 'Outro - Studio Rig',
      src: heroImg,
      startSec: 9,
      durationSec: 4,
      transition: 'crossfade',
    },
  ]);

  // Text & Subtitles
  const [textTrack, setTextTrack] = useState<TextOverlay[]>([
    {
      id: 'txt_ed_1',
      text: 'WATCH THIS TRANSFORMATION ⚡',
      startSec: 0.5,
      durationSec: 3.5,
      positionX: 50,
      positionY: 25,
      fontSize: 22,
      color: '#06B6D4',
      bgColor: 'rgba(0,0,0,0.7)',
    },
  ]);

  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([
    { id: 'sub_ed_1', startSec: 0.5, endSec: 3.8, text: 'The secret to viral retention is fast visual pacing.' },
    { id: 'sub_ed_2', startSec: 4.2, endSec: 8.5, text: 'Cut out dead space and change angles every 3-5 seconds.' },
  ]);

  const [musicTrackName, setMusicTrackName] = useState('Upbeat Tech Vlog (Royalty-Free)');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalDuration = clips.reduce((acc, c) => acc + c.durationSec, 0) || 15;

  // Selected Clip
  const selectedClip = clips.find((c) => c.id === selectedClipId) || clips[0];

  // Playback timer loop
  useEffect(() => {
    let timer: number | null = null;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalDuration]);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 16:9 canvas preview
    canvas.width = 1280;
    canvas.height = 720;

    // Clear
    ctx.fillStyle = '#070A12';
    ctx.fillRect(0, 0, 1280, 720);

    // Active Clip
    let accumulated = 0;
    let activeClip = clips[0];
    for (const clip of clips) {
      if (currentTime >= accumulated && currentTime < accumulated + clip.durationSec) {
        activeClip = clip;
        break;
      }
      accumulated += clip.durationSec;
    }

    if (activeClip && activeClip.src) {
      const img = new Image();
      img.src = activeClip.src;
      if (img.complete) {
        ctx.drawImage(img, 0, 0, 1280, 720);
      } else {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 1280, 720);
        };
      }
    }

    // Text Overlay
    textTrack.forEach((t) => {
      if (currentTime >= t.startSec && currentTime <= t.startSec + t.durationSec) {
        ctx.save();
        ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, (t.positionX / 100) * 1280, (t.positionY / 100) * 720);
        ctx.restore();
      }
    });

    // Subtitles
    const sub = subtitles.find((s) => currentTime >= s.startSec && currentTime <= s.endSec);
    if (sub) {
      ctx.save();
      ctx.font = "600 28px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.fillText(sub.text, 640, 660);
      ctx.restore();
    }
  }, [currentTime, clips, textTrack, subtitles]);

  // Clip actions: Split at Playhead
  const handleSplitClip = () => {
    let accumulated = 0;
    const clipIndex = clips.findIndex((c) => {
      const match = currentTime >= accumulated && currentTime < accumulated + c.durationSec;
      accumulated += c.durationSec;
      return match;
    });

    if (clipIndex === -1) return;
    const target = clips[clipIndex];
    const offsetInClip = currentTime - target.startSec;

    // Only split if offset is at least 1s inside
    if (offsetInClip <= 1 || target.durationSec - offsetInClip <= 1) return;

    const firstHalf: TimelineClip = {
      ...target,
      durationSec: Math.floor(offsetInClip * 10) / 10,
    };

    const secondHalf: TimelineClip = {
      id: `clip_${Date.now()}`,
      type: target.type,
      title: `${target.title} (Part 2)`,
      src: target.src,
      startSec: Math.floor(currentTime * 10) / 10,
      durationSec: Math.floor((target.durationSec - offsetInClip) * 10) / 10,
      transition: 'cut',
    };

    const updated = [...clips];
    updated.splice(clipIndex, 1, firstHalf, secondHalf);
    recalculateStartTimes(updated);
  };

  // Trim selected clip duration
  const handleTrimClip = (deltaSec: number) => {
    if (!selectedClip) return;
    const newDur = Math.max(1, selectedClip.durationSec + deltaSec);
    const updated = clips.map((c) => (c.id === selectedClip.id ? { ...c, durationSec: newDur } : c));
    recalculateStartTimes(updated);
  };

  // Reorder clips: Move Left
  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const updated = [...clips];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    recalculateStartTimes(updated);
  };

  // Reorder clips: Move Right
  const handleMoveRight = (index: number) => {
    if (index >= clips.length - 1) return;
    const updated = [...clips];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    recalculateStartTimes(updated);
  };

  // Delete clip
  const handleDeleteClip = (id: string) => {
    if (clips.length <= 1) return;
    const updated = clips.filter((c) => c.id !== id);
    recalculateStartTimes(updated);
  };

  // Helper to re-sync start times sequentially
  const recalculateStartTimes = (list: TimelineClip[]) => {
    let running = 0;
    const normalized = list.map((c) => {
      const fixed = { ...c, startSec: running };
      running += c.durationSec;
      return fixed;
    });
    setClips(normalized);
  };

  // Add new media clip
  const handleAddMedia = () => {
    const newClip: TimelineClip = {
      id: `clip_${Date.now()}`,
      type: 'image',
      title: `B-Roll Scene ${clips.length + 1}`,
      src: clips.length % 2 === 0 ? heroImg : cyberpunkImg,
      startSec: totalDuration,
      durationSec: 4,
      transition: 'fade',
    };
    recalculateStartTimes([...clips, newClip]);
  };

  const handleSaveToProjects = () => {
    const projectData = {
      title: projectTitle,
      clips,
      textTrack,
      subtitles,
      musicTrackName,
      totalDuration,
    };

    const newProject: Project = {
      id: `proj_ed_${Date.now()}`,
      title: projectTitle,
      category: 'video',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: clips[0]?.src || heroImg,
      data: projectData,
    };

    storageService.saveProject(newProject);
    onSaveToProjects(newProject);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="text-lg font-bold bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5"
          />
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{clips.length} Clips</span>
            <span>·</span>
            <span>Total: {formatSec(totalDuration)}</span>
            <span>·</span>
            <span className="text-cyan-400">Reliable Quick Timeline</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToProjects}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Save Project</span>
              </>
            )}
          </button>

          <button
            onClick={() => alert(`Exporting ${projectTitle} (${formatSec(totalDuration)})`)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Render</span>
          </button>
        </div>
      </div>

      {/* Editor Screen & Controls */}
      <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center">
        {/* Canvas Monitor */}
        <div className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        </div>

        {/* Timeline Transport Bar */}
        <div className="w-full max-w-3xl mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Return to start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs font-mono tabular-nums text-slate-300">
            <span className="text-cyan-400 font-semibold">{formatSec(currentTime)}</span> / {formatSec(totalDuration)}
          </div>

          {/* Quick Editing Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSplitClip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              title="Split clip at playhead"
            >
              <Scissors className="w-3.5 h-3.5 text-cyan-400" />
              <span>Split</span>
            </button>

            <button
              onClick={handleAddMedia}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Clip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multitrack Timeline Canvas */}
      <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-300">Multitrack Timeline</span>
          <span className="text-[11px] font-mono text-slate-400">Click a clip to trim or reorder</span>
        </div>

        {/* Track 1: Video / Image Clips */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Video Track (V1)</span>
          </div>

          <div className="grid grid-flow-col auto-cols-fr gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto min-h-[90px]">
            {clips.map((clip, index) => {
              const isSelected = clip.id === selectedClipId;
              return (
                <div
                  key={clip.id}
                  onClick={() => setSelectedClipId(clip.id)}
                  className={`group relative p-2.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={clip.src}
                      alt={clip.title}
                      className="w-8 h-8 rounded object-cover border border-slate-700"
                    />
                    <div className="truncate">
                      <span className="text-xs font-medium text-slate-200 block truncate">
                        {clip.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {clip.durationSec}s · {clip.transition}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveLeft(index);
                        }}
                        disabled={index === 0}
                        className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveRight(index);
                        }}
                        disabled={index === clips.length - 1}
                        className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClip(clip.id);
                      }}
                      className="p-0.5 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Clip Trimmer */}
        {selectedClip && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-slate-200">Selected: {selectedClip.title}</span>
              <span className="text-slate-400">({selectedClip.durationSec}s)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Trim Length:</span>
              <button
                onClick={() => handleTrimClip(-1)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                -1s
              </button>
              <button
                onClick={() => handleTrimClip(1)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                +1s
              </button>
            </div>
          </div>
        )}

        {/* Track 2: Text & Overlay Track */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Type className="w-3.5 h-3.5 text-pink-400" />
            <span>Overlay Text (T1)</span>
          </div>

          <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center gap-2 overflow-x-auto min-h-[46px]">
            {textTrack.map((t) => (
              <div
                key={t.id}
                className="px-3 py-1.5 rounded-lg bg-pink-950/30 border border-pink-500/40 text-pink-300 text-xs font-medium flex items-center gap-2 shrink-0"
              >
                <span>{t.text}</span>
                <span className="text-[10px] text-pink-400/80 font-mono">({t.durationSec}s)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3: Audio & Music Track */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audio & Music (A1)</span>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>{musicTrackName}</span>
            </div>
            <span className="text-slate-400 font-mono">{formatSec(totalDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
