import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  FolderPlus,
  RefreshCw,
  Film,
  Mic,
  Clock,
  Layers,
  Tag,
} from 'lucide-react';
import { GeneratedScript, Project } from '../../types';
import { geminiService } from '../../services/geminiService';
import { storageService, jungleRobotImg } from '../../services/storageService';

interface ScriptGeneratorProps {
  onSaveToProjects: (project: Project) => void;
  onSendToVideoMaker?: (script: GeneratedScript) => void;
  onSendToAudio?: (text: string) => void;
}

const VIDEO_TYPES = [
  'YouTube Shorts',
  'YouTube Videos',
  'Story Videos',
  'Educational Videos',
  'Adventure Videos',
  'Kids Stories',
  'Documentary-style Scripts',
];

const DURATIONS = ['30 Seconds', '60 Seconds', '3 Minutes', '5 Minutes', '10 Minutes'];

const TONES = [
  'Energetic & Punchy',
  'Educational & Clear',
  'Dramatic & Mysterious',
  'Inspiring & Motivational',
  'Humorous & Relatable',
  'Documentary Authority',
];

const LANGUAGES = ['English', 'Spanish', 'Hindi', 'French', 'German', 'Japanese', 'Portuguese'];

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
  onSaveToProjects,
  onSendToVideoMaker,
  onSendToAudio,
}) => {
  const [topic, setTopic] = useState('How Autonomous AI Robots Will Explore Rainforests');
  const [videoType, setVideoType] = useState('YouTube Shorts');
  const [duration, setDuration] = useState('60 Seconds');
  const [tone, setTone] = useState('Dramatic & Mysterious');
  const [language, setLanguage] = useState('English');
  const [audience, setAudience] = useState('Tech & Nature Enthusiasts');

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [script, setScript] = useState<GeneratedScript>({
    title: 'How Autonomous AI Robots Will Explore Rainforests',
    hook: 'What if autonomous machines could map unexplored rainforests without disturbing a single leaf?',
    intro: 'Deep inside the Amazon canopy, biological research is entering a revolutionary new era powered by biomimetic robotics.',
    scenes: [
      {
        sceneNumber: 1,
        visualCues: 'Slow sweeping aerial shot over misty emerald jungle canopy at sunrise',
        narration: 'Every single year, thousands of undiscovered biological species remain hidden deep within inaccessible tree canopies.',
        onScreenText: 'THE UNEXPLORED WILD',
        estimatedSeconds: 6,
      },
      {
        sceneNumber: 2,
        visualCues: 'Close up of a sleek silver robotic scout traversing mossy tree trunk with micro-grippers',
        narration: 'Meet the next-generation autonomous canopy surveyors, engineered with silent electrostatic motors and bio-acoustic sensors.',
        onScreenText: 'AUTONOMOUS BIODIVERSITY MAPPING',
        estimatedSeconds: 8,
      },
      {
        sceneNumber: 3,
        visualCues: 'Holographic LiDAR scanning interface highlighting foliage depth and temperature gradients',
        narration: 'They process gigabytes of environmental DNA and canopy microclimates in real time, communicating via satellite mesh.',
        onScreenText: 'REAL-TIME BIOSENSORS',
        estimatedSeconds: 8,
      },
      {
        sceneNumber: 4,
        visualCues: 'Dramatic silhouette of robot surveying the horizon as golden sunlight filters through leaves',
        narration: 'The frontier of environmental science is no longer confined to labs—it is walking through the canopy.',
        onScreenText: 'THE FUTURE OF CONSERVATION',
        estimatedSeconds: 6,
      },
    ],
    outro: 'This technology is rewriting how we protect Earth’s most vulnerable ecosystems before they vanish.',
    callToAction: 'Would you trust an AI robot in the wild? Drop your thoughts below and subscribe for daily future-tech breakdowns!',
    suggestedTags: ['#Robotics', '#Science', '#AI', '#Nature', '#FutureTech'],
  });

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const generated = await geminiService.generateScript({
        topic,
        videoType,
        duration,
        language,
        tone,
        audience,
      });
      setScript(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyFullScript = () => {
    const fullText = `TITLE: ${script.title}\n\nHOOK (0-5s):\n${script.hook}\n\nINTRO:\n${script.intro}\n\nSCENE BREAKDOWN:\n` +
      script.scenes
        .map(
          (s) =>
            `[Scene ${s.sceneNumber} - ${s.estimatedSeconds}s]\nVISUAL: ${s.visualCues}\nVOICEOVER: ${s.narration}\nON-SCREEN: ${s.onScreenText}\n`
        )
        .join('\n') +
      `\nOUTRO:\n${script.outro}\n\nCALL TO ACTION:\n${script.callToAction}\n\nTAGS:\n${script.suggestedTags.join(' ')}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToProjects = () => {
    const newProject: Project = {
      id: `proj_scr_${Date.now()}`,
      title: script.title,
      category: 'script',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: jungleRobotImg,
      data: script,
    };

    storageService.saveProject(newProject);
    onSaveToProjects(newProject);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Compile all narration text for audio TTS
  const getFullNarration = () => {
    return `${script.hook} ${script.intro} ${script.scenes.map((s) => s.narration).join(' ')} ${script.outro} ${script.callToAction}`;
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Script Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft viral YouTube hooks, scene-by-scene visual cues, and high-retention narration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFullScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Script</span>
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

      {/* Main Grid: Parameters on Left, Generated Script on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Video Topic / Core Idea
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
                placeholder="What is your video about?"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Video Type</label>
                <select
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {VIDEO_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {DURATIONS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tone & Pacing</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs"
                >
                  {TONES.map((t) => (
                    <option key={t}>{t}</option>
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
                  {LANGUAGES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                placeholder="e.g. Gen-Z gamers, aspiring entrepreneurs"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Script Structure...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate YouTube Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Structured Script Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
            {/* Title & Metadata */}
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Generated Script
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">{script.title}</h3>
            </div>

            {/* Hook Box */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Opening Hook (0:00 - 0:05)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">"{script.hook}"</p>
            </div>

            {/* Intro */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 block">Intro Setup:</span>
              <p className="text-xs text-slate-300 leading-relaxed">{script.intro}</p>
            </div>

            {/* Scenes Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Scene Breakdown ({script.scenes.length} Scenes)</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {script.scenes.map((scene) => (
                  <div
                    key={scene.sceneNumber}
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-cyan-400">Scene {scene.sceneNumber}</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        ~{scene.estimatedSeconds}s
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-400 block font-medium mb-0.5">Visual Direction:</span>
                        <p className="text-slate-300">{scene.visualCues}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                        <span className="text-pink-400 block font-medium mb-0.5">On-Screen Text:</span>
                        <p className="text-pink-200 font-semibold">{scene.onScreenText}</p>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-slate-400 font-medium block text-[11px] mb-0.5">
                        Voiceover Narration:
                      </span>
                      <p className="text-slate-200 leading-relaxed italic">"{scene.narration}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outro & CTA */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-400 block">Outro & Call To Action:</span>
              <p className="text-slate-300">{script.outro}</p>
              <p className="text-cyan-300 font-medium">{script.callToAction}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {script.suggestedTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Cross-Tool Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {onSendToAudio && (
                  <button
                    onClick={() => onSendToAudio(getFullNarration())}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Send to Audio TTS</span>
                  </button>
                )}

                {onSendToVideoMaker && (
                  <button
                    onClick={() => onSendToVideoMaker(script)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Send to Video Maker</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
