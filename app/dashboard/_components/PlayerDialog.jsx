'use client'
import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { eq } from "drizzle-orm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RemotionVideo from "./RemotionVideo";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { useRouter } from "next/navigation";

function PlayerDialog({ playVideo, videoId }) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);

  useEffect(() => {
    if (playVideo && videoId) {
      setOpenDialog(true);
      GetVideoData();
      setVideoPath(null);
      setCloudinaryUrl(null);
    }
  }, [playVideo, videoId]);

  const GetVideoData = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData.id, videoId));

    if (!result || result.length === 0) {
      console.error("❌ No video data found for ID:", videoId);
      return;
    }

    const data = result[0];

    if (!data?.audioFileUrl) {
      console.error("❌ audioFileUrl is missing in fetched video data");
    }

    setVideoData(data);
  };

  const exportVideoToLocal = async () => {
    if (!videoData) return;

    try {
      setIsExporting(true);

      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...videoData, id: videoId }),
      });

      const data = await res.json();

      if (data.videoPath) {
        setVideoPath(data.videoPath);
        setCloudinaryUrl(data.videoUrl);
      } else {
        alert("Failed to export video.");
      }
    } catch (e) {
      alert("Error exporting video: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="flex flex-col items-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold my-5">
              Your Video Is Ready
            </DialogTitle>

            <div>
              {videoData ? (
                <Player
                  component={RemotionVideo}
                  durationInFrames={Math.floor(durationInFrame)}
                  compositionWidth={300}
                  compositionHeight={500}
                  fps={30}
                  controls
                  inputProps={{
                    ...videoData,
                    setDurationInFrame: (value) => setDurationInFrame(value),
                  }}
                />
              ) : (
                <p>Loading video data...</p>
              )}
            </div>

            {videoPath && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg w-full">
                <p className="text-green-800 font-semibold mb-2">Export Successful</p>
                <p className="text-sm text-green-700 mb-3">
                  Video saved at: <span className="font-mono">{videoPath}</span>
                </p>
                <div className="flex gap-2">
                  <a
                    href={videoPath}
                    download={`video-${videoId}.mp4`}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    Download Video
                  </a>
                  {cloudinaryUrl && (
                    <a
                      href={cloudinaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View on Cloud
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-10 mt-10">
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() => {
                  setOpenDialog(false);
                  router.replace("/dashboard");
                }}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                onClick={exportVideoToLocal}
                disabled={isExporting}
              >
                {isExporting ? "Exporting..." : "Export Video"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PlayerDialog;