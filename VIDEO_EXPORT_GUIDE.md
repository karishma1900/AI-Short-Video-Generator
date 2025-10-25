# Video Export Feature Guide

## Overview
The AI Short Video Generator now includes video export functionality that allows you to save rendered videos locally and access them via Cloudinary.

## How It Works

### 1. Export Process
When you click the "Export Video" button in the player dialog:
- The video is rendered using Remotion with the proper duration based on captions
- The rendered video is saved to `public/exports/{videoId}.mp4`
- The video is also uploaded to Cloudinary for cloud access
- You get both a local file path and cloud URL

### 2. File Structure
```
project/
├── public/
│   └── exports/          # Exported videos are saved here
│       └── {videoId}.mp4 # Individual video files
```

### 3. Using the Export Feature

#### Step 1: Generate a Video
1. Navigate to the dashboard
2. Click "Create New" to generate a video
3. Wait for the video to be processed

#### Step 2: Export the Video
1. Click on the video in your video list to preview it
2. In the player dialog, click the "Export Video" button
3. Wait for the export process to complete (button will show "Exporting...")

#### Step 3: Download or View
Once exported, you'll see:
- A success message showing the file path
- A "Download Video" button to save the video to your device
- A "View on Cloud" button to open the video on Cloudinary

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
Before building, ensure you have the required environment variables:

```env
# Clerk Authentication (required for build)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Add other required API keys for video generation
```

Then build:
```bash
npm run build
npm start
```

## Technical Details

### API Endpoint: `/api/generate-video`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "id": "video-id",
    "script": "video script",
    "imageList": ["image1.png", "image2.png"],
    "audioFileUrl": "audio-url",
    "captions": [{"start": 0, "end": 1000, "text": "caption"}]
  }
  ```
- **Response**:
  ```json
  {
    "videoUrl": "cloudinary-url",
    "videoPath": "/exports/video-id.mp4"
  }
  ```

### Video Specifications
- **Resolution**: 300x500 (vertical/portrait format)
- **Frame Rate**: 30 FPS
- **Codec**: H.264
- **Duration**: Auto-calculated from captions

### Export Directory
The `/public/exports` directory is:
- Created automatically when needed
- Added to `.gitignore` to avoid committing large video files
- Accessible via the public URL path `/exports/{videoId}.mp4`

## Troubleshooting

### Build Errors
If you encounter build errors related to Clerk:
1. Ensure you have valid Clerk API keys in your `.env` file
2. Get your keys from: https://dashboard.clerk.com/last-active?path=api-keys
3. Add them to your `.env` file

### Export Not Working
If video export fails:
1. Check console for error messages
2. Ensure all required data (script, images, audio, captions) is present
3. Verify that the `public/exports` directory is writable
4. Check that Cloudinary credentials are configured

### Missing Videos
If exported videos don't appear:
1. Check the `public/exports` directory
2. Verify the video ID matches the file name
3. Ensure the export process completed without errors

## Notes
- Exported videos remain in the `public/exports` folder until manually deleted
- Videos are accessible via both local file system and Cloudinary
- The export process includes automatic duration calculation based on caption timing
- Both local and cloud storage options are provided for flexibility
