import { renderMedia } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { uploadMediaToCloudinary } from '@/configs/cloudinary';
import RemotionVideo from '@/app/dashboard/_components/RemotionVideo';

export async function POST(req) {
  try {
    const { script, imageList, audioFileUrl, captions, id } = await req.json();

    if (!script || !imageList || !audioFileUrl || !captions || !id) {
      return new Response(JSON.stringify({ error: 'Missing required params' }), { status: 400 });
    }

    // Temp output path for video
    const tempOutputPath = path.join(os.tmpdir(), `${id}.mp4`);

    // Render video using Remotion renderer programmatically
    await renderMedia({
      composition: {
        id: 'Main', // use your actual composition id if different
        component: RemotionVideo,
        durationInFrames: 300, // or calculate dynamically based on captions length & fps
        fps: 30,
        width: 300,
        height: 500,
      },
      codec: 'h264',
      outputLocation: tempOutputPath,
      inputProps: { script, imageList, audioFileUrl, captions, setDurationInFrame: () => {} },
    });

    // Read video file buffer
    const videoBuffer = await fs.readFile(tempOutputPath);

    // Upload video buffer to Cloudinary
    const cloudinaryUrl = await uploadMediaToCloudinary(videoBuffer, `videos/${id}`, 'video');

    // Clean up temp file
    await fs.unlink(tempOutputPath);

    return new Response(JSON.stringify({ videoUrl: cloudinaryUrl }), { status: 200 });
  } catch (error) {
    console.error('Video generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
