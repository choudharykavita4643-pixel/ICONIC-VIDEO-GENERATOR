export type ScreenTab =
  | 'video-maker'
  | 'photo-generator'
  | 'script-generator'
  | 'lyric-generator'
  | 'audio-generator'
  | 'video-editor'
  | 'youtube-manager'
  | 'analytics'
  | 'projects'
  | 'settings';

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '4:5';

export type VideoPreset =
  | 'youtube-short'
  | 'youtube-long'
  | 'instagram-reel'
  | 'square-video'
  | 'custom';

export type TransitionType = 'cut' | 'fade' | 'crossfade' | 'zoom' | 'slide-left';

export interface TimelineClip {
  id: string;
  type: 'image' | 'color' | 'video';
  title: string;
  src: string;
  durationSec: number;
  startSec: number;
  color?: string;
  transition: TransitionType;
}

export interface TextOverlay {
  id: string;
  text: string;
  startSec: number;
  durationSec: number;
  positionX: number; // percentage 0-100
  positionY: number; // percentage 0-100
  fontSize: number; // px relative
  color: string;
  bgColor: string;
}

export interface SubtitleItem {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
}

export interface VideoProjectData {
  title: string;
  aspectRatio: AspectRatioType;
  preset: VideoPreset;
  durationSec: number;
  clips: TimelineClip[];
  textOverlays: TextOverlay[];
  subtitles: SubtitleItem[];
  bgMusicName?: string;
  bgMusicVolume: number;
  voiceoverName?: string;
}

export interface GeneratedScript {
  title: string;
  hook: string;
  intro: string;
  scenes: Array<{
    sceneNumber: number;
    visualCues: string;
    narration: string;
    onScreenText: string;
    estimatedSeconds: number;
  }>;
  outro: string;
  callToAction: string;
  suggestedTags: string[];
}

export interface GeneratedLyrics {
  title: string;
  genre: string;
  mood: string;
  suggestedBpm: number;
  keySignature?: string;
  sections: Array<{
    sectionName: string;
    lyrics: string;
    vocalFlowTip: string;
  }>;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  voice: string;
  audioUrl: string;
  durationSec: number;
  createdAt: string;
}

export interface GeneratedPhoto {
  id: string;
  prompt: string;
  style: string;
  aspectRatio: AspectRatioType;
  imageUrl: string;
  createdAt: string;
}

export type ProjectCategory = 'video' | 'script' | 'image' | 'lyrics' | 'audio';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  data: any;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  handle: string;
  avatarUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  connectedAt: string;
  isDemo?: boolean;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  privacyStatus: 'public' | 'unlisted' | 'private';
  duration: string;
}

export interface AnalyticsMetric {
  views: number;
  watchTimeHours: number;
  subscribers: number;
  estimatedRevenue: number;
  ctr: number;
  avgDurationSec: number;
  chartData: Array<{ date: string; views: number; watchHours: number }>;
}
