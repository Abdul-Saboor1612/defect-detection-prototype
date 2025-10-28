// Test images service for expert panel testing
export interface TestImage {
  id: string;
  name: string;
  defectType: string;
  description: string;
  filename: string;
  category: 'defect' | 'normal';
}

export const testImages: TestImage[] = [
  // Crazing defects
  {
    id: 'crazing_1',
    name: 'Surface Crazing #1',
    defectType: 'crazing',
    description: 'Fine surface cracks forming a network pattern',
    filename: 'crazing_241.jpg',
    category: 'defect'
  },
  {
    id: 'crazing_2',
    name: 'Surface Crazing #2',
    defectType: 'crazing',
    description: 'Heavy crazing with visible crack patterns',
    filename: 'crazing_250.jpg',
    category: 'defect'
  },
  {
    id: 'crazing_3',
    name: 'Surface Crazing #3',
    defectType: 'crazing',
    description: 'Light surface crazing pattern',
    filename: 'crazing_275.jpg',
    category: 'defect'
  },

  // Inclusion defects
  {
    id: 'inclusion_1',
    name: 'Material Inclusion #1',
    defectType: 'inclusion',
    description: 'Foreign material embedded in surface',
    filename: 'inclusion_241.jpg',
    category: 'defect'
  },
  {
    id: 'inclusion_2',
    name: 'Material Inclusion #2',
    defectType: 'inclusion',
    description: 'Large inclusion defect',
    filename: 'inclusion_260.jpg',
    category: 'defect'
  },
  {
    id: 'inclusion_3',
    name: 'Material Inclusion #3',
    defectType: 'inclusion',
    description: 'Small inclusion spot',
    filename: 'inclusion_290.jpg',
    category: 'defect'
  },

  // Patches defects
  {
    id: 'patches_1',
    name: 'Surface Patches #1',
    defectType: 'patches',
    description: 'Irregular surface patches',
    filename: 'patches_241.jpg',
    category: 'defect'
  },
  {
    id: 'patches_2',
    name: 'Surface Patches #2',
    defectType: 'patches',
    description: 'Multiple patch defects',
    filename: 'patches_270.jpg',
    category: 'defect'
  },
  {
    id: 'patches_3',
    name: 'Surface Patches #3',
    defectType: 'patches',
    description: 'Large patch area',
    filename: 'patches_295.jpg',
    category: 'defect'
  },

  // Pitted surface defects
  {
    id: 'pitted_1',
    name: 'Pitted Surface #1',
    defectType: 'pitted_surface',
    description: 'Surface pitting and corrosion',
    filename: 'pitted_surface_241.jpg',
    category: 'defect'
  },
  {
    id: 'pitted_2',
    name: 'Pitted Surface #2',
    defectType: 'pitted_surface',
    description: 'Heavy pitting damage',
    filename: 'pitted_surface_265.jpg',
    category: 'defect'
  },
  {
    id: 'pitted_3',
    name: 'Pitted Surface #3',
    defectType: 'pitted_surface',
    description: 'Light surface pitting',
    filename: 'pitted_surface_285.jpg',
    category: 'defect'
  },

  // Rolled-in scale defects
  {
    id: 'scale_1',
    name: 'Rolled-in Scale #1',
    defectType: 'rolled-in_scale',
    description: 'Scale layer rolled into surface',
    filename: 'rolled-in_scale_241.jpg',
    category: 'defect'
  },
  {
    id: 'scale_2',
    name: 'Rolled-in Scale #2',
    defectType: 'rolled-in_scale',
    description: 'Heavy scale inclusion',
    filename: 'rolled-in_scale_255.jpg',
    category: 'defect'
  },
  {
    id: 'scale_3',
    name: 'Rolled-in Scale #3',
    defectType: 'rolled-in_scale',
    description: 'Multiple scale defects',
    filename: 'rolled-in_scale_280.jpg',
    category: 'defect'
  },

  // Scratches defects
  {
    id: 'scratches_1',
    name: 'Surface Scratches #1',
    defectType: 'scratches',
    description: 'Deep surface scratches',
    filename: 'scratches_241.jpg',
    category: 'defect'
  },
  {
    id: 'scratches_2',
    name: 'Surface Scratches #2',
    defectType: 'scratches',
    description: 'Multiple scratch lines',
    filename: 'scratches_260.jpg',
    category: 'defect'
  },
  {
    id: 'scratches_3',
    name: 'Surface Scratches #3',
    defectType: 'scratches',
    description: 'Light surface abrasions',
    filename: 'scratches_290.jpg',
    category: 'defect'
  }
];

export const getTestImageUrl = (filename: string): string => {
  // Get the API base URL from environment or use default
  const API_BASE_URL = 'http://localhost:8000';
  return `${API_BASE_URL}/test-images/${filename}`;
};

export const getTestImagesByType = (defectType: string): TestImage[] => {
  return testImages.filter(img => img.defectType === defectType);
};

export const getRandomTestImage = (): TestImage => {
  const randomIndex = Math.floor(Math.random() * testImages.length);
  return testImages[randomIndex];
};

export const getTestImagesByCategory = (category: 'defect' | 'normal'): TestImage[] => {
  return testImages.filter(img => img.category === category);
};
