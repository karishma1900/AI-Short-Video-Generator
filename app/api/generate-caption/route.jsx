import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json();

    if (!audioFileUrl) {
      return NextResponse.json({ error: "Missing audioFileUrl" }, { status: 400 });
    }

    const client = new AssemblyAI({
      apiKey: process.env.CAPTION_AI,
    });

    const transcript = await client.transcripts.transcribe({
      audio: audioFileUrl,
    });

    if (!transcript?.words) {
      return NextResponse.json({ error: "No words found in transcript" }, { status: 500 });
    }

    return NextResponse.json({ result: transcript.words });

  } catch (e) {
    console.error("Caption generation error:", e?.message || e);

    // AssemblyAI errors often have a `.details` property
    const errorMessage = e?.details || e?.message || "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
