"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../../../../../../components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { db } from "../../../../../../utils/db";
import { UserAnswer } from "../../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordQuestionSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const extractJsonObject = (text) => {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("AI response did not contain a JSON object.");
    }
    return JSON.parse(text.substring(jsonStart, jsonEnd + 1));
  };
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prevAnswer) => prevAnswer + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (error) {
      toast(error);
      return;
    }
    if (isRecording) {
      stopSpeechToText();
      console.log(userAnswer);
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    try {
      const feedbackPrompt = [
        "Return ONLY valid JSON. Do NOT include markdown, code fences, or extra text.",
        'Output schema: {"rating": ' + '"1-10", "feedback": "string"}',
        "Feedback must be 3 to 5 lines.",
        `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}`,
        `User Answer: ${userAnswer}`,
      ].join("\n");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: feedbackPrompt }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const errorMessage =
          errorPayload?.message || "AI request failed. Please try again.";
        throw new Error(errorMessage);
      }

      const { rawResponse } = await response.json();
      const JsonFeedbackResp = extractJsonObject(rawResponse);
      console.log(JsonFeedbackResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });
      if (resp) {
        toast("User Answer Recorded successfully.");
        setUserAnswer("");
        setResults([]);
      }
      setResults([]);
    } catch (updateError) {
      const message =
        updateError?.message || "Unable to save answer. Please try again.";
      toast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center p-5 mt-20 bg-black rounded-lg">
          <Image
            src="/webcam3.png"
            alt="WebCAM"
            width={140}
            height={140}
            className="absolute"
          />
          <Webcam
            mirrored={true}
            style={{
              height: 300,
              width: "100%",
              zIndex: 100,
            }}
          />
        </div>
        <Button
          disabled={loading}
          variant="outline"
          className="my-10"
          onClick={StartStopRecording}
        >
          {isRecording ? (
            <h2 className="flex items-center gap-2 text-red-1 animate-pulse">
              <StopCircle />
              Stop Recording...
            </h2>
          ) : (
            <h2 className="flex items-center gap-2">
              <Mic /> Record Answer
            </h2>
          )}
        </Button>
      </div>
    </>
  );
}

export default RecordQuestionSection;
