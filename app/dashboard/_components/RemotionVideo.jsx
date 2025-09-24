'use client'
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  interpolate,
} from "remotion";

function RemotionVideo({
  script,
  imageList,
  audioFileUrl,
  captions,
  setDurationInFrame,
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [frameDuration, setFrameDuration] = useState(100);

  useEffect(() => {
    if (!Array.isArray(captions) || captions.length === 0) {
      console.error("❌ Captions are missing or invalid:", captions);
    }

    if (!audioFileUrl) {
      console.error("❌ audioFileUrl is missing or invalid:", audioFileUrl);
    }

    if (!Array.isArray(imageList) || imageList.length === 0) {
      console.error("❌ Image list is missing or invalid:", imageList);
    }
  }, [captions, audioFileUrl, imageList]);

  const getDurationFrames = () => {
    if (!captions || captions.length === 0) return 100;
    return (captions[captions.length - 1]?.end / 1000) * fps;
  };

  const getCurrentCaptions = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption.text : "";
  };

  useEffect(() => {
    if (captions?.length > 0) {
      const duration = getDurationFrames();
      setFrameDuration(duration);
      setDurationInFrame(duration);
    }
  }, [captions, fps, setDurationInFrame]);

  const totalDuration = getDurationFrames();
  const perImageDuration =
    imageList?.length > 0 ? totalDuration / imageList.length : 100;

  // ✅ Move scale function outside useEffect
  const scale = (index, startTime) => {
    return interpolate(
      frame,
      [startTime, startTime + perImageDuration / 2, startTime + perImageDuration],
      index % 2 === 0 ? [1, 1.1, 1] : [1.1, 1, 1.1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
  };

  return (
    <AbsoluteFill className="bg-black">
      {imageList?.map((item, index) => {
        const startTime = index * perImageDuration;

        return (
          <Sequence
            key={index}
            from={Math.floor(startTime)}
            durationInFrames={Math.floor(perImageDuration)}
          >
            <Img
              src={item}
              style={{
                transform: `scale(${scale(index, startTime)})`,
              }}
            />
            <AbsoluteFill
              style={{
                position: "absolute",
                bottom: "40px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                padding: "0 20px",
                textAlign: "center",
              }}
            >
              <h2 className="text-2xl font-bold shadow-md bg-black/60 px-4 py-2 rounded-lg">
                {getCurrentCaptions()}
              </h2>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <Audio
        src={`/api/proxy-audio?url=${encodeURIComponent(audioFileUrl)}`}
      />
    </AbsoluteFill>
  );
}

export default RemotionVideo;
