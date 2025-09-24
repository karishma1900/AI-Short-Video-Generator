"use client";
import React, { useContext, useEffect, useState } from "react";
import { VideoDataContext } from "@/app/_context/VideoDataContext";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import CustomLoading from "./_components/CustomLoading";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import PlayerDialog from "../_components/PlayerDialog";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { Users } from "lucide-react";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function CreateNew() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, SetVideoId] = useState();


  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = async () => {
   
    setLoading(true);
    await GetVideoScript();
  };

  const GetVideoScript = async () => {
    const durationMap = {
      "30 Seconds": 30,
      "60 Seconds": 60,
    };

    const durationNumber = durationMap[formData.duration] || 30;

    const prompt = `
You are generating a script for an AI-generated short video.

Requirements:
- Duration: ${durationNumber} seconds
- Topic: "${formData.topic}"
- Visual Style: ${formData.imageStyle}

Instructions:
- Break the video into multiple scenes (around 5–7 for 30 seconds, or 10–12 for 60 seconds).
- For each scene, generate:
  - "content_text": the narration line (short, engaging, clear)
  - "image_prompt": a descriptive prompt for generating an image in the selected style

Important:
- Return ONLY a valid JSON object.
- The object must have a single key: "video_script"
- "video_script" must be an array of scenes.
- Each scene must be an object with keys "content_text" and "image_prompt".

Example Output Format:
{
  "video_script": [
    {
      "content_text": "The sun rises over the ancient pyramids of Egypt.",
      "image_prompt": "A golden sunrise over the pyramids in Egyptian desert, cinematic style"
    },
    {
      "content_text": "Camels trek across the sandy dunes.",
      "image_prompt": "A caravan of camels walking through desert dunes, photorealistic, warm tones"
    }
    // more scenes...
  ]
}
`;


    try {
      const resp = await axios.post("/api/get-video-script", { prompt });
      const scriptResult = resp.data.result;

      console.log("✅ Video Script:", scriptResult);

      setVideoData((prev) => ({
        ...prev,
        videoScript: scriptResult,
      }));

      const generatedAudioUrl = await GenerateAudioFile(scriptResult);

      if (generatedAudioUrl) {
        await GenerateAudioCaption(generatedAudioUrl);
      }

      await GenerateImage(scriptResult.video_script);
    } catch (err) {
      console.error("❌ Failed to get video script:", err);
    }
  };

  const GenerateAudioFile = async (videoScriptData) => {
    let script = "";
    const id = uuidv4();
    const scriptArray = videoScriptData.video_script;

    if (Array.isArray(scriptArray)) {
      scriptArray.forEach((scene) => {
        script += scene.content_text + " ";
      });

      const resp = await axios.post("/api/generate-audio", {
        text: script,
        id: id,
      });

      console.log("✅ Audio URL:", resp.data.audioUrl);

      setAudioUrl(resp.data.audioUrl);
      setVideoData((prev) => ({
        ...prev,
        audioFileUrl: resp.data.audioUrl,
      }));

      return resp.data.audioUrl;
    } else {
      console.error("❌ Invalid video script format");
      return null;
    }
  };

  const GenerateAudioCaption = async (fileUrl) => {
    try {
      const resp = await axios.post("/api/generate-caption", {
        audioFileUrl: fileUrl,
      });

      console.log("✅ Captions generated:", resp.data.result);

      setCaptions(resp.data.result);
      setVideoData((prev) => ({
        ...prev,
        captions: resp.data.result,
      }));
    } catch (err) {
      console.error("❌ Caption generation failed:", err);
    }
  };

  const GenerateImage = async (scriptArray) => {
    const images = [];

    for (const scene of scriptArray) {
      try {
        const response = await axios.post("/api/generate-image", {
          prompt: scene.image_prompt,
        });

        const imageUrl = response?.data?.imageUrl;
        const fullUrl = imageUrl?.startsWith("/")
          ? `${window.location.origin}${imageUrl}`
          : imageUrl;

        if (fullUrl) {
          images.push(fullUrl);
        } else {
          console.warn("⚠️ No image URL for prompt:", scene.image_prompt);
        }
      } catch (error) {
        console.error("❌ Image generation failed:", error);
      }
    }

    console.log("✅ Generated image URLs:", images);

    if (images.length > 0) {
      setImageList(images);
      setVideoData((prev) => ({
        ...prev,
        imageList: images,
      }));
    }
  };

  // ✅ Save to DB only when all data is present
  useEffect(() => {
    const ready =
      videoData.videoScript &&
      videoData.audioFileUrl &&
      videoData.captions &&
      videoData.imageList?.length > 0;

    if (ready) {
      console.log("🚀 All video data ready:", videoData);
      saveVideoData(videoData);
    }
  }, [videoData]);

  const saveVideoData = async () => {
    try {
      const result = await db
        .insert(VideoData)
        .values({
          script: videoData?.videoScript,
          audioFileUrl: videoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        })
        .returning({ id: VideoData.id });
     
      SetVideoId(result[0].id);
      setPlayVideo(true);
      console.log("✅ Saved video data to DB:", result);
    } catch (err) {
      console.error("❌ Failed to save video data:", err);
    } finally {
      setLoading(false); // 🛑 Stop loader only here
    }
  };
  // used to update user credits
  const UpdateUserCredits = async () => {
    if (!userDetail || typeof userDetail.credits !== "number") {
      console.error(
        "❌ Cannot update credits: userDetail is missing or malformed",
        userDetail
      );
      return;
    }

    const newCredits = userDetail.credits - 10;

    const result = await db
      .update(Users)
      .set({ credits: newCredits })
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    console.log("✅ Credits updated:", result);

    setUserDetail((prev) => ({
      ...prev,
      credits: newCredits,
    }));
  };

  return (
    <div >
      <h2 className="font-bold text-4xl text-white text-center">
        Create New
      </h2>

      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />

        <Button
          className="mt-10 w-full cursor-pointer"
          onClick={onCreateClickHandler}
        >
          Create Short Video
        </Button>
      </div>

      <CustomLoading loading={loading} />

      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  );
}

export default CreateNew;
