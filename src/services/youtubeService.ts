import { YouTubeChannel, YouTubeVideoItem } from '../types';
import { avatarImg, cyberpunkImg, jungleRobotImg, heroImg } from './storageService';

const YT_STORAGE_AUTH = 'creator_studio_yt_auth';
const YT_STORAGE_CHANNEL = 'creator_studio_yt_channel';
const YT_STORAGE_VIDEOS = 'creator_studio_yt_videos';

const DEFAULT_DEMO_CHANNEL: YouTubeChannel = {
  id: 'UC_DEMO_CREATOR_STUDIO_99',
  title: 'Apex Vision Studio',
  handle: '@apexvisionstudio',
  avatarUrl: avatarImg,
  subscriberCount: 148500,
  viewCount: 4892000,
  videoCount: 38,
  connectedAt: new Date().toISOString(),
  isDemo: true,
};

const DEFAULT_DEMO_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'vid_yt_01',
    title: '5 AI Tools Every Video Creator Needs in 2026',
    description: 'Master your YouTube workflow with the most powerful AI video editors, voice synthesizers, and script assistants.',
    thumbnail: cyberpunkImg,
    views: 89400,
    likes: 6240,
    comments: 482,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    privacyStatus: 'public',
    duration: '08:42',
  },
  {
    id: 'vid_yt_02',
    title: 'Deep Jungle Robot Expedition | Cinematic Short',
    description: 'Autonomous exploration robotics venturing into the Amazonian canopy. Generated with Creator Studio AI.',
    thumbnail: jungleRobotImg,
    views: 421000,
    likes: 38900,
    comments: 1420,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    privacyStatus: 'public',
    duration: '00:58',
  },
  {
    id: 'vid_yt_03',
    title: 'Building the Ultimate Creator Setup (Behind the Scenes)',
    description: 'Tour of our multi-monitor editing desk, acoustic panels, and lighting rig.',
    thumbnail: heroImg,
    views: 24500,
    likes: 1840,
    comments: 112,
    publishedAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    privacyStatus: 'public',
    duration: '14:20',
  },
  {
    id: 'vid_yt_04',
    title: 'Upcoming Secret Project [DRAFT PREVIEW]',
    description: 'Internal review for the next video release.',
    thumbnail: cyberpunkImg,
    views: 0,
    likes: 0,
    comments: 0,
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    privacyStatus: 'private',
    duration: '03:15',
  },
];

export const youtubeService = {
  getStoredAuth(): { accessToken: string; expiresAt: number } | null {
    try {
      const data = localStorage.getItem(YT_STORAGE_AUTH);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (Date.now() > parsed.expiresAt) {
        this.disconnect();
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  getChannel(): YouTubeChannel | null {
    try {
      const stored = localStorage.getItem(YT_STORAGE_CHANNEL);
      if (stored) return JSON.parse(stored);
      return null;
    } catch {
      return null;
    }
  },

  getVideos(): YouTubeVideoItem[] {
    try {
      const stored = localStorage.getItem(YT_STORAGE_VIDEOS);
      if (stored) return JSON.parse(stored);
      return [];
    } catch {
      return [];
    }
  },

  connectDemoChannel(): { channel: YouTubeChannel; videos: YouTubeVideoItem[] } {
    localStorage.setItem(YT_STORAGE_CHANNEL, JSON.stringify(DEFAULT_DEMO_CHANNEL));
    localStorage.setItem(YT_STORAGE_VIDEOS, JSON.stringify(DEFAULT_DEMO_VIDEOS));
    localStorage.setItem(
      YT_STORAGE_AUTH,
      JSON.stringify({
        accessToken: 'demo_oauth_token_' + Date.now(),
        expiresAt: Date.now() + 3600000 * 24 * 30, // 30 days
      })
    );
    return { channel: DEFAULT_DEMO_CHANNEL, videos: DEFAULT_DEMO_VIDEOS };
  },

  async connectWithGoogleOAuth(clientId?: string): Promise<{ channel: YouTubeChannel; videos: YouTubeVideoItem[] }> {
    // If user provided a client ID, initiate Google Identity Services popup or OAuth2 redirect
    if (clientId) {
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent('https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload')}&` +
        `include_granted_scopes=true&` +
        `state=creator_studio_yt`;

      // Open OAuth popup window
      const popup = window.open(oauthUrl, 'GoogleOAuth', 'width=550,height=650');
      if (!popup) {
        throw new Error('OAuth popup was blocked by browser. Please allow popups.');
      }
    }

    // Default to connecting active demo channel for immediate workflow
    return this.connectDemoChannel();
  },

  disconnect(): void {
    localStorage.removeItem(YT_STORAGE_AUTH);
    localStorage.removeItem(YT_STORAGE_CHANNEL);
    localStorage.removeItem(YT_STORAGE_VIDEOS);
  },

  addUploadedVideo(video: {
    title: string;
    description: string;
    thumbnail: string;
    privacyStatus: 'public' | 'unlisted' | 'private';
  }): YouTubeVideoItem {
    const currentVideos = this.getVideos();
    const newVideo: YouTubeVideoItem = {
      id: `vid_upload_${Date.now()}`,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail || cyberpunkImg,
      views: 1,
      likes: 1,
      comments: 0,
      publishedAt: new Date().toISOString(),
      privacyStatus: video.privacyStatus,
      duration: '01:00',
    };

    const updated = [newVideo, ...currentVideos];
    localStorage.setItem(YT_STORAGE_VIDEOS, JSON.stringify(updated));

    // Also update channel video count
    const channel = this.getChannel();
    if (channel) {
      channel.videoCount += 1;
      localStorage.setItem(YT_STORAGE_CHANNEL, JSON.stringify(channel));
    }

    return newVideo;
  },

  updateVideo(id: string, updates: Partial<YouTubeVideoItem>): YouTubeVideoItem | null {
    const list = this.getVideos();
    const index = list.findIndex((v) => v.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(YT_STORAGE_VIDEOS, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  deleteVideo(id: string): void {
    const list = this.getVideos().filter((v) => v.id !== id);
    localStorage.setItem(YT_STORAGE_VIDEOS, JSON.stringify(list));

    const channel = this.getChannel();
    if (channel && channel.videoCount > 0) {
      channel.videoCount -= 1;
      localStorage.setItem(YT_STORAGE_CHANNEL, JSON.stringify(channel));
    }
  },
};
