import { create } from 'zustand';
import { VideoData, FilterState } from '../lib/types';
import { DataService } from '../lib/data';

interface AppState {
  // Data
  data: VideoData[];
  filteredData: VideoData[];
  loading: boolean;
  error: string | null;
  
  // Filters
  filters: FilterState;
  
  // Actions
  loadData: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  searchData: (query: string) => void;
}

const initialFilters: FilterState = {
  platforms: [],
  emotions: [],
  topics: [],
  query: '',
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  data: [],
  filteredData: [],
  loading: false,
  error: null,
  filters: initialFilters,

  // Load data from CSV
  loadData: async () => {
    set({ loading: true, error: null });
    
    try {
      const dataService = DataService.getInstance();
      const data = await dataService.loadData();
      set({ 
        data, 
        filteredData: data, 
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load data', 
        loading: false 
      });
    }
  },

  // Update filters
  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
    get().applyFilters();
  },

  // Reset all filters
  resetFilters: () => {
    set({ filters: initialFilters });
    get().applyFilters();
  },

  // Apply current filters to data
  applyFilters: () => {
    const { data, filters } = get();
    const dataService = DataService.getInstance();
    
    let filtered = data;

    // Apply text search first
    if (filters.query) {
      filtered = dataService.searchData(filters.query);
    }

    // Apply other filters
    if (filters.platforms.length > 0) {
      filtered = filtered.filter(item => filters.platforms.includes(item.Platform));
    }

    if (filters.emotions.length > 0) {
      filtered = filtered.filter(item => filters.emotions.includes(item.Emotion));
    }

    if (filters.topics.length > 0) {
      filtered = filtered.filter(item => filters.topics.includes(item.Topic_Label));
    }

    // Date range filter (if implemented)
    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(item => {
        if (!item.publish_datetime) return true;
        const itemDate = new Date(item.publish_datetime);
        return itemDate >= filters.dateRange![0] && itemDate <= filters.dateRange![1];
      });
    }

    set({ filteredData: filtered });
  },

  // Search data
  searchData: (query) => {
    get().setFilters({ query });
  },
}));

// Selectors for computed values
export const useFilteredData = () => useAppStore(state => state.filteredData);
export const useFilters = () => useAppStore(state => state.filters);
export const useDataStats = () => useAppStore(state => {
  const dataService = DataService.getInstance();
  const data = state.filteredData;
  
  // Calculate total entities count
  const totalEntities = data.reduce((sum, item) => {
    const entityFields = [item.NER_Brand, item.NER_Location, item.NER_Organization, item.NER_Person, item.NER_Product];
    let entityCount = 0;
    entityFields.forEach(field => {
      if (Array.isArray(field)) {
        entityCount += field.length;
      }
    });
    return sum + entityCount;
  }, 0);
  
  return {
    totalVideos: data.length,
    uniqueTopics: new Set(data.map(item => item.Topic_Label)).size,
    uniqueEmotions: new Set(data.map(item => item.Emotion)).size,
    totalEntities: totalEntities,
    avgEntitiesPerVideo: data.length > 0 ? (totalEntities / data.length).toFixed(1) : '0',
    platformDistribution: data.reduce((acc, item) => {
      acc[item.Platform] = (acc[item.Platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    topEmotion: data.length > 0 
      ? Object.entries(data.reduce((acc, item) => {
          acc[item.Emotion] = (acc[item.Emotion] || 0) + 1;
          return acc;
        }, {} as Record<string, number>))
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
      : 'None'
  };
});

export const useTopicStats = () => useAppStore(state => {
  const dataService = DataService.getInstance();
  return dataService.getTopicStats(state.filteredData);
});

export const useEntityFrequency = (scope?: string) => useAppStore(state => {
  const dataService = DataService.getInstance();
  return dataService.getEntitiesFrequency(state.filteredData, scope);
});

export const useTopicEmotionMatrix = () => useAppStore(state => {
  const dataService = DataService.getInstance();
  return dataService.getTopicEmotionMatrix(state.filteredData);
});