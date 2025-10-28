const API_BASE_URL = 'http://localhost:8000';

export interface DetectionResult {
  id: number;
  type: string;
  confidence: number;
  area: string;
  severity: 'low' | 'medium' | 'high';
  action: 'Accept' | 'Review' | 'Reject';
  bbox: number[];
}

export interface PredictionResponse {
  success: boolean;
  detections: DetectionResult[];
  total_defects: number;
  image_base64: string;
  image_type: string;
}

export interface ModelInfo {
  model_loaded: boolean;
  defect_classes: string[];
  num_classes: number;
  model_path: string;
}

export class DefectDetectionAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  }

  async getModelInfo(): Promise<ModelInfo> {
    const response = await fetch(`${this.baseURL}/model-info`);
    if (!response.ok) {
      throw new Error('Failed to get model info');
    }
    return response.json();
  }

  async predictDefects(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Prediction failed');
    }

    return response.json();
  }

  async batchPredict(files: File[]): Promise<{ results: any[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(`${this.baseURL}/batch-predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Batch prediction failed');
    }

    return response.json();
  }
}

export const defectDetectionAPI = new DefectDetectionAPI();
