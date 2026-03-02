'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { VideoData } from '@/lib/types';

interface WordFrequency {
  text: string;
  value: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
}

interface WordcloudChartProps {
  data: VideoData[];
}

// Color scheme untuk setiap topik (disesuaikan dengan tema dashboard)
const TOPIC_COLORS: Record<string, string[]> = {
  'default': ['hsl(var(--primary))', 'hsl(var(--primary)/0.8)', 'hsl(var(--primary)/0.6)', 'hsl(var(--primary)/0.4)', 'hsl(var(--primary)/0.2)'],
  'all': ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#312e81'],
  'Hiburan': ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'],
  'Teknologi': ['#10b981', '#059669', '#047857', '#065f46', '#064e3b'],
  'Kesehatan': ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f'],
  'Pendidikan': ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'],
  'Bisnis': ['#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63'],
  'Olahraga': ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
  'Politik': ['#ec4899', '#db2777', '#be185d', '#9d174d', '#831843'],
  'Sosial': ['#84cc16', '#65a30d', '#4d7c0f', '#365314', '#1a2e05'],
  'Lifestyle': ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87']
};

export default function WordcloudChart({ data }: WordcloudChartProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [wordPositions, setWordPositions] = useState<WordFrequency[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dapatkan semua topik yang unik
  const topics = useMemo(() => {
    const uniqueTopics = Array.from(new Set(data.map(item => item.Topic_Label).filter(Boolean)));
    return ['all', ...uniqueTopics.sort()];
  }, [data]);

  // Generate word frequencies berdasarkan topik yang dipilih
  const rawWordFrequencies = useMemo(() => {
    const filteredData = selectedTopic === 'all' 
      ? data 
      : data.filter(item => item.Topic_Label === selectedTopic);
    
    // Gabungkan semua teks_final
    const allTexts = filteredData
      .map(item => item.teks_final)
      .filter(Boolean)
      .join(' ');
    
    if (!allTexts.trim()) return [];
    
    // Hitung frekuensi kata
    const words = allTexts.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w\s]/g, '').trim();
      if (cleanWord.length > 2) { // Filter kata yang terlalu pendek
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
    
    // Convert ke array dan sort berdasarkan frekuensi
    return Object.entries(wordCount)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50); // Ambil top 50 kata
  }, [data, selectedTopic]);

  // Function to generate random positions for words (spiral algorithm)
  const generateWordPositions = (words: { text: string; value: number }[]): WordFrequency[] => {
    if (words.length === 0) return [];
    
    const centerX = 250; // Center for half-width layout
    const centerY = 192; // Center of 384px height  
    const maxRadius = 150;
    const colors = TOPIC_COLORS[selectedTopic] || TOPIC_COLORS['default'];
    
    const maxFreq = Math.max(...words.map(w => w.value));
    const minFreq = Math.min(...words.map(w => w.value));
    
    return words.map((word, index) => {
      // Calculate font size (8px to 48px)
      const fontSize = Math.max(8, Math.min(48, 
        8 + ((word.value - minFreq) / (maxFreq - minFreq)) * 40
      ));
      
      // Spiral positioning algorithm
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
      const radius = Math.min(maxRadius, Math.sqrt(index + 1) * 25);
      
      // Add some randomness
      const randomOffset = (Math.random() - 0.5) * 60;
      const x = centerX + Math.cos(angle) * radius + randomOffset;
      const y = centerY + Math.sin(angle) * radius + randomOffset * 0.5;
      
      // Random rotation (-45 to 45 degrees, with preference for horizontal)
      const rotations = [0, 0, 0, 90, -90, 45, -45]; // More horizontal words
      const rotation = rotations[Math.floor(Math.random() * rotations.length)];
      
      return {
        text: word.text,
        value: word.value,
        x: Math.max(fontSize/2, Math.min(500 - fontSize * word.text.length * 0.5, x)),
        y: Math.max(fontSize, Math.min(340, y)),
        fontSize,
        color: colors[index % colors.length],
        rotation
      };
    });
  };

  // Update word positions when data changes
  useEffect(() => {
    if (rawWordFrequencies.length > 0) {
      setIsGenerating(true);
      // Add slight delay for smoother transition
      const timer = setTimeout(() => {
        setWordPositions(generateWordPositions(rawWordFrequencies));
        setIsGenerating(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setWordPositions([]);
      setIsGenerating(false);
    }
  }, [rawWordFrequencies, selectedTopic]);

  // Generate advanced word cloud display
  const generateWordCloudDisplay = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm">Generating word cloud...</p>
          </div>
        </div>
      );
    }

    if (wordPositions.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <p className="text-sm">Tidak ada data teks untuk topik ini</p>
        </div>
      );
    }

    return (
      <div 
        ref={containerRef}
        className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-background to-muted/20 rounded-lg border"
        style={{ minHeight: '384px' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Word cloud */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {wordPositions.map((word, index) => (
            <g key={`${word.text}-${index}`}>
              {/* Word shadow/glow effect */}
              <text
                x={word.x}
                y={word.y}
                fontSize={word.fontSize}
                fill="currentColor"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${word.rotation} ${word.x} ${word.y})`}
                className="opacity-20 blur-sm"
                style={{
                  fontWeight: word.fontSize > 24 ? 'bold' : word.fontSize > 16 ? '600' : 'normal',
                  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
                }}
              >
                {word.text}
              </text>
              
              {/* Main word */}
              <text
                x={word.x}
                y={word.y}
                fontSize={word.fontSize}
                fill={word.color}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${word.rotation} ${word.x} ${word.y})`}
                className="cursor-pointer transition-all duration-500 ease-out animate-in fade-in-0 zoom-in-95"
                style={{
                  fontWeight: word.fontSize > 24 ? 'bold' : word.fontSize > 16 ? '600' : 'normal',
                  fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(4px 4px 12px rgba(0,0,0,0.3))';
                  e.currentTarget.style.transform = `rotate(${word.rotation}deg) scale(1.15)`;
                  e.currentTarget.style.transformOrigin = `${word.x}px ${word.y}px`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))';
                  e.currentTarget.style.transform = `rotate(${word.rotation}deg) scale(1)`;
                }}
              >
                {word.text}
                <title>{`${word.text}: muncul ${word.value} kali`}</title>
              </text>
            </g>
          ))}
        </svg>

        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    );
  };

  const refreshWordCloud = () => {
    if (rawWordFrequencies.length > 0) {
      setIsGenerating(true);
      setTimeout(() => {
        setWordPositions(generateWordPositions(rawWordFrequencies));
        setIsGenerating(false);
      }, 300);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Word Cloud Analysis</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshWordCloud}
            disabled={wordPositions.length === 0 || isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Refresh Layout
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-medium whitespace-nowrap">Filter by Topic:</label>
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Pilih topik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Topik</SelectItem>
              {topics.slice(1).map(topic => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground flex items-center justify-between">
          <span>
            {selectedTopic === 'all' 
              ? `Menampilkan kata-kata dari ${data.length} video`
              : `Menampilkan kata-kata dari topik "${selectedTopic}"`
            }
          </span>
          <span className="text-xs">
            Hover pada kata untuk melihat frekuensi
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {generateWordCloudDisplay()}
      </CardContent>
    </Card>
  );
}