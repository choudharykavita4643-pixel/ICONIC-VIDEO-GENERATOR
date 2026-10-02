import { Project, GeneratedScript, GeneratedLyrics, GeneratedPhoto, GeneratedAudio, VideoProjectData } from '../types';

import heroImg from '../assets/images/creator_studio_hero_1790953191426.jpg';
import jungleRobotImg from '../assets/images/sample_robot_jungle_1790953205575.jpg';
import cyberpunkImg from '../assets/images/sample_cyberpunk_thumbnail_1790953223593.jpg';
import avatarImg from '../assets/images/sample_creator_avatar_1790953236580.jpg';

export { heroImg, jungleRobotImg, cyberpunkImg, avatarImg };

const STORAGE_KEY_PROJECTS = 'creator_studio_ai_projects';
const STORAGE_KEY_YT_CHANNEL = 'creator_studio_ai_yt_channel';
const STORAGE_KEY_YT_VIDEOS = 'creator_studio_ai_yt_videos';

// Default starter projects
const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_vid_01',
    title: 'Futuristic AI Tech Stack Breakdown',
    category: 'video',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    thumbnail: cyberpunkImg,
    data: {
      title: 'Futuristic AI Tech Stack Breakdown',
      aspectRatio: '9:16',
      preset: 'youtube-short',
      durationSec: 15,
      bgMusicName: 'Cyber Synth Pulse (Royalty Free)',
      bgMusicVolume: 0.35,
      clips: [
        {
          id: 'clip_1',
          type: 'image',
          title: 'Studio Intro',
          src: heroImg,
          startSec: 0,
          durationSec: 5,
          transition: 'fade',
        },
        {
          id: 'clip_2',
          type: 'image',
          title: 'Cyberpunk Drone',
          src: cyberpunkImg,
          startSec: 5,
          durationSec: 5,
          transition: 'zoom',
        },
        {
          id: 'clip_3',
          type: 'image',
          title: 'Wild Jungle Exploration',
          src: jungleRobotImg,
          startSec: 10,
          durationSec: 5,
          transition: 'crossfade',
        },
      ],
      textOverlays: [
        {
          id: 'txt_1',
          text: '5 AI TOOLS TO 10X YOUR CHANNEL 🔥',
          startSec: 0.5,
          durationSec: 4.5,
          positionX: 50,
          positionY: 20,
          fontSize: 22,
          color: '#38BDF8',
          bgColor: 'rgba(0, 0, 0, 0.75)',
        },
        {
          id: 'txt_2',
          text: 'TOOL #1: CREATOR STUDIO AI 🚀',
          startSec: 5.2,
          durationSec: 4.5,
          positionX: 50,
          positionY: 80,
          fontSize: 20,
          color: '#F43F5E',
          bgColor: 'rgba(0, 0, 0, 0.75)',
        },
      ],
      subtitles: [
        { id: 'sub_1', startSec: 0.5, endSec: 3.0, text: 'Are you still editing videos for hours?' },
        { id: 'sub_2', startSec: 3.2, endSec: 5.0, text: 'Here is how to automate your YouTube pipeline.' },
        { id: 'sub_3', startSec: 5.2, endSec: 9.8, text: 'Generate scripts, voiceovers, and videos in seconds.' },
        { id: 'sub_4', startSec: 10.0, endSec: 14.8, text: 'Hit subscribe for daily creator workflows!' },
      ],
    } as VideoProjectData,
  },
  {
    id: 'proj_scr_01',
    title: 'How AI Robots Will Explore Deep Jungles',
    category: 'script',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    thumbnail: jungleRobotImg,
    data: {
      title: 'How AI Robots Will Explore Deep Jungles',
      hook: 'What if autonomous machines could map unexplored rainforests without disturbing a single leaf?',
      intro: 'Deep inside the Amazon canopy, biological research is entering a revolutionary new era powered by biomimetic robotics.',
      scenes: [
        {
          sceneNumber: 1,
          visualCues: 'Slow drone shot over thick emerald jungle canopy mist',
          narration: 'Every year, thousands of undiscovered species remain hidden in remote terrains.',
          onScreenText: 'THE UNEXPLORED WILD',
          estimatedSeconds: 6,
        },
        {
          sceneNumber: 2,
          visualCues: 'Close up of a sleek silver robotic scout traversing mossy tree trunk',
          narration: 'Meet the new autonomous canopy surveyors, engineered with silent electrostatic motors.',
          onScreenText: 'AUTONOMOUS BIODIVERSITY MAPPING',
          estimatedSeconds: 8,
        },
        {
          sceneNumber: 3,
          visualCues: 'Holographic LiDAR scanning interface highlighting foliage depth',
          narration: 'They process gigabytes of ecological bioacoustics and environmental DNA in real time.',
          onScreenText: 'REAL-TIME BIOSENSORS',
          estimatedSeconds: 8,
        },
      ],
      outro: 'The frontier of environmental science is no longer just in labs—it is walking through the canopy.',
      callToAction: 'Would you trust an AI robot in the wild? Drop your thoughts below and subscribe!',
      suggestedTags: ['#Robotics', '#Science', '#AI', '#Nature', '#FutureTech'],
    } as GeneratedScript,
  },
  {
    id: 'proj_img_01',
    title: 'Jungle Robot Adventure Concept',
    category: 'image',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    thumbnail: jungleRobotImg,
    data: {
      id: 'img_sample_1',
      prompt: 'Create a cinematic jungle adventure scene with a futuristic robot.',
      style: 'Cinematic 8K',
      aspectRatio: '16:9',
      imageUrl: jungleRobotImg,
      createdAt: new Date().toISOString(),
    } as GeneratedPhoto,
  },
  {
    id: 'proj_lyr_01',
    title: 'Neon Skyline (Synthwave Anthem)',
    category: 'lyrics',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    thumbnail: cyberpunkImg,
    data: {
      title: 'Neon Skyline',
      genre: 'Synthwave / Retro Electro',
      mood: 'Epic & Driving',
      suggestedBpm: 124,
      keySignature: 'F# Minor',
      sections: [
        {
          sectionName: 'Verse 1',
          lyrics: 'Reflections dancing on the wet asphalt\nThe midnight air is humming with electric fault\nWe accelerate beyond the digital divide\nWith neon beacons burning on the ocean side',
          vocalFlowTip: 'Low, smooth vocal tone with steady 16th-note rhythmic cadence',
        },
        {
          sectionName: 'Chorus',
          lyrics: 'Oh, we ignite the neon skyline tonight!\nChasing shadows into violet light\nThere is no turning back from where we begin\nWhen the synth wave washes over the wind!',
          vocalFlowTip: 'Full chest voice, soaring melody, strong punch on "skyline" and "light"',
        },
      ],
    } as GeneratedLyrics,
  },
];

export const storageService = {
  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(SEED_PROJECTS));
        return SEED_PROJECTS;
      }
      return JSON.parse(stored);
    } catch {
      return SEED_PROJECTS;
    }
  },

  saveProject(project: Project): void {
    const list = this.getProjects();
    const index = list.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      list[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({
        ...project,
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list));
  },

  deleteProject(id: string): void {
    const list = this.getProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list));
  },

  getProjectById(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  },

  resetAllProjects(): void {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(SEED_PROJECTS));
  },
};
