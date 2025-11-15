import { api } from './api';
import { ClassificationRequest, ClassificationResponse } from '../types/classification';

/**
 * Classification service for waste classification API
 */
export class ClassificationService {
  /**
   * Classify waste image
   */
  static async classifyWaste(request: ClassificationRequest): Promise<ClassificationResponse> {
    try {
      const response = await api.upload<ClassificationResponse>('/classify', request.image, {
        location: request.location ? JSON.stringify(request.location) : undefined,
      });
      
      return response.data;
    } catch (error) {
      console.error('Classification failed:', error);
      throw new Error('Failed to classify waste image');
    }
  }

  /**
   * Get classification history
   */
  static async getClassificationHistory(limit: number = 10): Promise<ClassificationResponse[]> {
    try {
      const response = await api.get<ClassificationResponse[]>('/history', { limit });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch classification history:', error);
      throw new Error('Failed to fetch classification history');
    }
  }

  /**
   * Get classification details by ID
   */
  static async getClassificationById(id: string): Promise<ClassificationResponse> {
    try {
      const response = await api.get<ClassificationResponse>(`/classify/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch classification details:', error);
      throw new Error('Failed to fetch classification details');
    }
  }

  /**
   * Submit feedback on classification
   */
  static async submitFeedback(
    classificationId: string, 
    feedback: { correct: boolean; actualCategory?: string; notes?: string }
  ): Promise<void> {
    try {
      await api.post(`/classify/${classificationId}/feedback`, feedback);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  }
}
