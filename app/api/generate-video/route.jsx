import { renderMedia } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import { uploadMediaToCloudinary } from '@/configs/cloudinary';
import RemotionVideo from '@/app/dashboard/_components/RemotionVideo';

export async function POST(req) {
  try {
    const { script, imageList, audioFileUrl, captions, id } = await req.json();

    if (!script || !imageList || !audioFileUrl || !captions || !id) {
      return new Response(JSON.stringify({ error: 'Missing required params' }), { status: 400 });
    }

    const publicExportsDir = path.join(process.cwd(), 'public', 'exports');
    await fs.mkdir(publicExportsDir, { recursive: true });

    const outputPath = path.join(publicExportsDir, `${id}.mp4`);

    const fps = 30;
    let durationInFrames = 300;

    if (captions && captions.length > 0) {
      const lastCaption = captions[captions.length - 1];
      durationInFrames = Math.floor((lastCaption.end / 1000) * fps);
    }

    await renderMedia({
      composition: {
        id: 'Main',
        component: RemotionVideo,
        durationInFrames,
        fps,
        width: 300,
        height: 500,
      },
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: { script, imageList, audioFileUrl, captions, setDurationInFrame: () => {} },
    });

    const videoBuffer = await fs.readFile(outputPath);
    const cloudinaryUrl = await uploadMediaToCloudinary(videoBuffer, `videos/${id}`, 'video');

    return new Response(JSON.stringify({
      videoUrl: cloudinaryUrl,
      videoPath: `/exports/${id}.mp4`
    }), { status: 200 });
  } catch (error) {
    console.error('Video generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
