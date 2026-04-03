import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Server AI key is not configured." },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelNames = [
      "gemini-flash-latest",
      "gemini-2.0-flash-lite",
      "gemini-2.0-flash",
    ];

    let rawResponse = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        rawResponse = await result.response.text();
        lastError = null;
        break;
      } catch (error) {
        const message = error?.message || "";
        const isRetryable = message.includes("503") || message.includes("429");
        lastError = error;
        if (!isRetryable) {
          throw error;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }

    return NextResponse.json({ rawResponse });
  } catch (error) {
    const message =
      error?.message || "Unable to generate content. Please try again.";
    const status = message.includes("429")
      ? 429
      : message.includes("503")
        ? 503
        : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Server AI key is not configured." },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey,
    );

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const errorMessage =
        errorPayload?.error?.message || "Unable to list models.";
      return NextResponse.json({ message: errorMessage }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error?.message || "Unable to list models. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
