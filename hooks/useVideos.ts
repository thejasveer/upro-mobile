import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export interface Video {
  id: number;
  url: string | null;
  name: string | null;
  description: string | null;
  created_at: string;
}

export interface StorageVideo {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: any;
  url?: string; // We'll add the public URL here
}

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [storageVideos, setStorageVideos] = useState<StorageVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for manually entered video URL
  const [manualVideoUrl, setManualVideoUrl] = useState<string>("");
  const [isUsingManualUrl, setIsUsingManualUrl] = useState<boolean>(false);

  // Function to set a manual video URL
  const setVideoUrl = (url: string) => {
    console.log("🎯 Setting manual video URL:", url);
    setManualVideoUrl(url);
    setIsUsingManualUrl(true);
    setError(null);
  };

  // Function to clear manual URL and go back to database/storage
  const clearManualUrl = () => {
    console.log("🔄 Clearing manual video URL");
    setManualVideoUrl("");
    setIsUsingManualUrl(false);
  };

  // Function to get the current active video URL
  const getCurrentVideoUrl = (): string | null => {
    if (isUsingManualUrl && manualVideoUrl) {
      console.log("🎯 Using manual video URL:", manualVideoUrl);
      return manualVideoUrl;
    }

    const firstVideo = getFirstVideo();
    if (firstVideo?.url) {
      console.log("🎯 Using database video URL:", firstVideo.url);
      return firstVideo.url;
    }

    const firstStorageVideo = getFirstStorageVideo();
    if (firstStorageVideo?.url) {
      console.log("🎯 Using storage video URL:", firstStorageVideo.url);
      return firstStorageVideo.url;
    }

    console.log("⚠️ No video URL available");
    return null;
  };

  // Existing function - gets videos from database table
  const getVideos = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching videos from Supabase table...");

      const { data, error } = await supabase.from("videos").select("*");

      console.log("📊 Videos query result:", { data, error });

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

  // New function - gets videos from storage bucket
  const getVideosFromBucket = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching videos from storage bucket...");

      const { data, error } = await supabase.storage.from("videos").list("", {
        limit: 100,
        offset: 0,
      });

      console.log("📊 Storage videos query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching videos from bucket:", error);
        setError(error.message);
        return;
      }

      // Get public URLs for each video
      const videosWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from("videos")
            .getPublicUrl(file.name);

          return {
            ...file,
            url: urlData.publicUrl,
          };
        })
      );

      console.log("✅ Storage videos fetched successfully:", videosWithUrls);
      setStorageVideos(videosWithUrls);
    } catch (err) {
      console.error("❌ Exception fetching videos from bucket:", err);
      setError("Failed to fetch videos from bucket");
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

  const getFirstStorageVideo = (): StorageVideo | null => {
    if (storageVideos.length === 0) {
      console.log("⚠️ No storage videos available");
      return null;
    }
    const firstVideo = storageVideos[0];
    console.log("🎯 First storage video selected:", firstVideo);
    return firstVideo;
  };

  useEffect(() => {
    // Only fetch from database if not using manual URL
    if (!isUsingManualUrl) {
      getVideos();
    } else {
      setLoading(false);
    }
  }, [isUsingManualUrl]);

  return {
    // Table-based videos
    videos,
    loading,
    error,
    getVideos,
    getFirstVideo,

    // Storage bucket videos
    storageVideos,
    getVideosFromBucket,
    getFirstStorageVideo,

    // Manual video URL functionality
    manualVideoUrl,
    isUsingManualUrl,
    setVideoUrl,
    clearManualUrl,
    getCurrentVideoUrl,
  };
};
