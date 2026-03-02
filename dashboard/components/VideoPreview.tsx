'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoData, getEmotionBadgeClass } from '@/lib/types';
import { NerDisplay } from '@/components/NerDisplay';
import VideoEmbed from '@/components/VideoEmbed';
import { ExternalLink, Play, RefreshCw, User, Calendar, Eye } from 'lucide-react';

interface VideoPreviewProps {
  data: VideoData[];
}

export default function VideoPreview({ data }: VideoPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get a sample video (rotate through available videos)
  const sampleVideo = useMemo(() => {
    if (data.length === 0) return null;
    return data[currentIndex % data.length];
  }, [data, currentIndex]);

  const handleNextSample = () => {
    if (data.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }
  };

  const openVideo = () => {
    if (sampleVideo?.Video) {
      window.open(sampleVideo.Video, '_blank');
    }
  };

  if (!sampleVideo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Video Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>No videos available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Video Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {data.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextSample}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Next Sample
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Video Info Header */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="font-medium">ID: {sampleVideo.id}</Badge>
              <Badge className={`${getEmotionBadgeClass(sampleVideo.Emotion)} text-lg px-3 py-1 font-bold shadow-sm`}>
                {sampleVideo.Emotion}
              </Badge>
              <Badge variant="outline">{sampleVideo.Platform}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Topic:</span>
              <span className="text-base font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {sampleVideo.Topic_Label}
              </span>
            </div>
          </div>
          <Button onClick={openVideo} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open Original
          </Button>
        </div>

        {/* Video Embed Section - Full Size Centered */}
        <VideoEmbed videoUrl={sampleVideo.Video} platform={sampleVideo.Platform} videoId={sampleVideo.id} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Summary & Keywords */}
          <div className="space-y-5">
            {/* Summary */}
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Summary
              </h4>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                <p className="text-sm leading-relaxed">
                  {sampleVideo.Summary || 'No summary available'}
                </p>
              </div>
            </div>

            {/* Topic Keywords */}
            <div className="space-y-3">
              <h4 className="font-semibold">Topic Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {sampleVideo.Topic_Keywords?.split(', ').map((keyword, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 px-3 py-1 font-medium">
                    {keyword.trim()}
                  </Badge>
                )) || <span className="text-sm text-muted-foreground">No keywords available</span>}
              </div>
            </div>
          </div>

          {/* Right Column - Entities & Analytics */}
          <div className="space-y-4">
            {/* Named Entities */}
            <div className="space-y-3">
              <h4 className="font-semibold">Named Entities Detected</h4>
              
              <div className="space-y-3">
                {/* Brand Entities */}
                {Array.isArray(sampleVideo.NER_Brand) && sampleVideo.NER_Brand.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400">🏢 Brands</h5>
                    <div className="flex flex-wrap gap-1">
                      {sampleVideo.NER_Brand.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Entities */}
                {Array.isArray(sampleVideo.NER_Location) && sampleVideo.NER_Location.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-green-600 dark:text-green-400">📍 Locations</h5>
                    <div className="flex flex-wrap gap-1">
                      {sampleVideo.NER_Location.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Organization Entities */}
                {Array.isArray(sampleVideo.NER_Organization) && sampleVideo.NER_Organization.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-purple-600 dark:text-purple-400">🏛️ Organizations</h5>
                    <div className="flex flex-wrap gap-1">
                      {sampleVideo.NER_Organization.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Person Entities */}
                {Array.isArray(sampleVideo.NER_Person) && sampleVideo.NER_Person.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-orange-600 dark:text-orange-400">👤 People</h5>
                    <div className="flex flex-wrap gap-1">
                      {sampleVideo.NER_Person.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Entities */}
                {Array.isArray(sampleVideo.NER_Product) && sampleVideo.NER_Product.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-pink-600 dark:text-pink-400">🛍️ Products</h5>
                    <div className="flex flex-wrap gap-1">
                      {sampleVideo.NER_Product.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* No entities message */}
                {(!Array.isArray(sampleVideo.NER_Brand) || sampleVideo.NER_Brand.length === 0) && 
                 (!Array.isArray(sampleVideo.NER_Location) || sampleVideo.NER_Location.length === 0) &&
                 (!Array.isArray(sampleVideo.NER_Organization) || sampleVideo.NER_Organization.length === 0) &&
                 (!Array.isArray(sampleVideo.NER_Person) || sampleVideo.NER_Person.length === 0) &&
                 (!Array.isArray(sampleVideo.NER_Product) || sampleVideo.NER_Product.length === 0) && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No named entities detected in this video
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 rounded-lg border">
              <h4 className="font-semibold mb-3">Analytics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {[
                      ...(Array.isArray(sampleVideo.NER_Brand) ? sampleVideo.NER_Brand : []),
                      ...(Array.isArray(sampleVideo.NER_Location) ? sampleVideo.NER_Location : []),
                      ...(Array.isArray(sampleVideo.NER_Organization) ? sampleVideo.NER_Organization : []),
                      ...(Array.isArray(sampleVideo.NER_Person) ? sampleVideo.NER_Person : []),
                      ...(Array.isArray(sampleVideo.NER_Product) ? sampleVideo.NER_Product : [])
                    ].length}
                  </div>
                  <div className="text-muted-foreground">Total Entities</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-green-600 dark:text-green-400">
                    {sampleVideo.Transcription?.split(' ').length || 0}
                  </div>
                  <div className="text-muted-foreground">Word Count</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}