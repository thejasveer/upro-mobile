import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export interface Video {
  id: number;
  url: string | null;
  name: string | null;
  description: string | null;
  created_at: string;
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getVideos = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching videos from Supabase...");
      
      // First, let's try a simple query without ordering
      const { data, error } = await supabase
        .from("videos")
        .select("*");

      console.log("📊 Videos query result:", { data, error });
      console.log("📊 Raw data length:", data?.length);
      console.log("📊 First video if exists:", data?.[0]);

      if (error) {
        console.error("❌ Error fetching videos:", error);
        setError(error.message);
        return;
      }

      console.log("✅ Videos fetched successfully:", data);
      setVideos(data || []);
    } catch (err) {
      console.error("❌ Exception fetching videos:", err);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const getFirstVideo = (): Video | null => {
    if (videos.length === 0) {
      console.log("⚠️ No videos available");
      return null;
    }
    const firstVideo = videos[0];
    console.log("🎯 First video selected:", firstVideo);
    return firstVideo;
  };

  useEffect(() => {
    getVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    getVideos,
    getFirstVideo,
  };
}; 