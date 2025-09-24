import axios from 'axios';
import { NextResponse } from 'next/server';
import { uploadMediaToCloudinary } from '@/configs/cloudinary';

export async function POST(req) {
  try {
    const { text, id } = await req.json();

    if (!text || !id) {
      return NextResponse.json({ error: 'Missing text or id' }, { status: 400 });
    }

    const MURF_API_KEY = process.env.MURF_API_KEY;
    const VOICE_ID = 'en-US-natalie';

    // Step 1: Get Murf auth token
    const tokenRes = await axios.get('https://api.murf.ai/v1/auth/token', {
      headers: { 'api-key': MURF_API_KEY },
    });
    const authToken = tokenRes.data.token;

    if (!authToken) throw new Error('Failed to generate Murf auth token');

    // Step 2: Generate speech
    const ttsResponse = await axios.post(
      'https://api.murf.ai/v1/speech/generate',
      {
        text,
        voiceId: VOICE_ID,
        format: 'MP3',
        channelType: 'MONO',
        sampleRate: 24000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          token: authToken,
        },
      }
    );

    const audioUrl = ttsResponse?.data?.audioFile;
    if (!audioUrl) {
      return NextResponse.json({ error: 'Audio file URL not returned' }, { status: 500 });
    }

    // Step 3: Download audio buffer
    const audioBuffer = await axios.get(audioUrl, { responseType: 'arraybuffer' });

    // Step 4: Upload to Cloudinary
    const publicId = `${id}`;
    const cloudinaryUrl = await uploadMediaToCloudinary(Buffer.from(audioBuffer.data), publicId, 'raw');

    return NextResponse.json({ audioUrl: cloudinaryUrl });
  } catch (error) {
    const details = error?.response?.data || error.message;
    console.error('Murf TTS Error:', details);
    return NextResponse.json({ error: 'Failed to generate audio', details }, { status: 500 });
  }
}
