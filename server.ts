import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Script Generator API
app.post('/api/generate-script', async (req: Request, res: Response) => {
  try {
    const { topic, videoType, duration, language, tone, audience } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const systemInstruction = `You are a world-class YouTube content strategist and scriptwriter specializing in high-retention video production.
Generate engaging, viral-ready, structured scripts with clear hooks, visual directions, voiceover narration, and calls-to-action.
Always return structured JSON matching the requested schema.`;

    const prompt = `Write a YouTube script for:
- Topic: ${topic}
- Video Type: ${videoType || 'YouTube Shorts'}
- Target Duration: ${duration || '60 seconds'}
- Language: ${language || 'English'}
- Tone: ${tone || 'Energetic & Engaging'}
- Target Audience: ${audience || 'General Creators & Viewers'}

Provide:
1. A viral Title
2. A high-retention Hook (first 3-5 seconds)
3. Brief Setup/Intro
4. 4-6 breakdown scenes with:
   - visualCues: detailed camera angle, graphic overlay, or B-roll description
   - narration: exact spoken words for voiceover
   - onScreenText: catchy text overlay for subtitles
   - estimatedSeconds: duration in seconds
5. An Outro with a compelling Call to Action (subscribe, comment, check description)
6. 5 suggested YouTube hashtags/tags`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            intro: { type: Type.STRING },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.INTEGER },
                  visualCues: { type: Type.STRING },
                  narration: { type: Type.STRING },
                  onScreenText: { type: Type.STRING },
                  estimatedSeconds: { type: Type.INTEGER },
                },
                required: ['sceneNumber', 'visualCues', 'narration', 'onScreenText', 'estimatedSeconds'],
              },
            },
            outro: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            suggestedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'hook', 'intro', 'scenes', 'outro', 'callToAction', 'suggestedTags'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, script: parsed });
  } catch (error: any) {
    console.error('Error generating script:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate script. Please verify your Gemini API key or try again.',
    });
  }
});

// 2. Lyrics Generator API
app.post('/api/generate-lyrics', async (req: Request, res: Response) => {
  try {
    const { topic, mood, language, genre, songLength } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Song topic is required.' });
    }

    const systemInstruction = `You are an award-winning lyricist and songwriter.
CRITICAL RULE: Generate 100% original, creative lyrics only. NEVER reproduce copyrighted lyrics or phrases from existing commercial songs.
Format with musical flow annotations, rhyme scheme pacing, and performance cues.`;

    const prompt = `Write completely original song lyrics:
- Song Topic: ${topic}
- Mood: ${mood || 'Inspiring & Melodic'}
- Language: ${language || 'English'}
- Genre: ${genre || 'Pop / Electronic'}
- Length: ${songLength || 'Standard (~2-3 minutes)'}

Output JSON structured with title, estimated BPM, musical key suggestion, and an array of sections (e.g., Intro, Verse 1, Pre-Chorus, Chorus, Verse 2, Bridge, Outro) each containing the section title, lyrics text with line breaks, and vocal flow/cadence tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            genre: { type: Type.STRING },
            mood: { type: Type.STRING },
            suggestedBpm: { type: Type.INTEGER },
            keySignature: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionName: { type: Type.STRING },
                  lyrics: { type: Type.STRING },
                  vocalFlowTip: { type: Type.STRING },
                },
                required: ['sectionName', 'lyrics', 'vocalFlowTip'],
              },
            },
          },
          required: ['title', 'genre', 'mood', 'suggestedBpm', 'sections'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, lyrics: parsed });
  } catch (error: any) {
    console.error('Error generating lyrics:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate lyrics. Please try again.',
    });
  }
});

// 3. AI Photo Generator API
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const enhancedPrompt = `${style ? `[Style: ${style}] ` : ''}${prompt}. High aesthetic quality, sharp details, cinematic lighting, 8k resolution master composition, clean professional creator asset.`;

    const validAspectRatios: Array<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'> = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '16:9';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: chosenAspectRatio,
          },
        },
      });

      let base64Image = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            base64Image = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (base64Image) {
        return res.json({
          success: true,
          imageUrl: base64Image,
          promptUsed: enhancedPrompt,
        });
      }
    } catch (modelErr: any) {
      console.warn('Direct image model failed or required paid key, falling back to prompt visualization:', modelErr?.message);
    }

    // Fallback: If image model is unavailable or needs paid tier, return an enhanced prompt description + curated graphic representation
    return res.json({
      success: true,
      imageUrl: '', // Frontend will use styled SVG fallback or pre-generated curated showcase
      fallbackNotice: 'Model requires image tier. Prompt has been optimized for visual rendering.',
      promptUsed: enhancedPrompt,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate image.',
    });
  }
});

// 4. Audio Text-to-Speech API
app.post('/api/generate-speech', async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    const voiceName = voice || 'Zephyr';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 1000), // Protect payload size
                speechMetadata: {
                  style: 'Engaging, clear, broadcast quality voiceover for YouTube creators',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          success: true,
          audioUrl: `data:audio/wav;base64,${base64Audio}`,
          provider: 'Gemini 3.8 TTS',
          voice: voiceName,
        });
      }
    } catch (ttsErr: any) {
      console.warn('Gemini TTS call notice:', ttsErr?.message);
    }

    // Inform client to use client-side Web Speech API / synthesized voice
    return res.json({
      success: false,
      useClientSpeech: true,
      message: 'Using free local Web Speech API synthesis for instant zero-latency speech.',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({
      error: error?.message || 'Audio generation error.',
      useClientSpeech: true,
    });
  }
});

// 5. YouTube Data API proxy or validation
app.post('/api/youtube/verify-channel', async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required.' });
    }

    // Fetch official channel details from Google YouTube Data API v3
    const ytRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!ytRes.ok) {
      const errData = await ytRes.json().catch(() => ({}));
      return res.status(ytRes.status).json({
        error: errData.error?.message || 'Failed to authenticate channel with YouTube API.',
      });
    }

    const data = await ytRes.json();
    return res.json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'YouTube verification error.' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Creator Studio AI server running at http://localhost:${PORT}`);
  });
}

startServer();
