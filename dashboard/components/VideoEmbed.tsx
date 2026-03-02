'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle, Play } from 'lucide-react';

interface VideoEmbedProps {
  videoUrl: string;
  platform: string;
  videoId: number;
}

export default function VideoEmbed({ videoUrl, platform, videoId }: VideoEmbedProps) {
  // Extract video ID and create embed URL based on platform
  const embedInfo = useMemo(() => {
    if (!videoUrl) return null;

    // Instagram handling
    if (videoUrl.includes('instagram.com')) {
      // Instagram doesn't allow direct embedding, but we can show a nice preview
      return {
        type: 'instagram',
        embedUrl: null,
        originalUrl: videoUrl,
        canEmbed: false,
        message: 'Instagram videos require opening in new tab',
        showPreview: true
      };
    }

    // YouTube handling
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
      }
      
      if (videoId) {
        return {
          type: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          originalUrl: videoUrl,
          canEmbed: true,
          videoId
        };
      }
    }

    // TikTok handling
    if (videoUrl.includes('tiktok.com')) {
      return {
        type: 'tiktok',
        embedUrl: null,
        originalUrl: videoUrl,
        canEmbed: false,
        message: 'TikTok videos require special embedding'
      };
    }

    // Google Drive handling
    if (videoUrl.includes('drive.google.com')) {
      // Extract file ID from Google Drive URL
      let fileIdMatch = videoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      
      // Also handle sharing URLs like https://drive.google.com/file/d/FILE_ID/view
      if (!fileIdMatch) {
        fileIdMatch = videoUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      }
      
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return {
          type: 'google-drive',
          embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          originalUrl: videoUrl,
          canEmbed: true,
          fileId
        };
      }
    }

    // Vimeo handling
    if (videoUrl.includes('vimeo.com')) {
      const vimeoIdMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
      if (vimeoIdMatch) {
        const videoId = vimeoIdMatch[1];
        return {
          type: 'vimeo',
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
          originalUrl: videoUrl,
          canEmbed: true,
          videoId
        };
      }
    }

    // Facebook handling
    if (videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch')) {
      return {
        type: 'facebook',
        embedUrl: null,
        originalUrl: videoUrl,
        canEmbed: false,
        message: 'Facebook videos require opening in new tab'
      };
    }

    // Generic video URL (mp4, etc.)
    if (videoUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
      return {
        type: 'direct',
        embedUrl: videoUrl,
        originalUrl: videoUrl,
        canEmbed: true
      };
    }

    // Fallback for unknown URLs
    return {
      type: 'unknown',
      embedUrl: null,
      originalUrl: videoUrl,
      canEmbed: false,
      message: 'Video format not supported for embedding'
    };
  }, [videoUrl]);

  const openOriginal = () => {
    if (embedInfo?.originalUrl) {
      window.open(embedInfo.originalUrl, '_blank');
    }
  };

  if (!embedInfo) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <div className="text-center space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p>No video URL available</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!embedInfo.canEmbed) {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
          {/* Instagram-style preview */}
          {embedInfo.type === 'instagram' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[3px]">
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                      <Play className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Instagram Video</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                    Click to view on Instagram
                  </p>
                </div>
                <Button onClick={openOriginal} className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none">
                  <ExternalLink className="h-4 w-4" />
                  Open Instagram
                </Button>
              </div>
            </div>
          )}

          {/* TikTok-style preview */}
          {embedInfo.type === 'tiktok' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-cyan-400 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-white">TikTok Video</h3>
                  <p className="text-sm text-gray-300 max-w-sm">
                    Click to view on TikTok
                  </p>
                </div>
                <Button onClick={openOriginal} className="gap-2 bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white border-none">
                  <ExternalLink className="h-4 w-4" />
                  Open TikTok
                </Button>
              </div>
            </div>
          )}

          {/* Facebook preview */}
          {embedInfo.type === 'facebook' && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-xl bg-white flex items-center justify-center">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-white">Facebook Video</h3>
                  <p className="text-sm text-blue-100 max-w-sm">
                    Click to view on Facebook
                  </p>
                </div>
                <Button onClick={openOriginal} className="gap-2 bg-white hover:bg-gray-100 text-blue-600 border-none">
                  <ExternalLink className="h-4 w-4" />
                  Open Facebook
                </Button>
              </div>
            </div>
          )}

          {/* Generic preview */}
          {embedInfo.type === 'unknown' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <Play className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="font-medium">Video Preview Unavailable</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {embedInfo.message}
                  </p>
                </div>
                <Button onClick={openOriginal} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open Video
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Platform info footer */}
        <div className="p-4 bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Platform: <span className="font-medium">{platform}</span>
            </span>
            <span className="text-muted-foreground">
              Type: <span className="font-medium capitalize">{embedInfo.type}</span>
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Render embeddable video
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {embedInfo.type === 'youtube' && (
          <iframe
            src={embedInfo.embedUrl}
            title={`Video ${videoId}`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {embedInfo.type === 'google-drive' && (
          <iframe
            src={embedInfo.embedUrl}
            title={`Video ${videoId}`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay"
          />
        )}

        {embedInfo.type === 'vimeo' && (
          <iframe
            src={embedInfo.embedUrl}
            title={`Video ${videoId}`}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}

        {embedInfo.type === 'direct' && (
          <video
            controls
            className="w-full h-full"
            preload="metadata"
          >
            <source src={embedInfo.embedUrl} type="video/mp4" />
            <source src={embedInfo.embedUrl} type="video/webm" />
            <source src={embedInfo.embedUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Overlay with original link */}
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={openOriginal}
            className="gap-2 bg-black/50 hover:bg-black/70 text-white border-none"
          >
            <ExternalLink className="h-3 w-3" />
            Original
          </Button>
        </div>
      </div>

      {/* Video Info Footer */}
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Platform: <span className="font-medium">{platform}</span>
          </span>
          <span className="text-muted-foreground">
            Type: <span className="font-medium capitalize">{embedInfo.type.replace('-', ' ')}</span>
          </span>
        </div>
      </div>
    </Card>
  );
}