import Papa from 'papaparse';
import Fuse from 'fuse.js';
import { VideoData, FilterOptions, TopicStats, EmotionStats, TopicEmotionMatrix, EntityFrequency } from './types';
import { getAssetPath } from './utils/path';

export class DataService {
  private static instance: DataService;
  private data: VideoData[] = [];
  private fuse: Fuse<VideoData> | null = null;

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async loadData(): Promise<VideoData[]> {
    if (this.data.length > 0) {
      return this.data;
    }

    try {
      const csvPath = getAssetPath('data.csv');
      const response = await fetch(csvPath);
      const csvText = await response.text();
      
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transform: (value, field) => {
          // Transform specific fields
          if (field === 'id' || field === 'Topic_ID') {
            return parseInt(value) || 0;
          }
          // Handle NER fields - convert semicolon separated strings to arrays
          if (typeof field === 'string' && field.startsWith('NER_')) {
            if (!value || value === 'null' || value === '') {
              return [];
            }
            return value.split(';').map((item: string) => item.trim()).filter((item: string) => item);
          }
          return value;
        }
      });

      this.data = parseResult.data as VideoData[];
      
      // Initialize Fuse.js for fuzzy search
      this.fuse = new Fuse(this.data, {
        keys: [
          'Summary',
          'Topic_Keywords', 
          'Topic_Label',
          'Transcription',
          'NER_Brand',
          'NER_Location',
          'NER_Organization',
          'NER_Person',
          'NER_Product',
          'title'
        ],
        threshold: 0.4,
        includeScore: true
      });

      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  }

  getData(): VideoData[] {
    return this.data;
  }

  searchData(query: string): VideoData[] {
    if (!query.trim()) {
      return this.data;
    }

    if (this.fuse) {
      const results = this.fuse.search(query);
      return results.map(result => result.item);
    }

    // Fallback to simple string search
    const lowerQuery = query.toLowerCase();
    return this.data.filter(item => {
      // Search in basic text fields
      if (
        item.Summary?.toLowerCase().includes(lowerQuery) ||
        item.Topic_Keywords?.toLowerCase().includes(lowerQuery) ||
        item.Topic_Label?.toLowerCase().includes(lowerQuery) ||
        item.Transcription?.toLowerCase().includes(lowerQuery) ||
        item.title?.toLowerCase().includes(lowerQuery)
      ) {
        return true;
      }

      // Search in NER arrays
      const nerFields = [item.NER_Brand, item.NER_Location, item.NER_Organization, item.NER_Person, item.NER_Product];
      return nerFields.some(field => {
        if (Array.isArray(field)) {
          return field.some(entity => entity.toLowerCase().includes(lowerQuery));
        }
        return false;
      });
    });
  }

  getUniqueValues(field: keyof VideoData): string[] {
    const values = this.data.map(item => item[field] as string).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }

  getTopicEmotionMatrix(filteredData?: VideoData[]): TopicEmotionMatrix {
    const data = filteredData || this.data;
    const topics = this.getUniqueValues('Topic_Label');
    const emotions = this.getUniqueValues('Emotion');
    const matrix = new Map<string, number>();

    data.forEach(item => {
      const key = `${item.Topic_Label}_${item.Emotion}`;
      matrix.set(key, (matrix.get(key) || 0) + 1);
    });

    return { topics, emotions, matrix };
  }

  getTopKeywordsByTopic(filteredData?: VideoData[]): Map<string, Map<string, number>> {
    const data = filteredData || this.data;
    const topicKeywords = new Map<string, Map<string, number>>();

    data.forEach(item => {
      if (!topicKeywords.has(item.Topic_Label)) {
        topicKeywords.set(item.Topic_Label, new Map());
      }
      
      const keywords = item.Topic_Keywords?.split(',').map(k => k.trim()) || [];
      const topicMap = topicKeywords.get(item.Topic_Label)!;
      
      keywords.forEach(keyword => {
        if (keyword) {
          topicMap.set(keyword, (topicMap.get(keyword) || 0) + 1);
        }
      });
    });

    return topicKeywords;
  }

  getDominantEmotionByTopic(filteredData?: VideoData[]): Map<string, string> {
    const data = filteredData || this.data;
    const topicEmotions = new Map<string, Map<string, number>>();

    data.forEach(item => {
      if (!topicEmotions.has(item.Topic_Label)) {
        topicEmotions.set(item.Topic_Label, new Map());
      }
      
      const emotionMap = topicEmotions.get(item.Topic_Label)!;
      emotionMap.set(item.Emotion, (emotionMap.get(item.Emotion) || 0) + 1);
    });

    const dominantEmotions = new Map<string, string>();
    topicEmotions.forEach((emotionMap, topic) => {
      let maxCount = 0;
      let dominantEmotion = '';
      
      emotionMap.forEach((count, emotion) => {
        if (count > maxCount) {
          maxCount = count;
          dominantEmotion = emotion;
        }
      });
      
      dominantEmotions.set(topic, dominantEmotion);
    });

    return dominantEmotions;
  }

  // Note: Topic_Confidence is no longer used in the new data format
  getTopicConfidenceAvg(filteredData?: VideoData[]): { global: number; byTopic: Map<string, number> } {
    // Return default values since confidence is not available
    return {
      global: 0,
      byTopic: new Map<string, number>()
    };
  }

  getEntitiesFrequency(filteredData?: VideoData[], scope?: string): EntityFrequency[] {
    const data = filteredData || this.data;
    const entityMap = new Map<string, { count: number; type: string; topics: Set<string> }>();

    data.forEach(item => {
      if (scope && item.Topic_Label !== scope) return;
      
      // Process each NER field
      const nerFields = [
        { field: item.NER_Brand, type: 'BRAND' },
        { field: item.NER_Location, type: 'LOCATION' },
        { field: item.NER_Organization, type: 'ORG' },
        { field: item.NER_Person, type: 'PERSON' },
        { field: item.NER_Product, type: 'PRODUCT' }
      ];

      nerFields.forEach(({ field, type }) => {
        if (Array.isArray(field)) {
          field.forEach(entityText => {
            if (entityText && entityText.trim()) {
              const key = entityText.trim();
              if (!entityMap.has(key)) {
                entityMap.set(key, { count: 0, type, topics: new Set() });
              }
              
              const entityData = entityMap.get(key)!;
              entityData.count++;
              entityData.topics.add(item.Topic_Label);
            }
          });
        }
      });
    });

    return Array.from(entityMap.entries())
      .map(([text, data]) => ({
        text,
        type: data.type,
        count: data.count,
        topics: Array.from(data.topics)
      }))
      .sort((a, b) => b.count - a.count);
  }

  getTopicStats(filteredData?: VideoData[]) {
    const data = filteredData || this.data;
    const topicStats = new Map<string, {
      count: number;
      dominantEmotion: string;
      keywords: string[];
      emotions: Map<string, number>;
      entityCount: number;
      brands: Map<string, number>;
      products: Map<string, number>;
      locations: Map<string, number>;
      topBrands: string[];
      topProducts: string[];
      topLocations: string[];
    }>();

    data.forEach(item => {
      if (!topicStats.has(item.Topic_Label)) {
        topicStats.set(item.Topic_Label, {
          count: 0,
          dominantEmotion: '',
          keywords: [],
          emotions: new Map(),
          entityCount: 0,
          brands: new Map(),
          products: new Map(),
          locations: new Map(),
          topBrands: [],
          topProducts: [],
          topLocations: []
        });
      }

      const stats = topicStats.get(item.Topic_Label)!;
      stats.count++;
      
      // Track emotions
      stats.emotions.set(item.Emotion, (stats.emotions.get(item.Emotion) || 0) + 1);
      
      // Collect keywords
      const keywords = item.Topic_Keywords?.split(',').map(k => k.trim()) || [];
      keywords.forEach(keyword => {
        if (keyword && !stats.keywords.includes(keyword)) {
          stats.keywords.push(keyword);
        }
      });

      // Count entities and collect top entities
      const entityFields = [item.NER_Brand, item.NER_Location, item.NER_Organization, item.NER_Person, item.NER_Product];
      let entityCount = 0;
      entityFields.forEach(field => {
        if (Array.isArray(field)) {
          entityCount += field.length;
        }
      });
      stats.entityCount += entityCount;

      // Collect top brands
      if (Array.isArray(item.NER_Brand)) {
        item.NER_Brand.forEach(brand => {
          if (brand.trim()) {
            stats.brands.set(brand, (stats.brands.get(brand) || 0) + 1);
          }
        });
      }

      // Collect top products
      if (Array.isArray(item.NER_Product)) {
        item.NER_Product.forEach(product => {
          if (product.trim()) {
            stats.products.set(product, (stats.products.get(product) || 0) + 1);
          }
        });
      }

      // Collect top locations
      if (Array.isArray(item.NER_Location)) {
        item.NER_Location.forEach(location => {
          if (location.trim()) {
            stats.locations.set(location, (stats.locations.get(location) || 0) + 1);
          }
        });
      }
    });

    // Calculate dominant emotions and top entities
    topicStats.forEach(stats => {
      let maxEmotionCount = 0;
      stats.emotions.forEach((count, emotion) => {
        if (count > maxEmotionCount) {
          maxEmotionCount = count;
          stats.dominantEmotion = emotion;
        }
      });
      
      // Keep only top 5 keywords
      stats.keywords = stats.keywords.slice(0, 5);

      // Calculate top brands (top 3)
      stats.topBrands = Array.from(stats.brands.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([brand]) => brand);

      // Calculate top products (top 3)
      stats.topProducts = Array.from(stats.products.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([product]) => product);

      // Calculate top locations (top 3)
      stats.topLocations = Array.from(stats.locations.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([location]) => location);
    });

    return topicStats;
  }
}