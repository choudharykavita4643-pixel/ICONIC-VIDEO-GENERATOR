/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenTab, Project, GeneratedScript } from './types';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { Header } from './components/navigation/Header';

import { VideoMaker } from './components/sections/VideoMaker';
import { PhotoGenerator } from './components/sections/PhotoGenerator';
import { ScriptGenerator } from './components/sections/ScriptGenerator';
import { LyricGenerator } from './components/sections/LyricGenerator';
import { AudioGenerator } from './components/sections/AudioGenerator';
import { VideoEditor } from './components/sections/VideoEditor';
import { YouTubeManager } from './components/sections/YouTubeManager';
import { AnalyticsView } from './components/sections/AnalyticsView';
import { ProjectsView } from './components/sections/ProjectsView';
import { SettingsView } from './components/sections/SettingsView';

import { storageService } from './services/storageService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('video-maker');
  const [projectCount, setProjectCount] = useState(storageService.getProjects().length);

  // Cross-tool data passing state
  const [incomingAudioText, setIncomingAudioText] = useState<string>('');
  const [incomingYouTubeVideo, setIncomingYouTubeVideo] = useState<{
    title: string;
    description: string;
    thumbnail: string;
  } | null>(null);

  // Sync project count
  const refreshProjectCount = () => {
    setProjectCount(storageService.getProjects().length);
  };

  // Cross-tool handlers
  const handleSaveToProjects = (project: Project) => {
    refreshProjectCount();
  };

  const handleSendToVideoMaker = (asset: string | GeneratedScript) => {
    setCurrentTab('video-maker');
  };

  const handleSendToAudio = (text: string) => {
    setIncomingAudioText(text);
    setCurrentTab('audio-generator');
  };

  const handleSendToYouTube = (videoData: { title: string; description: string; thumbnail: string }) => {
    setIncomingYouTubeVideo(videoData);
    setCurrentTab('youtube-manager');
  };

  const handleOpenProject = (tab: ScreenTab, project: Project) => {
    setCurrentTab(tab);
  };

  const handleNewProject = () => {
    setCurrentTab('video-maker');
  };

  return (
    <div className="flex min-h-screen bg-[#070A12] text-slate-100 antialiased">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        projectCount={projectCount}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-6">
        {/* Sticky Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onNewProject={handleNewProject}
        />

        {/* Studio Content Area */}
        <main className="flex-1 overflow-x-hidden">
          {currentTab === 'video-maker' && (
            <VideoMaker
              onSaveToProjects={handleSaveToProjects}
              onSendToYouTube={handleSendToYouTube}
            />
          )}

          {currentTab === 'photo-generator' && (
            <PhotoGenerator
              onSaveToProjects={handleSaveToProjects}
              onSendToVideoMaker={handleSendToVideoMaker}
            />
          )}

          {currentTab === 'script-generator' && (
            <ScriptGenerator
              onSaveToProjects={handleSaveToProjects}
              onSendToVideoMaker={handleSendToVideoMaker}
              onSendToAudio={handleSendToAudio}
            />
          )}

          {currentTab === 'lyric-generator' && (
            <LyricGenerator
              onSaveToProjects={handleSaveToProjects}
              onSendToAudio={handleSendToAudio}
            />
          )}

          {currentTab === 'audio-generator' && (
            <AudioGenerator
              initialText={incomingAudioText}
              onSaveToProjects={handleSaveToProjects}
            />
          )}

          {currentTab === 'video-editor' && (
            <VideoEditor onSaveToProjects={handleSaveToProjects} />
          )}

          {currentTab === 'youtube-manager' && (
            <YouTubeManager incomingVideoToUpload={incomingYouTubeVideo} />
          )}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'projects' && (
            <ProjectsView
              onOpenProject={handleOpenProject}
              onNewProject={handleNewProject}
            />
          )}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
}
