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
  const [videoPath, setVideoPath] = useState(null); // <-- Changed from videoUrl to videoPath

  useEffect(() => {
    if (playVideo && videoId) {
      setOpenDialog(true);
      GetVideoData();
      setVideoPath(null); // Reset videoPath on new video open
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

  // NEW: Function to handle export button click to local storage
  const exportVideoToLocal = async () => {
    if (!videoData) return;

    try {
      setIsExporting(true);

      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...videoData, id: videoId }), // Pass videoId to the API
      });

      const data = await res.json();

      if (data.videoPath) {
        setVideoPath(data.videoPath); // Set the local path
        alert(`✅ Video saved locally at: ${data.videoPath}`);
      } else {
        alert("❌ Failed to save video locally.");
      }
    } catch (e) {
      alert("❌ Error saving video: " + e.message);
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

            {/* Show local video path if available */}
            {videoPath && (
              <p className="mt-4 text-green-600 break-words">
                Video Path: <span className="font-mono">{videoPath}</span>
              </p>
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
              {/* UPDATED Export button with new function */}
              <Button
                className="cursor-pointer"
                onClick={exportVideoToLocal}
                disabled={isExporting}
              >
                {isExporting ? "Saving..." : "Save to Local Folder"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PlayerDialog;