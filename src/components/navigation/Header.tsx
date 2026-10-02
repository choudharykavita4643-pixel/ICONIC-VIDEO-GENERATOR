import React from 'react';
import { ScreenTab } from '../../types';
import { Sparkles, Code2, Plus, MonitorSmartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface HeaderProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  onNewProject: () => void;
}

const TAB_TITLES: Record<ScreenTab, string> = {
  'video-maker': 'Video Maker Studio',
  'photo-generator': 'AI Photo Generator',
  'script-generator': 'Script Generator',
  'lyric-generator': 'Lyric Generator',
  'audio-generator': 'Audio TTS Studio',
  'video-editor': 'Video Timeline Editor',
  'youtube-manager': 'YouTube Channel Manager',
  'analytics': 'Channel Analytics',
  'projects': 'Project Library',
  'settings': 'Settings & Flutter Hub',
};

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onNewProject }) => {
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Zone 1: Contextual Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 hidden sm:inline">Creator Studio AI</span>
        <span className="text-slate-600 hidden sm:inline">/</span>
        <span className="font-semibold text-slate-100 flex items-center gap-1.5">
          {TAB_TITLES[currentTab]}
        </span>
      </div>

      {/* Zone 2: Subtitle / Motto */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
        <span>Create</span>
        <span className="text-slate-600">·</span>
        <span>Edit</span>
        <span className="text-slate-600">·</span>
        <span>Generate</span>
        <span className="text-slate-600">·</span>
        <span className="text-cyan-400 font-medium">Publish</span>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isInstallable && (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            title="Install cross-platform app"
          >
            <MonitorSmartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Install PWA</span>
          </button>
        )}

        <button
          onClick={() => onSelectTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
            currentTab === 'settings'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Flutter & Dart Source Code Hub"
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Flutter Code</span>
        </button>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>
    </header>
  );
};
