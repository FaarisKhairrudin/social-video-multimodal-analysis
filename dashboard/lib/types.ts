export interface VideoData {
  id: number;
  Video: string;
  Platform: string;
  Transcription: string;
  Summary: string;
  NER_Brand?: string;
  NER_Location?: string;
  NER_Organization?: string;
  NER_Person?: string;
  NER_Product?: string;
  Emotion: string;
  Topic_ID: number;
  Topic_Label: string;
  Topic_Keywords: string;
  teks_final?: string;
  // Optional fields that might exist in the data
  publish_datetime?: string;
  duration_sec?: number;
  title?: string;
  views?: number;
  likes?: number;
  comments?: number;
  author?: string;
}

export interface FilterState {
  platforms: string[];
  emotions: string[];
  topics: string[];
  query: string;
  dateRange?: [Date, Date];
}

export interface TopicEmotionMatrix {
  topics: string[];
  emotions: string[];
  matrix: Map<string, number>; // key: "topic_emotion", value: count
}

export interface EntityFrequency {
  text: string;
  type: string;
  count: number;
  topics: string[];
}

export interface FilterOptions {
  platforms?: string[];
  emotions?: string[];
  topics?: string[];
  query?: string;
}

export interface TopicStats {
  topicId: number;
  topicLabel: string;
  count: number;
  keywords: string[];
  topBrands: Array<{ name: string; count: number }>;
  topProducts: Array<{ name: string; count: number }>;
  topLocations: Array<{ name: string; count: number }>;
}

export interface EmotionStats {
  emotion: string;
  count: number;
  percentage: number;
}

// Emotion color mapping
export const emotionColors: Record<string, string> = {
  Trust: "emerald",
  Proud: "amber", 
  Surprise: "violet",
  Neutral: "slate",
  Anger: "red",
  Fear: "orange",
  Sadness: "blue",
  Joy: "green",
  Anticipation: "cyan",
  Disgust: "pink"
};

// Topic color mapping (will be generated based on available topics)
export const getTopicColor = (topic: string): string => {
  const colors = [
    "blue", "green", "purple", "pink", "yellow", "indigo", 
    "red", "orange", "teal", "cyan", "lime", "rose"
  ];
  const hash = topic.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

export const getEmotionBadgeClass = (emotion: string): string => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const color = emotionColors[emotion] || "slate";
  
  return `${baseClasses} bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`;
};