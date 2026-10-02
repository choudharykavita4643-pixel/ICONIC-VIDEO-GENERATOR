import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Type,
  Music,
  Sliders,
  Volume2,
  Sparkles,
  Subtitles as SubtitlesIcon,
  Check,
  Video,
} from 'lucide-react';
import {
  AspectRatioType,
  VideoPreset,
  TimelineClip,
  TextOverlay,
  SubtitleItem,
  TransitionType,
  VideoProjectData,
  Project,
} from '../../types';
import { storageService, heroImg, cyberpunkImg, jungleRobotImg } from '../../services/storageService';
import { AudioStudioEngine } from '../../utils/audioSynth';

interface VideoMakerProps {
  onSaveToProjects: (project: Project) => void;
  onSendToYouTube?: (videoData: { title: string; description: string; thumbnail: string }) => void;
}

const PRESET_CONFIGS: Record<VideoPreset, { label: string; ratio: AspectRatioType; duration: number }> = {
  'youtube-short': { label: 'YouTube Short (9:16)', ratio: '9:16', duration: 15 },
  'youtube-long': { label: 'YouTube Long Video (16:9)', ratio: '16:9', duration: 60 },
  'instagram-reel': { label: 'Instagram Reel (9:16)', ratio: '9:16', duration: 30 },
  'square-video': { label: 'Square Video (1:1)', ratio: '1:1', duration: 30 },
  'custom': { label: 'Custom Video (4:5)', ratio: '4:5', duration: 20 },
};

export const VideoMaker: React.FC<VideoMakerProps> = ({ onSaveToProjects, onSendToYouTube }) => {
  const [title, setTitle] = useState('My AI Video Creation');
  const [preset, setPreset] = useState<VideoPreset>('youtube-short');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [durationSec, setDurationSec] = useState<number>(15);

  const [clips, setClips] = useState<TimelineClip[]>([
    {
      id: 'clip_1',
      type: 'image',
      title: 'Intro Hook Scene',
      src: cyberpunkImg,
      startSec: 0,
      durationSec: 5,
      transition: 'fade',
    },
    {
      id: 'clip_2',
      type: 'image',
      title: 'Jungle Scout Reveal',
      src: jungleRobotImg,
      startSec: 5,
      durationSec: 5,
      transition: 'zoom',
    },
    {
      id: 'clip_3',
      type: 'image',
      title: 'Studio Tech Setup',
      src: heroImg,
      startSec: 10,
      durationSec: 5,
      transition: 'crossfade',
    },
  ]);

  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    {
      id: 'to_1',
      text: 'AI REVOLUTION IN 2026 🔥',
      startSec: 0.5,
      durationSec: 4.5,
      positionX: 50,
      positionY: 20,
      fontSize: 24,
      color: '#06B6D4',
      bgColor: 'rgba(0,0,0,0.7)',
    },
    {
      id: 'to_2',
      text: 'CREATOR STUDIO AI 🚀',
      startSec: 5.5,
      durationSec: 4.5,
      positionX: 50,
      positionY: 80,
      fontSize: 22,
      color: '#EC4899',
      bgColor: 'rgba(0,0,0,0.7)',
    },
  ]);

  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([
    { id: 'sub_1', startSec: 0.5, endSec: 3.5, text: 'Are you ready for next-generation content creation?' },
    { id: 'sub_2', startSec: 4.0, endSec: 8.5, text: 'Create YouTube Shorts and full videos in minutes.' },
    { id: 'sub_3', startSec: 9.0, endSec: 14.5, text: 'Hit subscribe and supercharge your production workflow!' },
  ]);

  const [bgMusic, setBgMusic] = useState<string>('Cyber Synth Wave (Royalty-Free)');
  const [bgMusicVolume, setBgMusicVolume] = useState<number>(0.3);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Handle Preset change
  const handlePresetChange = (newPreset: VideoPreset) => {
    setPreset(newPreset);
    const cfg = PRESET_CONFIGS[newPreset];
    setAspectRatio(cfg.ratio);
    setDurationSec(cfg.duration);
  };

  // Preload clip images into memory
  useEffect(() => {
    clips.forEach((clip) => {
      if (clip.src && !loadedImagesRef.current.has(clip.src)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = clip.src;
        img.onload = () => {
          loadedImagesRef.current.set(clip.src, img);
        };
      }
    });
  }, [clips]);

  // Render loop to canvas
  const renderFrame = (timeSec: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Aspect ratio dimensions
    let width = 720;
    let height = 1280; // 9:16 default
    if (aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    } else if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '4:5') {
      width = 1080;
      height = 1350;
    }

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Clear background
    ctx.fillStyle = '#070A12';
    ctx.fillRect(0, 0, width, height);

    // 1. Find active clip
    const activeClip = clips.find(
      (c) => timeSec >= c.startSec && timeSec < c.startSec + c.durationSec
    );

    if (activeClip && activeClip.src) {
      const img = loadedImagesRef.current.get(activeClip.src);
      if (img && img.complete) {
        // Calculate transition effect
        const progressInClip = (timeSec - activeClip.startSec) / activeClip.durationSec;
        let scale = 1.0;
        let alpha = 1.0;

        if (activeClip.transition === 'zoom') {
          scale = 1.0 + progressInClip * 0.08;
        } else if (activeClip.transition === 'fade') {
          if (progressInClip < 0.15) {
            alpha = progressInClip / 0.15;
          }
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        // Draw image cover with zoom center
        const imgRatio = img.width / img.height;
        const targetRatio = width / height;
        let renderW = width;
        let renderH = height;

        if (imgRatio > targetRatio) {
          renderW = height * imgRatio;
        } else {
          renderH = width / imgRatio;
        }

        renderW *= scale;
        renderH *= scale;

        const posX = (width - renderW) / 2;
        const posY = (height - renderH) / 2;

        ctx.drawImage(img, posX, posY, renderW, renderH);
        ctx.restore();
      } else {
        // Fallback color gradient while loading
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(1, '#06B6D4');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      // Dark studio placeholder
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Render Text Overlays
    textOverlays.forEach((txt) => {
      if (timeSec >= txt.startSec && timeSec <= txt.startSec + txt.durationSec) {
        ctx.save();
        ctx.font = `bold ${txt.fontSize * 1.5}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = (txt.positionX / 100) * width;
        const y = (txt.positionY / 100) * height;

        // Measure background box
        const textMetrics = ctx.measureText(txt.text);
        const paddingX = 24;
        const paddingY = 12;
        const boxW = textMetrics.width + paddingX * 2;
        const boxH = txt.fontSize * 2 + paddingY * 2;

        ctx.fillStyle = txt.bgColor;
        ctx.beginPath();
        ctx.roundRect(x - boxW / 2, y - boxH / 2, boxW, boxH, 12);
        ctx.fill();

        ctx.fillStyle = txt.color;
        ctx.fillText(txt.text, x, y);
        ctx.restore();
      }
    });

    // 3. Render Subtitles
    const activeSub = subtitles.find((s) => timeSec >= s.startSec && timeSec <= s.endSec);
    if (activeSub) {
      ctx.save();
      const subFontSize = Math.max(20, Math.floor(width * 0.038));
      ctx.font = `600 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      const subX = width / 2;
      const subY = height - 60;

      // Subtitle box
      const metrics = ctx.measureText(activeSub.text);
      const boxW = Math.min(width - 60, metrics.width + 36);
      const boxH = subFontSize * 1.8;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.beginPath();
      ctx.roundRect(subX - boxW / 2, subY - boxH + 8, boxW, boxH, 8);
      ctx.fill();

      // Golden yellow highlight text
      ctx.fillStyle = '#FDE047';
      ctx.fillText(activeSub.text, subX, subY);
      ctx.restore();
    }
  };

  // Playback timer loop
  useEffect(() => {
    let lastStamp = performance.now();

    const update = (timestamp: number) => {
      const delta = (timestamp - lastStamp) / 1000;
      lastStamp = timestamp;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    if (isPlaying) {
      lastStamp = performance.now();
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, durationSec]);

  // Re-draw whenever currentTime changes
  useEffect(() => {
    renderFrame(currentTime);
  }, [currentTime, aspectRatio, clips, textOverlays, subtitles]);

  // Add a new clip
  const handleAddClip = () => {
    const start = clips.reduce((acc, c) => acc + c.durationSec, 0);
    const newClip: TimelineClip = {
      id: `clip_${Date.now()}`,
      type: 'image',
      title: `Scene #${clips.length + 1}`,
      src: clips.length % 2 === 0 ? cyberpunkImg : jungleRobotImg,
      startSec: start,
      durationSec: 5,
      transition: 'fade',
    };
    setClips([...clips, newClip]);
    setDurationSec(Math.max(durationSec, start + 5));
  };

  // Add text overlay
  const handleAddTextOverlay = () => {
    const newText: TextOverlay = {
      id: `txt_${Date.now()}`,
      text: 'NEW VIRAL CALLOUT',
      startSec: currentTime,
      durationSec: 4,
      positionX: 50,
      positionY: 50,
      fontSize: 22,
      color: '#FFFFFF',
      bgColor: 'rgba(0, 0, 0, 0.75)',
    };
    setTextOverlays([...textOverlays, newText]);
  };

  // Add subtitle line
  const handleAddSubtitle = () => {
    const newSub: SubtitleItem = {
      id: `sub_${Date.now()}`,
      startSec: currentTime,
      endSec: Math.min(currentTime + 3, durationSec),
      text: 'New animated subtitle line',
    };
    setSubtitles([...subtitles, newSub]);
  };

  // Save project
  const handleSave = () => {
    const projectData: VideoProjectData = {
      title,
      aspectRatio,
      preset,
      durationSec,
      clips,
      textOverlays,
      subtitles,
      bgMusicName: bgMusic,
      bgMusicVolume,
    };

    const newProject: Project = {
      id: `proj_vid_${Date.now()}`,
      title,
      category: 'video',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: clips[0]?.src || cyberpunkImg,
      data: projectData,
    };

    storageService.saveProject(newProject);
    onSaveToProjects(newProject);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Export Video via MediaRecorder + HTML5 Canvas
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    setExportProgress(10);
    setIsPlaying(false);

    try {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm',
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportProgress(100);
      };

      mediaRecorder.start();

      // Step through all frames smoothly
      const totalSteps = 60;
      const stepDuration = durationSec / totalSteps;

      for (let i = 0; i <= totalSteps; i++) {
        const time = i * stepDuration;
        setCurrentTime(time);
        renderFrame(time);
        setExportProgress(Math.floor((i / totalSteps) * 90) + 10);
        await new Promise((r) => setTimeout(r, 45));
      }

      mediaRecorder.stop();
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  // Time format helper (00:00)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Bar with Title & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5"
            placeholder="Untitled Video Project"
          />
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{aspectRatio}</span>
            <span>·</span>
            <span>{clips.length} Clips</span>
            <span>·</span>
            <span>{durationSec}s Duration</span>
            <span>·</span>
            <span className="text-cyan-400 font-medium">{PRESET_CONFIGS[preset].label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved!</span>
              </>
            ) : (
              <span>Save Project</span>
            )}
          </button>

          {onSendToYouTube && (
            <button
              onClick={() =>
                onSendToYouTube({
                  title,
                  description: `Created with Creator Studio AI.\nTags: #YouTubeShorts #CreatorStudioAI`,
                  thumbnail: clips[0]?.src || cyberpunkImg,
                })
              }
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-semibold border border-red-500/30 transition"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Send to YouTube</span>
            </button>
          )}

          <button
            onClick={handleExportVideo}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? `Exporting (${exportProgress}%)` : 'Export Video'}</span>
          </button>
        </div>
      </div>

      {/* Preset & Aspect Ratio Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-900/60 rounded-xl border border-slate-800">
        {(Object.keys(PRESET_CONFIGS) as VideoPreset[]).map((pKey) => {
          const cfg = PRESET_CONFIGS[pKey];
          const isSelected = preset === pKey;
          return (
            <button
              key={pKey}
              onClick={() => handlePresetChange(pKey)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition text-center ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="truncate">{cfg.label.split('(')[0]}</div>
              <div className="text-[10px] opacity-80">{cfg.ratio}</div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace: Studio Player & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas Preview Player */}
        <div className="lg:col-span-7 flex flex-col items-center bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-6">
          <div className="w-full flex items-center justify-between pb-3 text-xs text-slate-400">
            <span>Video Viewport</span>
            <span className="font-mono tabular-nums text-slate-200">
              {formatTime(currentTime)} / {formatTime(durationSec)}
            </span>
          </div>

          {/* Interactive Screen Display Container */}
          <div
            className={`relative flex items-center justify-center bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-800/80 ${
              aspectRatio === '9:16'
                ? 'w-[270px] h-[480px] sm:w-[320px] sm:h-[568px]'
                : aspectRatio === '16:9'
                ? 'w-full aspect-video max-h-[380px]'
                : aspectRatio === '1:1'
                ? 'w-[320px] h-[320px] sm:w-[380px] sm:h-[380px]'
                : 'w-[300px] h-[375px]'
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          {/* Playback Controls & Timeline Scrubber */}
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={durationSec}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  setCurrentTime(parseFloat(e.target.value));
                  if (isPlaying) setIsPlaying(false);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
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
                  title="Rewind to start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="font-mono tabular-nums">
                  {Math.round((currentTime / durationSec) * 100)}%
                </span>
                <span className="text-slate-600">|</span>
                <span className="font-mono">{aspectRatio}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Layer Inspector & Tracks */}
        <div className="lg:col-span-5 space-y-4">
          {/* Clips List */}
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Media Clips ({clips.length})</span>
              </div>
              <button
                onClick={handleAddClip}
                className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Scene</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {clips.map((clip, idx) => (
                <div
                  key={clip.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={clip.src}
                      alt={clip.title}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                    />
                    <div>
                      <span className="font-medium text-slate-200 block truncate max-w-[150px]">
                        {idx + 1}. {clip.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {clip.startSec}s - {clip.startSec + clip.durationSec}s · {clip.transition}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={clip.transition}
                      onChange={(e) => {
                        const updated = [...clips];
                        updated[idx].transition = e.target.value as TransitionType;
                        setClips(updated);
                      }}
                      className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300"
                    >
                      <option value="fade">Fade</option>
                      <option value="crossfade">Crossfade</option>
                      <option value="zoom">Zoom</option>
                      <option value="cut">Cut</option>
                    </select>

                    {clips.length > 1 && (
                      <button
                        onClick={() => setClips(clips.filter((c) => c.id !== clip.id))}
                        className="p-1 rounded text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text Overlays & Subtitles */}
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-white">
                  Text & Subtitles ({textOverlays.length + subtitles.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddTextOverlay}
                  className="flex items-center gap-1 text-[11px] font-semibold text-pink-400 hover:text-pink-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Text</span>
                </button>
                <button
                  onClick={handleAddSubtitle}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Subtitle</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {textOverlays.map((txt, i) => (
                <div
                  key={txt.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                    <input
                      type="text"
                      value={txt.text}
                      onChange={(e) => {
                        const updated = [...textOverlays];
                        updated[i].text = e.target.value;
                        setTextOverlays(updated);
                      }}
                      className="bg-transparent text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 rounded px-1 py-0.5 text-xs w-44"
                    />
                  </div>
                  <button
                    onClick={() => setTextOverlays(textOverlays.filter((t) => t.id !== txt.id))}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {subtitles.map((sub, i) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <SubtitlesIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <input
                      type="text"
                      value={sub.text}
                      onChange={(e) => {
                        const updated = [...subtitles];
                        updated[i].text = e.target.value;
                        setSubtitles(updated);
                      }}
                      className="bg-transparent text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 py-0.5 text-xs w-44"
                    />
                  </div>
                  <button
                    onClick={() => setSubtitles(subtitles.filter((s) => s.id !== sub.id))}
                    className="p-1 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audio & Music Track */}
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-white">Audio & Music</span>
              </div>
              <button
                onClick={() => {
                  AudioStudioEngine.speak(
                    subtitles[0]?.text || 'Welcome to your next YouTube viral hit!',
                    { voiceName: 'Zephyr' }
                  );
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Background Track</label>
                <select
                  value={bgMusic}
                  onChange={(e) => setBgMusic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs"
                >
                  <option>Cyber Synth Wave (Royalty-Free)</option>
                  <option>Lo-Fi Ambient Beat (Royalty-Free)</option>
                  <option>Energetic YouTube Vlog Beat</option>
                  <option>Cinematic Dramatic Orchestral</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Music Volume</span>
                  <span className="font-mono">{Math.round(bgMusicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={bgMusicVolume}
                  onChange={(e) => setBgMusicVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
