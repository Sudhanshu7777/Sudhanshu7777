import { useState, useCallback } from 'react';
import { ClassificationRequest, ClassificationResponse } from '../types/classification';
import { ClassificationService } from '../services/classification';

interface UseClassificationReturn {
  classify: (request: ClassificationRequest) => Promise<ClassificationResponse | null>;
  result: ClassificationResponse | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for managing waste classification
 */
export const useClassification = (): UseClassificationReturn => {
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const classify = useCallback(async (request: ClassificationRequest): Promise<ClassificationResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ClassificationService.classifyWaste(request);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Classification failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback((): void => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    classify,
    result,
    isLoading,
    error,
    reset,
  };
};
