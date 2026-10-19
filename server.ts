import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory cloud sync store for remote replication
let remoteCloudBackup: {
  lastSyncedAt: string;
  data: any;
  version: number;
} | null = null;

// Cloud Sync endpoints
app.post('/api/sync/backup', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ success: false, error: 'Data is required' });
    }
    remoteCloudBackup = {
      lastSyncedAt: new Date().toISOString(),
      data,
      version: (remoteCloudBackup?.version || 0) + 1,
    };
    return res.json({
      success: true,
      message: 'Cloud backup synced successfully',
      lastSyncedAt: remoteCloudBackup.lastSyncedAt,
      version: remoteCloudBackup.version,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/sync/restore', (_req, res) => {
  if (!remoteCloudBackup) {
    return res.status(404).json({ success: false, error: 'No remote cloud backup found' });
  }
  return res.json({
    success: true,
    lastSyncedAt: remoteCloudBackup.lastSyncedAt,
    version: remoteCloudBackup.version,
    data: remoteCloudBackup.data,
  });
});

// AI Chatbot endpoint for Land Services & Digital Center Assistant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `
আপনি "ভূমি সেবা কেন্দ্র (উপজেলা ডিজিটাল সেন্টার), নন্দীগ্রাম, বগুড়া" এর অফিসিয়াল ভার্চুয়াল সহকারী।
আপনার কাজ হলো:
১. নাগরিক ও ডিজিটাল সেন্টারের অপারেটর/উদ্যোক্তাদের ভূমি সেবা (ই-নামজারি/খারিজ আবেদন ও ট্র্যাকিং, আরএস/সিএস/এসএ খতিয়ান, ভূমি উন্নয়ন কর বা ই-দাখিলা পরিশোধ, মিসকেস ইত্যাদি) সম্পর্কে সঠিক নিয়ম ও পরামর্শ দেওয়া।
২. ডিজিটাল সেন্টারের অন্যান্য সেবা (জন্ম ও মৃত্যু নিবন্ধন, জাতীয় পরিচয়পত্র সংশোধন, প্রত্যয়ন পত্র, পাসপোর্ট আবেদন, ভিসা চেক ইত্যাদি) সম্পর্কে তথ্য দেওয়া।
৩. এই অর্গানাইজার ওয়েব অ্যাপ্লিকেশন ব্যবহারের নিয়ম বুঝিয়ে দেওয়া (যেমন: প্রতিদিনের আয়-ব্যয় হিসাব সংযোজন, কর্মচারী যোগদান ও তথ্য হালনাগাদ, দৈনিক ডিজিটাল হাজিরা ও ছুটি আবেদন, বেতন বা স্যালারি শীট ও পে-স্লিপ তৈরি ও প্রিন্ট, ডেটা ব্যাকআপ ও ক্লাউড সিঙ্ক)।
৪. সর্বদা বিনয়ী, তথ্যবহুল ও সাবলীল বাংলায় উত্তর দেবেন (প্রয়োজনে ইংরেজি টার্ম বন্ধনীতে উল্লেখ করতে পারেন)। উত্তরটি পরিষ্কার প্যারাগ্রাফ বা বুলেট পয়েন্টে দিন যাতে ব্যবহারকারী সহজে বুঝতে পারেন।
`;

    // Format chat contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: 'AI সহকারী বর্তমানে সাড়া দিতে পারছে না। অনুগ্রহ করে একটু পর আবার চেষ্টা করুন।',
      details: error.message,
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
