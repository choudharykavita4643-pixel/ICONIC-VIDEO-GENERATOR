import React, { useState } from 'react';
import {
  Film,
  Image as ImageIcon,
  FileText,
  Youtube,
  FolderKanban,
  MoreHorizontal,
  Music,
  Mic,
  Scissors,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { ScreenTab } from '../../types';

interface MobileNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs: Array<{ id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'video-maker', label: 'Video', icon: Film },
    { id: 'photo-generator', label: 'Photos', icon: ImageIcon },
    { id: 'script-generator', label: 'Script', icon: FileText },
    { id: 'youtube-manager', label: 'YouTube', icon: Youtube },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  const moreTabs: Array<{ id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'lyric-generator', label: 'Lyric Generator', icon: Music },
    { id: 'audio-generator', label: 'Audio TTS Studio', icon: Mic },
    { id: 'video-editor', label: 'Video Timeline Editor', icon: Scissors },
    { id: 'analytics', label: 'Creator Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Flutter Hub', icon: Settings },
  ];

  return (
    <>
      {/* More Tools Modal Overlay */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end">
          <div className="w-full bg-[#0F172A] border-t border-slate-800 rounded-t-2xl p-5 space-y-3 pb-24 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-semibold text-white">All Creator Tools</span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090D16]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowMoreMenu(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5 text-slate-400" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
