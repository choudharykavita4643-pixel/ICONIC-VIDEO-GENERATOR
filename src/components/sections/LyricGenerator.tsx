import React, { useState } from 'react';
import {
  Music,
  Sparkles,
  Copy,
  Check,
  FolderPlus,
  RefreshCw,
  Mic,
  Disc3,
  ShieldCheck,
} from 'lucide-react';
import { GeneratedLyrics, Project } from '../../types';
import { geminiService } from '../../services/geminiService';
import { storageService, cyberpunkImg } from '../../services/storageService';

interface LyricGeneratorProps {
  onSaveToProjects: (project: Project) => void;
  onSendToAudio?: (text: string) => void;
}

const MOODS = ['Epic & Inspiring', 'Melancholic & Reflective', 'Chill & Lo-Fi', 'High Energy Hype', 'Dark Cybernetic'];
const GENRES = ['Synthwave / 80s Retro', 'Hip-Hop & Trap', 'Modern Pop', 'Lo-Fi Chillhop', 'Cinematic Orchestral', 'Alt Rock'];
const LENGTHS = ['Short Hook / Chorus (30s)', 'Standard Track (~2-3 min)', 'Full Album Cut (~4 min)'];
const LANGUAGES = ['English', 'Spanish', 'Hindi', 'French', 'Japanese', 'German'];

export const LyricGenerator: React.FC<LyricGeneratorProps> = ({ onSaveToProjects, onSendToAudio }) => {
  const [topic, setTopic] = useState('Chasing Neon Horizons Across a Midnight Cyber City');
  const [mood, setMood] = useState('Epic & Inspiring');
  const [genre, setGenre] = useState('Synthwave / 80s Retro');
  const [songLength, setSongLength] = useState('Standard Track (~2-3 min)');
  const [language, setLanguage] = useState('English');

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [lyrics, setLyrics] = useState<GeneratedLyrics>({
    title: 'Neon Skyline Horizon',
    genre: 'Synthwave / 80s Retro',
    mood: 'Epic & Inspiring',
    suggestedBpm: 124,
    keySignature: 'F# Minor',
    sections: [
      {
        sectionName: 'Verse 1',
        lyrics: `Reflections dancing on the wet asphalt\nThe midnight air is humming with electric fault\nWe accelerate beyond the digital divide\nWith neon beacons burning on the ocean side\nNo rearview mirrors in this cyber race\nJust open throttle through the empty space`,
        vocalFlowTip: 'Low, smooth vocal tone with steady 16th-note rhythmic cadence',
      },
      {
        sectionName: 'Pre-Chorus',
        lyrics: `Can you feel the frequency rising in the room?\nBreaking through the shadows, dispelling all the gloom\nThe engines ignite, the frequencies align\nCrossing over into the divine`,
        vocalFlowTip: 'Build-up in pitch, crisp articulation on each rhyming couplet',
      },
      {
        sectionName: 'Chorus',
        lyrics: `Oh, we ignite the neon skyline tonight!\nChasing shadows into violet light\nThere is no turning back from where we begin\nWhen the synth wave washes over the wind!\nHold on, we ride the starlight line\nForever reaching for the neon skyline!`,
        vocalFlowTip: 'Full soaring chest voice, powerful vocal belt with delay resonance',
      },
      {
        sectionName: 'Verse 2',
        lyrics: `Holographic billboards flicker in the rain\nWashing away the memory of old pain\nEvery street corner speaks in flashing signs\nGuiding our wheels along the painted lines`,
        vocalFlowTip: 'Dynamic drop in volume to match Verse 1 intimacy',
      },
      {
        sectionName: 'Outro',
        lyrics: `Fade into the purple glow...\nLet the night air carry us home...\nNeon skyline... never let go...`,
        vocalFlowTip: 'Whispered falsetto decay into synth pads',
      },
    ],
  });

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const generated = await geminiService.generateLyrics({
        topic,
        mood,
        language,
        genre,
        songLength,
      });
      setLyrics(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    const fullText = `TITLE: ${lyrics.title}\nGENRE: ${lyrics.genre} | BPM: ${lyrics.suggestedBpm}\n\n` +
      lyrics.sections.map((s) => `[${s.sectionName}]\n${s.lyrics}\n(Performance Cue: ${s.vocalFlowTip})\n`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToProjects = () => {
    const newProject: Project = {
      id: `proj_lyr_${Date.now()}`,
      title: lyrics.title,
      category: 'lyrics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: cyberpunkImg,
      data: lyrics,
    };

    storageService.saveProject(newProject);
    onSaveToProjects(newProject);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getChorusText = () => {
    const chorus = lyrics.sections.find((s) => s.sectionName.toLowerCase().includes('chorus'));
    return chorus ? chorus.lyrics : lyrics.sections[0]?.lyrics || '';
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Lyric Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compose 100% original, copyright-safe song lyrics tailored to your genre and musical cadence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Copyright Safe Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Original · Copyright Safe</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Lyrics</span>
              </>
            )}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Song Settings */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Song Theme & Core Narrative
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
                placeholder="What is your song about?"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Musical Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {GENRES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Mood & Vibe</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {MOODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Length</label>
                <select
                  value={songLength}
                  onChange={(e) => setSongLength(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {LENGTHS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Composing Original Verses...</span>
                </>
              ) : (
                <>
                  <Music className="w-4 h-4" />
                  <span>Generate Lyrics</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Structured Lyric Sheet */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                  Original Song Arrangement
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">{lyrics.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Disc3 className="w-4 h-4 text-purple-400 animate-spin-slow" />
                <span>{lyrics.suggestedBpm} BPM</span>
                {lyrics.keySignature && <span>· {lyrics.keySignature}</span>}
              </div>
            </div>

            {/* Sections display */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {lyrics.sections.map((sec, idx) => {
                const isChorus = sec.sectionName.toLowerCase().includes('chorus');
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 transition ${
                      isChorus
                        ? 'bg-purple-950/20 border-purple-500/40 shadow-sm shadow-purple-500/10'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                      <span
                        className={`font-bold ${
                          isChorus ? 'text-purple-400 text-sm' : 'text-slate-300'
                        }`}
                      >
                        {sec.sectionName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        Tip: {sec.vocalFlowTip}
                      </span>
                    </div>

                    <p className="whitespace-pre-line text-slate-200 leading-relaxed font-sans font-medium text-xs">
                      {sec.lyrics}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Send to Audio TTS */}
            {onSendToAudio && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Want to hear this sung or spoken?</span>
                <button
                  onClick={() => onSendToAudio(getChorusText())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Send Chorus to Audio TTS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
