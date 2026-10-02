import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Play,
  Pause,
  Download,
  FolderPlus,
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { GeneratedAudio, Project } from '../../types';
import { geminiService } from '../../services/geminiService';
import { storageService, heroImg } from '../../services/storageService';
import { AudioStudioEngine } from '../../utils/audioSynth';

interface AudioGeneratorProps {
  initialText?: string;
  onSaveToProjects: (project: Project) => void;
}

const VOICES = [
  { id: 'Zephyr', name: 'Zephyr (Warm & Dynamic Anchor)', gender: 'Female' },
  { id: 'Kore', name: 'Kore (Calm & Professional Explainer)', gender: 'Female' },
  { id: 'Puck', name: 'Puck (High-Energy & Youthful Vlog)', gender: 'Male' },
  { id: 'Charon', name: 'Charon (Deep & Cinematic Narrative)', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir (Bold & Powerful Commercial)', gender: 'Male' },
];

const LANGUAGES = ['English (US)', 'English (UK)', 'Spanish', 'Hindi', 'French', 'German', 'Japanese'];

export const AudioGenerator: React.FC<AudioGeneratorProps> = ({
  initialText = 'Welcome to Creator Studio AI! Your ultimate YouTube content suite.',
  onSaveToProjects,
}) => {
  const [text, setText] = useState(initialText);
  const [selectedVoice, setSelectedVoice] = useState('Zephyr');
  const [selectedLang, setSelectedLang] = useState('English (US)');
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Waveform canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Update text if initialText changes
  useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  // Animated Waveform loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const numBars = 48;
      const barWidth = w / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight = 4;
        if (isPlaying) {
          // Dynamic sine wave modulation
          const sinVal = Math.sin(i * 0.3 + phase);
          const cosVal = Math.cos(i * 0.2 - phase * 1.5);
          barHeight = Math.max(6, Math.abs(sinVal * cosVal) * (h * 0.85));
        }

        const x = i * (barWidth + 2);
        const y = (h - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        grad.addColorStop(0, '#06B6D4');
        grad.addColorStop(1, '#8B5CF6');

        ctx.fillStyle = isPlaying ? grad : '#1E293B';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
      }

      phase += 0.08;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Play / Preview audio
  const handleTogglePlay = async () => {
    if (isPlaying) {
      AudioStudioEngine.stopSpeech();
      setIsPlaying(false);
      return;
    }

    if (!text.trim()) return;

    setIsPlaying(true);
    setIsSynthesizing(true);

    try {
      // 1. Try Gemini TTS API first
      const res = await geminiService.generateSpeech(text, selectedVoice);
      if (res.audioUrl) {
        setAudioUrl(res.audioUrl);
        const audio = new Audio(res.audioUrl);
        audio.playbackRate = speed;
        audio.onended = () => setIsPlaying(false);
        audio.play();
        setIsSynthesizing(false);
        return;
      }
    } catch {
      // Fallback
    }

    // 2. Free-first local Web Speech API synthesis
    setIsSynthesizing(false);
    AudioStudioEngine.speak(text, {
      voiceName: selectedVoice,
      rate: speed,
      pitch: pitch,
      onEnd: () => setIsPlaying(false),
    });
  };

  const handleDownload = async () => {
    // Generate an offline WAV loop or use audioUrl
    let downloadUrl = audioUrl;
    if (!downloadUrl) {
      downloadUrl = await AudioStudioEngine.createLoFiLoopWav();
    }
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `voiceover_${selectedVoice.toLowerCase()}_${Date.now()}.wav`;
    a.click();
  };

  const handleSaveToProjects = () => {
    const audioData: GeneratedAudio = {
      id: `aud_${Date.now()}`,
      text,
      voice: selectedVoice,
      audioUrl: audioUrl || '',
      durationSec: Math.max(3, Math.ceil(text.split(' ').length / 2.5)),
      createdAt: new Date().toISOString(),
    };

    const newProject: Project = {
      id: `proj_aud_${Date.now()}`,
      title: `Voiceover: ${text.slice(0, 30)}...`,
      category: 'audio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: heroImg,
      data: audioData,
    };

    storageService.saveProject(newProject);
    onSaveToProjects(newProject);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Audio Text-to-Speech Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesize studio-grade voiceovers using Gemini TTS & zero-latency local speech engines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audio</span>
          </button>

          <button
            onClick={handleSaveToProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
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
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Text Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Script / Narration Text
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {text.split(/\s+/).filter(Boolean).length} words · ~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 2.5)}s
              </span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none leading-relaxed"
              placeholder="Paste or write your voiceover narration here..."
            />

            {/* Waveform Visualizer Screen */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Dynamic Frequency Visualizer</span>
                <span className="font-mono text-cyan-400">
                  {isPlaying ? 'STREAMING AUDIO' : 'READY'}
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={500}
                height={60}
                className="w-full h-14 bg-[#070A12] rounded-lg"
              />

              {/* Master Playback Controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition active:scale-95"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 ml-0.5" />
                        <span>Play Voiceover</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      AudioStudioEngine.stopSpeech();
                      setIsPlaying(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Reset playback"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  <span>Voice: {selectedVoice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Voice Settings & Sliders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">Voice & Modulation</span>
            </div>

            {/* Voice List */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select AI Persona Voice
              </label>
              <div className="space-y-2">
                {VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition ${
                      selectedVoice === v.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedVoice === v.id ? 'bg-cyan-400' : 'bg-slate-600'
                        }`}
                      />
                      <span className="font-medium text-slate-200">{v.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{v.gender}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Speed Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Pacing / Speed</span>
                <span className="font-mono text-cyan-400">{speed}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.5x (Slow)</span>
                <span>1.0x (Natural)</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Vocal Pitch</span>
                <span className="font-mono text-purple-400">{pitch}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.1}
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Deep (-50%)</span>
                <span>Normal</span>
                <span>Bright (+50%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
