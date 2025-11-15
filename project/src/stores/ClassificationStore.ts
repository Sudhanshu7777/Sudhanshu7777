import { create } from 'zustand';
import { ClassificationRequest, ClassificationResponse } from '../types/classification';
import { ClassificationService } from '../services/classification';

interface ClassificationState {
  // State
  request: ClassificationRequest | null;
  result: ClassificationResponse | null;
  isLoading: boolean;
  error: string | null;
  history: ClassificationResponse[];
  
  // Actions
  setRequest: (request: ClassificationRequest) => void;
  setLoading: (loading: boolean) => void;
  setResult: (result: ClassificationResponse) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  classifyWaste: (request: ClassificationRequest) => Promise<void>;
  loadHistory: () => Promise<void>;
  
  // Computed
  hasResult: () => boolean;
  isProcessing: () => boolean;
}

export const useClassificationStore = create<ClassificationState>((set, get) => ({
  // Initial state
  request: null,
  result: null,
  isLoading: false,
  error: null,
  history: [],

  // Actions
  setRequest: (request) => set({ request }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setResult: (result) => set({ result }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    request: null,
    result: null,
    isLoading: false,
    error: null,
  }),

  classifyWaste: async (request) => {
    set({ isLoading: true, error: null, request });
    
    try {
      const result = await ClassificationService.classifyWaste(request);
      set({ result, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Classification failed';
      set({ error: errorMessage, isLoading: false });
    }
  },

  loadHistory: async () => {
    try {
      const history = await ClassificationService.getClassificationHistory();
      set({ history });
    } catch (error) {
      console.error('Failed to load classification history:', error);
    }
  },

  // Computed
  hasResult: () => {
    const { result } = get();
    return result !== null;
  },

  isProcessing: () => {
    const { isLoading } = get();
    return isLoading;
  },
}));
