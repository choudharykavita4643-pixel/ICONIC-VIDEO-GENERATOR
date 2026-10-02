import React from 'react';
import {
  Film,
  Image as ImageIcon,
  FileText,
  Music,
  Mic,
  Scissors,
  Youtube,
  BarChart3,
  FolderKanban,
  Settings,
  Sparkles,
  Download,
} from 'lucide-react';
import { ScreenTab } from '../../types';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface SidebarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  projectCount: number;
}

interface NavItem {
  id: ScreenTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'video-maker', label: 'Video Maker', icon: Film },
  { id: 'photo-generator', label: 'AI Photos', icon: ImageIcon },
  { id: 'script-generator', label: 'Scripts', icon: FileText },
  { id: 'lyric-generator', label: 'Lyrics', icon: Music },
  { id: 'audio-generator', label: 'Audio TTS', icon: Mic },
  { id: 'video-editor', label: 'Video Editor', icon: Scissors },
  { id: 'youtube-manager', label: 'YouTube Studio', icon: Youtube },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'settings', label: 'Settings & Flutter', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, projectCount }) => {
  const { isInstallable, isIOS, install } = usePWAInstall();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#090D16] border-r border-slate-800/80 shrink-0 h-screen sticky top-0 z-30 select-none">
      {/* Brand Zone */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">Creator Studio AI</span>
            <span className="text-[11px] text-slate-400 block tracking-wide">YouTube Suite</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Studio Tools
        </div>

        {NAV_ITEMS.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Publish & Manage
        </div>

        {NAV_ITEMS.slice(6).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.id === 'projects' && projectCount > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-slate-400">
                  {projectCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PWA & Platform Install Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        {isInstallable && (
          <button
            onClick={install}
            className="w-full mb-2 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5" />
            Install App (Cross-Platform)
          </button>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Target: iOS · Android · Win · Mac</span>
          <span className="font-mono">v1.0</span>
        </div>
      </div>
    </aside>
  );
};
